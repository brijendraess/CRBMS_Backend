import { Op } from "sequelize";
import CommitteeMember from "../models/CommitteeMember.models.js";
import Meeting from "../models/Meeting.models.js";
import MeetingCommittee from "../models/MeetingCommittee.js";
import MeetingUser from "../models/MeetingUser.js";
import Notification from "../models/Notification.models.js";
import Room from "../models/Room.models.js";
import User from "../models/User.models.js";
import { meetingStartingIn30Min, roomBookingChangeStatusEmail } from "../nodemailer/roomEmail.js";
import { getRoomByIdService } from "../services/Room.service.js";
import { getUserByIdService } from "../services/User.service.js";
import { cancelledEventMeetingData, eventMeetingData, meetingStartingIn30MinData, updateEventMeetingData } from "../utils/ics.js";
import { sendSms30MinBefore, sendSmsCompleteHelper } from "./sendSMS.helper.js";

export class CronHelper {
    static async sendSmsAndEmailBefore30Min() {
        console.log("Cron started")
        const now = new Date(); // Current UTC time
        const thirtyMinutesAfter = new Date(now.getTime() + 30 * 60 * 1000); 

        const formatter = new Intl.DateTimeFormat('en-IN', {
            timeZone: process.env.TIMEZONE,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23', // Use 24-hour format
        });
          
        const after30Min = formatter.format(thirtyMinutesAfter);
        const currentHour = formatter.format(now);

        const reqDate = now.toISOString().split("T")[0];

        const formattedCurrentHour = currentHour.padStart(8, '0').replace('.', ':');
        const formattedAfter30Min = after30Min.padStart(8, '0').replace('.', ':');

        const meeting = await Meeting.findAll({
            where: {
                meetingDate: reqDate,
                startTime: {
                    [Op.between]: [formattedCurrentHour, formattedAfter30Min]
                },
                status: "scheduled",
                before30MinMailSent: false
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

                // const meetingStatus = "cancelled";
                // Fetch the data for email
                const rooms = await getRoomByIdService(meetingData?.dataValues?.roomId);
                const organizer = await getUserByIdService(
                    meetingData?.dataValues.organizerId
                );

                const emailTemplateValues = {
                    subject: meetingData?.dataValues?.subject,
                    agenda: meetingData?.dataValues?.agenda,
                    notes: meetingData?.dataValues.notes,
                    roomName: rooms[0]?.dataValues?.name,
                    bookingDate: meetingData?.dataValues.meetingDate,
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
                    sequence: 2,
                };
                //   const eventDetails = updateEventMeetingData(eventData);
                const eventDetails = meetingStartingIn30MinData(eventData);

                // Notifications will be done here
                attendees &&
                    attendees.forEach(async (attendee) => {
                        const members = await User.findOne({
                            where: { id: attendee.dataValues.UserId },
                            attributes: ["email", "fullname"],
                        });
                        // Header notification section
                        await Notification.create({
                            type: `Meeting Reminder`,
                            message: `The meeting "${meeting[0]?.dataValues?.subject}" will start in 30 minutes.`,
                            userId: attendee.dataValues.UserId,
                            isRead: false,
                            meetingId: meetingData?.dataValues?.id,
                        });


                        // Sending email to all attendees
                        const emailTemplateValuesSet = {
                            ...emailTemplateValues,
                            recipientName: members?.dataValues?.fullname,
                        };
                        await meetingStartingIn30Min(
                            eventDetails,
                            members?.dataValues?.email,
                            emailTemplateValuesSet
                        );
                        // End of Email sending section

                        // Send SMS to all user
                        const templateValue = {
                            name: members?.dataValues?.fullname
                        };
                        sendSms30MinBefore(members?.dataValues?.phoneNumber, templateValue);
                        // End of the SMS section
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
                                    type: `Meeting Reminder`,
                                    message: `The meeting "${meeting[0]?.dataValues?.subject}" will start in 30 minutes.`,
                                    userId: member?.dataValues?.User?.dataValues?.id,
                                    isRead: false,
                                    meetingId: meetingData?.dataValues?.id,
                                });

                                // Sending email to all attendees
                                const emailTemplateValuesSet = {
                                    ...emailTemplateValues,
                                    recipientName: member?.dataValues?.User?.dataValues?.fullname,
                                };
                                await meetingStartingIn30Min(
                                    eventDetails,
                                    member?.dataValues?.User?.dataValues?.email,
                                    emailTemplateValuesSet
                                );
                                // End of Email sending section

                                 // Send SMS to all user
                                const templateValue = {
                                    name: member?.dataValues?.fullname
                                };
                                sendSms30MinBefore(member?.dataValues?.phoneNumber, templateValue);
                                // End of the SMS section
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
                        await meetingStartingIn30Min(
                            eventDetails,
                            quest,
                            emailTemplateValuesSet
                        );
                        // End of Email sending section
                    });
            });
        }

        if (meeting.length > 0) {
            await Meeting.update(
                { before30MinMailSent: true }, // The field to update
                {
                    where: {
                        id: meeting.map(meetingData =>  meetingData?.dataValues?.id), // Update only the found meetings
                    },
                }
            );
        }
        console.log("Cron executed successfully.")
    }

    static async sendSmsAndEmailAfterCompletion() {
        console.log("Cron for meeting completion started")
        const now = new Date(); // Current UTC time

        const formatter = new Intl.DateTimeFormat('en-IN', {
            timeZone: process.env.TIMEZONE,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23', // Use 24-hour format
        });
          
        const currentHour = formatter.format(now);

        const reqDate = now.toISOString().split("T")[0];

        const formattedCurrentHour = currentHour.padStart(8, '0').replace('.', ':');

        const meeting = await Meeting.findAll({
            where: {
                meetingDate: reqDate,
                endTime: {
                    [Op.lte]: formattedCurrentHour
                },
                status: "scheduled",
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

        const meetingStatus = "completed";

        console.log(meeting, "mee")
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

                // const meetingStatus = "cancelled";
                // Fetch the data for email
                const rooms = await getRoomByIdService(meetingData?.dataValues?.roomId);
                const organizer = await getUserByIdService(
                    meetingData?.dataValues.organizerId
                );

                const emailTemplateValues = {
                    subject: meetingData?.dataValues?.subject,
                    agenda: meetingData?.dataValues?.agenda,
                    notes: meetingData?.dataValues.notes,
                    roomName: rooms[0]?.dataValues?.name,
                    bookingDate: meetingData?.dataValues.meetingDate,
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
                    sequence: 2,
                };
                //   const eventDetails = updateEventMeetingData(eventData);
                const eventDetails = eventMeetingData(eventData);

                // Notifications will be done here
                attendees &&
                    attendees.forEach(async (attendee) => {
                        const members = await User.findOne({
                            where: { id: attendee?.dataValues?.UserId },
                            attributes: ["email", "fullname"],
                        });
                        // Header notification section
                        await Notification.create({
                            type: `Meeting ${meetingStatus}`,
                            message: `The meeting "${meeting[0]?.dataValues?.subject}" has been ${meetingStatus}.`,
                            userId: attendee?.dataValues?.UserId,
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

                        // Send SMS to all user
                        const templateValue = {
                            name: members?.dataValues?.fullname
                          };
                          sendSmsCompleteHelper(members?.dataValues?.phoneNumber, templateValue);
                        // End of the SMS section
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

                                 // Send SMS to all user
                                 const templateValue = {
                                    name: member?.dataValues?.fullname
                                  };
                                  sendSmsCompleteHelper(member?.dataValues?.phoneNumber, templateValue);
                                // End of the SMS section
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

        if (meeting.length > 0) {
            await Meeting.update(
                { status: "completed" }, // The field to update
                {
                    where: {
                        id: meeting.map(meetingData =>  meetingData?.dataValues?.id), // Update only the found meetings
                    },
                }
            );
        }
        console.log("Cron executed successfully.")
    }
}