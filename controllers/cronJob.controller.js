import Meeting from "../models/Meeting.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.models.js";
import Room from "../models/Room.models.js";
import { Op } from "sequelize";
import MeetingUser from "../models/MeetingUser.js";
import MeetingCommittee from "../models/MeetingCommittee.js";
import { getRoomByIdService } from "../services/Room.service.js";
import { getUserByIdService } from "../services/User.service.js";
import Notification from "../models/Notification.models.js";
import { cancelledEventMeetingData } from "../utils/ics.js";
import { roomBookingChangeStatusEmail, roomBookingOrganizerEmail } from "../nodemailer/roomEmail.js";
import { eFileController } from "./eFile.comtroller.js";
import CommitteeMember from "../models/CommitteeMember.models.js";

export const autoMeetingCron = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Define the 15-minute time range
  const now = new Date();
  const fifteenMinutesAfter = new Date();
  fifteenMinutesAfter.setMinutes(now.getMinutes() + 15);

  const meeting = await Meeting.findAll({
    where: {
      meetingDate: {
        [Op.between]: [startOfToday, endOfToday],
      },
      startTime: {
        [Op.lt]: fifteenMinutesAfter, // Meetings started more than 15 minutes ago
      },
      status: {
        [Op.in]: ["pending"],
      },
    },
    include: [
      {
        model: User,
      },
      {
        model: Room,
      },
    ],
  });

  if (!meeting) {
    throw new ApiError(404, "meeting not found");
  }

  if (meeting) {
    meeting.map(async (meetingData) => {
      await Meeting.update(
        { status: "cancelled" },
        {
          where: { id: meetingData?.dataValues?.id },
        }
      ).then(async () => {
        const attendees = await MeetingUser?.findAll({
          where: {
            MeetingId: meetingData?.dataValues?.id,
          },
        });

        const committees = await MeetingCommittee?.findAll({
          where: {
            MeetingId: meetingData?.dataValues?.id,
          },
        });

        const meetingStatus = "cancelled";
        // Fetch the data for email
        const rooms = await getRoomByIdService(meetingData?.dataValues?.roomId);
        const organizer = await getUserByIdService(
          meetingData?.dataValues.organizerId
        );
        const emailTemplateValues = {
          subject: meetingData?.dataValues?.subject,
          agenda: meetingData?.dataValues?.agenda,
          notes: meetingData?.dataValues?.notes,
          roomName: rooms[0]?.dataValues?.name,
          bookingDate: meetingData?.dataValues?.meetingDate,
          startTime: meetingData?.dataValues?.startTime,
          endTime: meetingData?.dataValues?.endTime,
          location: rooms[0]?.dataValues?.Location?.locationName,
          organizerName: organizer[0]?.dataValues?.fullname,
        };

        const eventData = {
          uid: meetingData?.dataValues?.id,
          meetingDate: meetingData?.dataValues?.meetingDate,
          startTime: meetingData?.dataValues?.startTime,
          endTime: meetingData?.dataValues?.endTime,
          summary: meetingData?.dataValues?.subject,
          description: meetingData?.dataValues?.notes,
          location: rooms[0]?.dataValues?.Location?.locationName,
          sequence: 4,
          organizerName: organizer[0]?.dataValues?.fullname,
          organizerEmail: organizer[0]?.dataValues?.email,
        };
        const eventDetails = cancelledEventMeetingData(eventData);

        // Notifications will be done here
        attendees &&
          attendees.forEach(async (attendee) => {
            const members = await User.findOne({
              where: { id: attendee.dataValues.UserId },
              attributes: ["email", "fullname"],
            });
            // Header notification section
            await Notification.create({
              type: `Meeting ${meetingStatus}`,
              message: `The meeting "${meeting[0]?.dataValues?.subject}" has been ${meetingStatus}.`,
              userId: attendee.dataValues.UserId,
              isRead: false,
              meetingId: meetingData?.dataValues?.id,
            });

            // Sending email to all attendees
            const emailTemplateValuesSet = {
              ...emailTemplateValues,
              recipientName: members?.dataValues?.fullname,
            };
            await roomBookingChangeStatusEmail(
              eventDetails,
              members?.dataValues?.email,
              emailTemplateValuesSet,
              meetingStatus
            );
            // End of Email sending section
          });

        // Notifications will be done here for all committee user
        committees &&
          committees.forEach(async (committee) => {
            const members = await CommitteeMember?.findAll({
              where: { committeeId: committee?.dataValues?.CommitteeId },
              include: [
                {
                  model: User,
                  attributes: ["email", "fullname", "avatarPath"],
                },
              ],
            });
            members &&
              members?.map(async (member) => {
                // Header notification section
                await Notification.create({
                  type: `Meeting ${meetingStatus}`,
                  message: `The meeting "${meeting[0]?.dataValues?.subject}" has been ${meetingStatus}.`,
                  userId: member?.dataValues?.User?.dataValues?.id,
                  isRead: false,
                  meetingId: meetingData?.dataValues?.id,
                });

                // Sending email to all attendees
                const emailTemplateValuesSet = {
                  ...emailTemplateValues,
                  recipientName: member?.dataValues?.User?.dataValues?.fullname,
                };
                await roomBookingChangeStatusEmail(
                  eventDetails,
                  member?.dataValues?.User?.dataValues?.email,
                  emailTemplateValuesSet,
                  meetingStatus
                );
                // End of Email sending section
              });
          });

        // Notifications will be done here for all quest user
        meeting?.dataValues?.guestUser &&
          meeting?.dataValues?.guestUser.split(",").forEach(async (quest) => {
            // Sending email to all attendees
            const recipientName = quest.split("@")[0];
            const emailTemplateValuesSet = {
              ...emailTemplateValues,
              recipientName: recipientName,
            };
            await roomBookingChangeStatusEmail(
              eventDetails,
              quest,
              emailTemplateValuesSet,
              meetingStatus
            );
            // End of Email sending section
          });
      });
    });
  }
  res.status(200).json({
    success: true,
    message: "cron executed successfully!!",
    meeting,
  });
});

export const meetingNotificationBeforeFifteenMinCron = asyncHandler(
  async (req, res) => {
    const now = new Date();
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(now.getMinutes() - 15);

    const meeting = await Meeting.findAll({
      where: {
        meetingDate: {
          [Op.eq]: now.toISOString().split("T")[0], // Ensure it's today's meetings
        },
        startTime: {
          [Op.between]: [now, fifteenMinutesAgo], // Start time within the next 15 minutes
        },
      },
      include: [
        {
          model: User,
        },
        {
          model: Room,
        },
      ],
    });

    if (!meeting) {
      throw new ApiError(404, "meeting not found");
    }

    if (meeting) {
      meeting.map(async (meetingData) => {
        const attendees = await MeetingUser?.findAll({
          where: {
            MeetingId: meetingData?.dataValues?.id,
          },
        });

        const committees = await MeetingCommittee?.findAll({
          where: {
            MeetingId: meetingData?.dataValues?.id,
          },
        });

        const meetingStatus = "cancelled";
        // Fetch the data for email
        const rooms = await getRoomByIdService(meetingData?.dataValues?.roomId);
        const organizer = await getUserByIdService(
          meetingData?.dataValues.organizerId
        );
        const emailTemplateValues = {
          subject: meetingData?.dataValues?.subject,
          agenda: meetingData?.dataValues?.agenda,
          notes: meetingData?.dataValues?.notes,
          roomName: rooms[0]?.dataValues?.name,
          bookingDate: meetingData?.dataValues?.meetingDate,
          startTime: meetingData?.dataValues?.startTime,
          endTime: meetingData?.dataValues?.endTime,
          location: rooms[0]?.dataValues?.Location?.locationName,
          organizerName: organizer[0]?.dataValues?.fullname,
        };

        const eventData = {
          uid: meetingData?.dataValues?.id,
          meetingDate: meetingData?.dataValues?.meetingDate,
          startTime: meetingData?.dataValues?.startTime,
          endTime: meetingData?.dataValues?.endTime,
          summary: meetingData?.dataValues?.subject,
          description: meetingData?.dataValues?.notes,
          location: rooms[0]?.dataValues?.Location?.locationName,
          sequence: 4,
          organizerName: organizer[0]?.dataValues?.fullname,
          organizerEmail: organizer[0]?.dataValues?.email,
        };
        const eventDetails = cancelledEventMeetingData(eventData);

        // Notifications will be done here
        attendees &&
          attendees.forEach(async (attendee) => {
            const members = await User.findOne({
              where: { id: attendee.dataValues.UserId },
              attributes: ["email", "fullname"],
            });
            // Header notification section
            await Notification.create({
              type: `Meeting ${meetingStatus}`,
              message: `The meeting "${meeting[0]?.dataValues?.subject}" has been ${meetingStatus}.`,
              userId: attendee.dataValues.UserId,
              isRead: false,
              meetingId: meetingData?.dataValues?.id,
            });

            // Sending email to all attendees
            const emailTemplateValuesSet = {
              ...emailTemplateValues,
              recipientName: members?.dataValues?.fullname,
            };
            await roomBookingChangeStatusEmail(
              eventDetails,
              members?.dataValues?.email,
              emailTemplateValuesSet,
              meetingStatus
            );
            // End of Email sending section
          });

        // Notifications will be done here for all committee user
        committees &&
          committees.forEach(async (committee) => {
            const members = await CommitteeMember?.findAll({
              where: { committeeId: committee?.dataValues?.CommitteeId },
              include: [
                {
                  model: User,
                  attributes: ["email", "fullname", "avatarPath"],
                },
              ],
            });
            members &&
              members?.map(async (member) => {
                // Header notification section
                await Notification.create({
                  type: `Meeting ${meetingStatus}`,
                  message: `The meeting "${meeting[0]?.dataValues?.subject}" has been ${meetingStatus}.`,
                  userId: member?.dataValues?.User?.dataValues?.id,
                  isRead: false,
                  meetingId: meetingData?.dataValues?.id,
                });

                // Sending email to all attendees
                const emailTemplateValuesSet = {
                  ...emailTemplateValues,
                  recipientName: member?.dataValues?.User?.dataValues?.fullname,
                };
                await roomBookingChangeStatusEmail(
                  eventDetails,
                  member?.dataValues?.User?.dataValues?.email,
                  emailTemplateValuesSet,
                  meetingStatus
                );
                // End of Email sending section
              });
          });

        // Notifications will be done here for all quest user
        meeting?.dataValues?.guestUser &&
          meeting?.dataValues?.guestUser.split(",").forEach(async (quest) => {
            // Sending email to all attendees
            const recipientName = quest.split("@")[0];
            const emailTemplateValuesSet = {
              ...emailTemplateValues,
              recipientName: recipientName,
            };
            await roomBookingChangeStatusEmail(
              eventDetails,
              quest,
              emailTemplateValuesSet,
              meetingStatus
            );
            // End of Email sending section
          });
      });
    }
    res.status(200).json({
      success: true,
      message: "Cron executed successfully for meeting starts in 15 minutes!!",
      meeting,
    });
  }
);

export const sendEmailToOrganizerToExtendMeetingCron = asyncHandler(
  async (req, res) => {
    const now = new Date();
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(now.getMinutes() - 30);

    const meeting = await Meeting.findAll({
      where: {
        meetingDate: {
          [Op.eq]: now.toISOString().split("T")[0], // Ensure it's today's meetings
        },
        endTime: {
          [Op.between]: [now, thirtyMinutesAgo], // Start time within the next 30 minutes
        },
      },
      include: [
        {
          model: User,
        },
        {
          model: Room,
        },
      ],
    });

    if (!meeting) {
      throw new ApiError(404, "meeting not found");
    }

    if (meeting) {
      meeting.map(async (meetingData) => {
        
        // Fetch the data for email
        const rooms = await getRoomByIdService(meetingData?.dataValues?.roomId);
        const organizer = await getUserByIdService(
          meetingData?.dataValues.organizerId
        );
        const emailTemplateValues = {
          roomName: rooms[0]?.dataValues?.name,
          bookingDate: meetingData?.dataValues?.meetingDate,
          startTime: meetingData?.dataValues?.startTime,
          endTime: meetingData?.dataValues?.endTime,
          organizerName: organizer[0]?.dataValues?.fullname,
          newEndTime:'',
        };

            // Sending email to all attendees
            const emailTemplateValuesSet = {
              ...emailTemplateValues,
              recipientName: organizer[0]?.dataValues?.fullname,
            };
            await roomBookingOrganizerEmail(
                organizer[0]?.dataValues?.email,
              emailTemplateValuesSet
            );
            // End of Email sending section
      });
    }
    res.status(200).json({
      success: true,
      message: "Cron executed successfully to organizer for extend meeting starts in 30 minutes!!",
      meeting,
    });
  }
);

