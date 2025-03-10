import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Meeting from "../models/Meeting.models.js";
import Room from "../models/Room.models.js";
import User from "../models/User.models.js";
import { Op } from "sequelize";
import { sequelize } from "../database/database.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import MeetingUser from "../models/MeetingUser.js";
import Location from "../models/Location.model.js";
import MeetingCommittee from "../models/MeetingCommittee.js";
import CommitteeMember from "../models/CommitteeMember.models.js";
import Committee from "../models/Committee.models.js";
import Notification from "../models/Notification.models.js";
import {
  meetingSwapEmail,
  roomBookingChangeStatusEmail,
  roomBookingEmail,
  roomBookingPostponeEmail,
  roomBookingRequestEmail,
  roomBookingUpdateEmail,
} from "../nodemailer/roomEmail.js";
import { getRoomByIdService } from "../services/Room.service.js";
import {
  getAllAdminUser,
  getUserByIdService,
} from "../services/User.service.js";
import {
  cancelledEventMeetingData,
  eventMeetingData,
  formatDateToICS,
  postponeEventMeetingData,
  updateEventMeetingData,
} from "../utils/ics.js";
import {
  sendSmsCancelHelper,
  sendSmsCompleteHelper,
  sendSmsEditedHelper,
  sendSmsPostponeHelper,
  sendSmsScheduledHelper,
  sendSmsStartHelper,
  sendSmsToAdminForApproveHelper,
} from "../helpers/sendSMS.helper.js";
import { formatTimeShort, getFormattedDate } from "../utils/utils.js";
import moment from "moment";
import MeetingAttendeeType from "../models/MeetingAttendeeType.js";
import UserType from "../models/UserType.model.js";
import CommitteeType from "../models/CommitteeType.models.js";

export const addMeeting = asyncHandler(async (req, res) => {
  const {
    roomId,
    organizerId,
    subject,
    notes,
    agenda,
    guestUser,
    startTime,
    additionalEquipment,
    endTime,
    date,
    isPrivate,
    attendees,
    committees,
    attendeesType
  } = req.body;

  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(400, "Please Login To Book A Room");
  }

  if (!roomId) {
    throw new ApiError(404, "Room Not Found, Please Select a Valid Room");
  }

  if (!agenda || !subject || !startTime || !endTime || !date) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const room = await Room.findByPk(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Checking the available time of the room
  const sanitationPeriod = room.dataValues.sanitationPeriod || 0;
  const tolerancePeriod = room.dataValues.tolerancePeriod || 0;
  let newFormattedStartTime = new Date(startTime); // HH:mm:ss
  const extraCalculatedTime = sanitationPeriod + tolerancePeriod;
  newFormattedStartTime.setMinutes(
    newFormattedStartTime.getMinutes() - extraCalculatedTime
  );
  const newFormattedStartTimeChecked = newFormattedStartTime
    .toTimeString()
    .split(" ")[0];

  // Convert startTime and endTime to TIME format
  const formattedStartTime = new Date(startTime).toTimeString().split(" ")[0]; // HH:mm:ss
  const formattedEndTime = new Date(endTime).toTimeString().split(" ")[0]; // HH:mm:ss
  const overlappingMeeting = await Meeting.findOne({
    where: {
      roomId,
      meetingDate: date,
      startTime: { [Op.lt]: formattedEndTime },
      endTime: { [Op.gt]: newFormattedStartTimeChecked },
    },
  });
  if (overlappingMeeting) {
    throw new ApiError(400, "Room is already booked for the selected time");
  }

  const newMeeting = await Meeting.create({
    roomId,
    organizerId,
    userId,
    subject,
    notes,
    agenda,
    guestUser,
    additionalEquipment,
    startTime: formattedStartTime,
    endTime: formattedEndTime,
    meetingDate: date,
    isPrivate: isPrivate || false,
  });
  const attendeesArray = attendees.map((userId) => ({
    MeetingId: newMeeting.dataValues.id,
    UserId: userId,
  }));
  const committeesArray = committees.map((committee) => ({
    MeetingId: newMeeting.dataValues.id,
    CommitteeId: committee,
  }));

  const attendeesTypeArray = attendeesType.map((attendeeType) => ({
    meetingId: newMeeting.dataValues.id,
    userTypeId: attendeeType,
  }));

  // Bulk insert into MeetingAttendeesType
  await MeetingAttendeeType.bulkCreate(attendeesTypeArray);

  // Bulk insert into MeetingUser
  await MeetingUser.bulkCreate(attendeesArray);

  // Bulk insert into MeetingCommittee
  await MeetingCommittee.bulkCreate(committeesArray);

  // Fetch the data for email
  const rooms = await getRoomByIdService(roomId);
  const organizer = await getUserByIdService(organizerId);
  const emailTemplateValues = {
    subject: newMeeting?.dataValues?.subject,
    agenda: newMeeting?.dataValues?.agenda,
    notes: newMeeting?.dataValues?.notes,
    roomName: rooms[0]?.dataValues?.name,
    bookingDate: newMeeting?.dataValues?.meetingDate,
    startTime: newMeeting?.dataValues?.startTime,
    endTime: newMeeting?.dataValues?.endTime,
    location: rooms[0]?.dataValues?.Location?.locationName,
    organizerName: organizer[0]?.dataValues?.fullname,
  };

  const eventData = {
    uid: newMeeting?.dataValues?.id,
    meetingDate: newMeeting?.dataValues?.meetingDate,
    startTime: newMeeting?.dataValues?.startTime,
    endTime: newMeeting?.dataValues?.endTime,
    summary: newMeeting?.dataValues?.subject,
    description: newMeeting?.dataValues?.notes,
    location: rooms[0]?.dataValues?.Location?.locationName,
    sequence: 2,
  };
  const eventDetails = updateEventMeetingData(eventData);

  const adminUser = await getAllAdminUser();
  adminUser.map(async (item) => {
    // Send SMS to admin to approve the meeting
    const templateValue = {
      name: item?.fullname,
      date: getFormattedDate(item?.meetingDate),
      startTime: formatTimeShort(startTime),
      endTime: formatTimeShort(endTime),
    };
    await sendSmsToAdminForApproveHelper(item?.phoneNumber, templateValue);
    // End of the SMS section

    // Sending email to all attendees
    const emailTemplateValuesSet = {
      ...emailTemplateValues,
      name: item?.fullname,
    };
    await roomBookingRequestEmail(
      eventDetails,
      item?.email,
      emailTemplateValuesSet
    );
    // End of Email sending section
  });

  // Notifications will be done here
  attendees &&
    attendees.forEach(async (attendee) => {
      const members = await User.findOne({
        where: { id: attendee },
        attributes: ["id", "email", "fullname"],
      });
      // Header notification section
      await Notification.create({
        type: "Meeting Creation",
        message: `The meeting "${newMeeting?.dataValues?.subject}" has been created.`,
        userId: members?.dataValues?.id,
        isRead: false,
        meetingId: newMeeting?.id,
      });

      // Sending email to all attendees
      const emailTemplateValuesSet = {
        ...emailTemplateValues,
        recipientName: members?.dataValues?.fullname,
      };
      // await roomBookingEmail(
      //   eventDetails,
      //   members?.dataValues?.email,
      //   emailTemplateValuesSet
      // );
      // End of Email sending section
    });

  // Notifications will be done here for all committee user
  committees &&
    committees.forEach(async (committee) => {
      const members = await CommitteeMember.findAll({
        where: { committeeId: committee },
        include: [
          {
            model: User,
            attributes: ["email", "fullname", "avatarPath"],
          },
          {
            model: Committee,
          },
        ],
      });
      members &&
        members?.map(async (member) => {
          // Header notification section
          await Notification.create({
            type: "Meeting Creation",
            message: `The meeting "${newMeeting?.dataValues?.subject}" has been created.`,
            userId: member?.dataValues?.userId,
            isRead: false,
            meetingId: newMeeting?.id,
          });

          // Sending email to all attendees
          const emailTemplateValuesSet = {
            ...emailTemplateValues,
            recipientName: member?.dataValues?.User?.dataValues?.fullname,
          };
          // await roomBookingEmail(
          //   eventDetails,
          //   member?.dataValues?.User?.dataValues?.email,
          //   emailTemplateValuesSet
          // );
          // End of Email sending section
        });
    });

  // Notifications will be done here for all quest user
  // guestUser &&
  //   guestUser.split(",").forEach(async (quest) => {
  //     // Sending email to all attendees
  //     const recipientName = quest.split("@")[0];
  //     const emailTemplateValuesSet = {
  //       ...emailTemplateValues,
  //       recipientName: recipientName,
  //     };
  //     //await roomBookingEmail(eventDetails, quest, emailTemplateValuesSet);
  //     // End of Email sending section
  //   });
    if (guestUser) {
      // Ensure `guestUser` is treated as a consistent array
      const guestList = guestUser.includes(",") ? guestUser.split(",") : [guestUser];
    
      // Loop through each guest user
        guestList.map(async (guest) => {
          const recipientName = guest.split("@")[0];
          const emailTemplateValuesSet = {
            ...emailTemplateValues,
            recipientName: recipientName,
          };
          
          // Uncomment and use this to send emails
          // await roomBookingEmail(eventDetails, guest, emailTemplateValuesSet);
        })
    }

  res.status(201).json({
    message:
      "Meeting created successfully and notifications sent to attendees, guest user and committee",
    data: newMeeting,
  });
});

export const getAllMeetings = asyncHandler(async (req, res) => {
  // Raw SQL query to fetch all meetings with associated room and organizer details
  const meetings = await Meeting.findAll({
    include: [
      {
        model: Room,
      },
      {
        model: User,
      },
      {
        model: MeetingUser,
      },
      {
        model: MeetingCommittee,
      },
    ],
  });

  // Send response
  res
    .status(200)
    .json(
      new ApiResponse(200, { meetings }, "Meetings retrieved successfully")
    );
});

export const getAllAdminMeetings = asyncHandler(async (req, res) => {
  // Raw SQL query to fetch all meetings with associated room and organizer details
  const meetings = await Meeting.findAll({
    include: [
      {
        model: Room,
        include: [{ model: Location }],
      },
      {
        model: User,
      },
    ],
  });

  // Send response
  res
    .status(200)
    .json(
      new ApiResponse(200, { meetings }, "Meetings retrieved successfully")
    );
});

export const getTodaysMeetings = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  const meetings = await sequelize.query(
    `
    SELECT 
      m.id AS "meetingId",
      m."title" AS "title",
      m."description" AS "description",
      m."startTime" AS "startTime",
      m."endTime" AS "endTime",
      m."meetingDate" AS "meetingDate",
      m."isPrivate" AS "isPrivate",
      m."createdAt" AS "createdAt",
      m."updatedAt" AS "updatedAt",
      r."name" AS "roomName",
      r."location" AS "roomLocation",
      u."fullname" AS "organizerName",
      u."email" AS "organizerEmail"
    FROM 
      "meetings" m
    LEFT JOIN 
      "rooms" r
    ON 
      m."roomId" = r."id"
    LEFT JOIN 
      "users" u
    ON 
      m."userId" = u."id"
    WHERE 
      m."meetingDate" = :today
    ORDER BY 
      m."startTime" ASC
    `,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { today },
    }
  );

  if (!meetings.length) {
    throw new ApiError(404, "No meetings found for today");
  }

  // Send response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { meetings },
        "Today's meetings retrieved successfully"
      )
    );
});

export const getMyMeetings = asyncHandler(async (req, res) => {
  const id = req.user.id;

  if (!id) {
    throw new ApiError(400, "User ID is required");
  }

  const meetings = await User.findOne({
    where: { id: id },
    include: {
      model: Meeting,
      include: [{model: User}]
    },
  });

  const filteredUserMeetings = meetings.Meetings;


  const organizedMeetings = await Meeting.findAll({
    where: {
      organizerId: id,
    },
    include: [{model: User}]
  });

  const userCommittees = await CommitteeMember.findAll({
    where: { userId: id },
    include: {
      model: Committee,  // Include the Committee model to get committee details
    },
  });

  const committeeIds = userCommittees.map((committee) => committee.Committee.id);  // Get the committee IDs


  const userCommitteeMeetings = await MeetingCommittee.findAll({
    where: { CommitteeId: committeeIds }
  });

  const committeeMeetingIds = userCommitteeMeetings.map(mc => mc.MeetingId)
  
  // Filter the meetings in JavaScript
  const committeeMeetings = await Meeting.findAll(({where: {id : committeeMeetingIds}, include: [{model: User}] }));
  const filteredCommittteeMeetings = committeeMeetings;

  // Raw SQL query to fetch meetings organized by the user or where the user is an attendee
  // const myMeetings = await Meeting.findAll({
  //   where: {
  //     [Op.or]: [
  //       { organizerId: userId }, // Check if the user is the organizer
  //       {
  //         "$User.id$": userId, // Check if the user is an attendee
  //       },
  //     ],
  //   },
  //   include: [
  //     {
  //       model: User, // Many-to-Many relation through MeetingUser
  //     },
  //     {
  //       model: Committee, // Many-to-Many relation through MeetingCommittee
  //     },
  //     // {
  //     //   model: MeetingUser,
  //     // },
  //     // {
  //     //   model: MeetingCommittee,
  //     // },
  //     {
  //       model: Room,
  //       include: [
  //         {
  //           model: Location,
  //         },
  //       ],
  //     },
  //   ],
  // });

  const meetingData = { filteredCommittteeMeetings, filteredUserMeetings, organizedMeetings };
  const uniqueMeetings = Object.values(
    [...meetingData.filteredCommittteeMeetings, ...meetingData.filteredUserMeetings, ...meetingData.organizedMeetings]
        .reduce((acc, meeting) => {
            acc[meeting.id] = meeting;
            return acc;
        }, {})
);

  // Respond with meetings
  return res
    .status(200)
    .json(
      new ApiResponse(200, { myMeetings: uniqueMeetings }, "Meetings  Retrieved Successfully")
    );
});

// 4. Update a meeting
export const updateMeeting = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  const {
    roomId,
    organizerId,
    subject,
    agenda,
    guestUser,
    startTime,
    endTime,
    date,
    attendees,
    committees,
    notes,
    additionalEquipment,
    isPrivate,
  } = req.body;

  const meeting = await Meeting.findByPk(meetingId);
  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  const room = await Room.findByPk(meeting?.roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Checking the available time of the room
  // const sanitationPeriod = room.dataValues.sanitationPeriod || 0;
  // const tolerancePeriod = room.dataValues.tolerancePeriod || 0;
  // let newFormattedStartTime = new Date(); // HH:mm:ss
  // const extraCalculatedTime = sanitationPeriod + tolerancePeriod;
  // newFormattedStartTime.setMinutes(
  //   newFormattedStartTime.getMinutes() - extraCalculatedTime
  // );
  // const newFormattedStartTimeChecked = newFormattedStartTime
  //   .toTimeString()
  //   .split(" ")[0];

  // // Convert startTime and endTime to TIME format
  // const formattedStartTime = new Date(startTime).toTimeString().split(" ")[0]; // HH:mm:ss
  // const formattedEndTime = new Date(endTime).toTimeString().split(" ")[0]; // HH:mm:ss
  // const overlappingMeeting = await Meeting.findOne({
  //   where: {
  //     roomId,
  //     meetingDate: date,
  //     startTime: { [Op.lt]: formattedEndTime },
  //     endTime: { [Op.gt]: newFormattedStartTimeChecked },
  //   },
  // });

  // if (overlappingMeeting) {
  //   throw new ApiError(400, "Room is already booked for the selected time");
  // }
  // Update fields
  meeting.subject = subject || meeting.subject;
  meeting.notes = notes || meeting.notes;
  // meeting.startTime =  meeting.startTime;
  // meeting.endTime = meeting.endTime;
  meeting.roomId = roomId || meeting.roomId;
  meeting.organizerId = organizerId || meeting.organizerId;
  meeting.attendees = attendees || meeting.attendees;

  meeting.agenda = agenda || meeting.agenda;
  meeting.guestUser = guestUser;
  // meeting.date = attendees || meeting.date;

  meeting.committees = committees || meeting.committees;
  meeting.additionalEquipment =
    additionalEquipment || meeting.additionalEquipment;
  meeting.isPrivate = isPrivate || meeting.isPrivate;

  await meeting.save();

  const attendeesArray = attendees.map((userId) => ({
    MeetingId: meetingId,
    UserId: userId,
  }));
  const committeesArray = committees.map((committee) => ({
    MeetingId: meetingId,
    CommitteeId: committee,
  }));
  // Bulk insert into MeetingUser

  // Step 1: Find current entries for the meeting
  const currentEntries = await MeetingUser.findAll({
    where: { MeetingId: meetingId },
    attributes: ["UserId"],
  });

  // Step 2: Extract existing UserIds
  const existingUserIds = currentEntries.map((entry) => entry.UserId);

  // Step 3: Determine UserIds to remove
  const newUserIds = attendeesArray.map((attendee) => attendee.UserId);
  const userIdsToRemove = existingUserIds.filter(
    (userId) => !newUserIds.includes(userId)
  );

  // Step 4: Remove unneeded entries
  if (userIdsToRemove.length > 0) {
    await MeetingUser.destroy({
      where: {
        MeetingId: meetingId,
        UserId: userIdsToRemove,
      },
    });
  }

  // Step 5: Bulk upsert remaining entries
  await MeetingUser.bulkCreate(attendeesArray, {
    updateOnDuplicate: ["UserId", "MeetingId"], // Fields to update
  });

  // Bulk insert into MeetingCommittee
  // Step 1: Fetch current entries
  const currentEntriesCommittee = await MeetingCommittee.findAll({
    where: { MeetingId: meetingId },
    attributes: ["CommitteeId"],
  });

  // Step 2: Extract existing CommitteeIds
  const existingCommitteeIds = currentEntriesCommittee.map(
    (entry) => entry.CommitteeId
  );

  // Step 3: Determine CommitteeIds to remove
  const newCommitteeIds = committeesArray.map(
    (committee) => committee.CommitteeId
  );
  const committeeIdsToRemove = existingCommitteeIds.filter(
    (id) => !newCommitteeIds.includes(id)
  );

  // Step 4: Remove unneeded entries
  if (committeeIdsToRemove.length > 0) {
    await MeetingCommittee.destroy({
      where: {
        MeetingId: meetingId,
        CommitteeId: committeeIdsToRemove,
      },
    });
  }

  // Step 5: Perform bulk upsert
  await MeetingCommittee.bulkCreate(committeesArray, {
    updateOnDuplicate: ["CommitteeId", "MeetingId"], // Fields to update on conflict
  });

  // Fetch the data for email
  const rooms = await getRoomByIdService(roomId);
  const organizer = await getUserByIdService(organizerId);
  const emailTemplateValues = {
    subject: meeting?.subject,
    agenda: meeting?.agenda,
    notes: meeting.notes,
    roomName: rooms[0]?.dataValues?.name,
    bookingDate: meeting.meetingDate,
    startTime: meeting?.startTime,
    endTime: meeting?.endTime,
    location: rooms[0]?.dataValues?.Location?.locationName,
    organizerName: organizer[0]?.dataValues?.fullname,
  };

  const eventData = {
    uid: meeting?.id,
    meetingDate: meeting?.meetingDate,
    startTime: meeting?.startTime,
    endTime: meeting?.endTime,
    summary: meeting?.subject,
    description: meeting?.notes,
    location: rooms[0]?.dataValues?.Location?.locationName,
    sequence: 2,
  };
  const eventDetails = updateEventMeetingData(eventData);

  // Notifications will be done here
  attendees &&
    attendees.forEach(async (attendee) => {
      const members = await User.findOne({
        where: { id: attendee },
        attributes: ["id", "email", "fullname"],
      });
      // Header notification section
      await Notification.create({
        type: "Meeting Update",
        message: `The meeting "${meeting?.dataValues?.subject}" has been Update.`,
        userId: members?.dataValues?.id,
        isRead: false,
        meetingId: meetingId,
      });

      // Sending email to all attendees
      const emailTemplateValuesSet = {
        ...emailTemplateValues,
        recipientName: members?.dataValues?.fullname,
      };
      await roomBookingUpdateEmail(
        eventDetails,
        members?.dataValues?.email,
        emailTemplateValuesSet
      );
      // End of Email sending section

      // Send SMS to all user
      const templateValue = {
        name: members?.dataValues?.fullname
      };
      sendSmsEditedHelper(members?.dataValues?.phoneNumber, templateValue);
      // End of the SMS section
    });

  // Notifications will be done here for all committee user
  committees &&
    committees.forEach(async (committee) => {
      const members = await CommitteeMember.findAll({
        where: { committeeId: committee },
        include: [
          {
            model: User,
            attributes: ["email", "fullname", "avatarPath"],
          },
          {
            model: Committee,
          },
        ],
      });
      members &&
        members?.map(async (member) => {
          // Header notification section
          await Notification.create({
            type: "Meeting Update",
            message: `The meeting "${meeting?.dataValues?.subject}" has been Update.`,
            userId: member?.dataValues?.userId,
            isRead: false,
            meetingId: meetingId,
          });

          // Sending email to all attendees
          const emailTemplateValuesSet = {
            ...emailTemplateValues,
            recipientName: member?.dataValues?.User?.dataValues?.fullname,
          };
          await roomBookingUpdateEmail(
            eventDetails,
            member?.dataValues?.User?.dataValues?.email,
            emailTemplateValuesSet
          );
          // End of Email sending section

          // Send SMS to all user
          const templateValue = {
            name: member?.dataValues?.fullname
          };
          sendSmsEditedHelper(member?.dataValues?.phoneNumber, templateValue);
          // End of the SMS section
        });
    });

  // Notifications will be done here for all quest user
  guestUser &&
    guestUser.split(",").forEach(async (quest) => {
      // Sending email to all attendees
      const recipientName = quest.split("@")[0];
      const emailTemplateValuesSet = {
        ...emailTemplateValues,
        recipientName: recipientName,
      };
      await roomBookingUpdateEmail(eventDetails, quest, emailTemplateValuesSet);
      // End of Email sending section
    });
  res
    .status(200)
    .json({ message: "Meeting Update successfully", data: meeting });
});

// 4. Rescheduled a meeting
export const postponeMeeting = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  const {
    roomId,
    organizerId,
    // subject,
    // agenda,
    guestUser,
    startTime,
    endTime,
    date,
    attendees,
    committees,
    // notes,
    // additionalEquipment,
    // isPrivate,
  } = req.body;

  const meeting = await Meeting.findByPk(meetingId);
  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  const room = await Room.findByPk(meeting?.roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Checking the available time of the room
  const sanitationPeriod = room.dataValues.sanitationPeriod || 0;
  const tolerancePeriod = room.dataValues.tolerancePeriod || 0;
  let newFormattedStartTime = new Date(startTime); // HH:mm:ss
  const extraCalculatedTime = sanitationPeriod + tolerancePeriod;
  newFormattedStartTime.setMinutes(
    newFormattedStartTime.getMinutes() - extraCalculatedTime
  );
  const newFormattedStartTimeChecked = newFormattedStartTime
    .toTimeString()
    .split(" ")[0];

  const endTimeWithAddedTime = new Date(moment(new Date(endTime)).add(extraCalculatedTime, "minutes")).toTimeString().split(" ")[0];
  // Convert startTime and endTime to TIME format
  const formattedStartTime = new Date(startTime).toTimeString().split(" ")[0]; // HH:mm:ss
  const formattedEndTime = new Date(endTime).toTimeString().split(" ")[0]; // HH:mm:ss
  const overlappingMeeting = await Meeting.findOne({
    where: {
      roomId,
      meetingDate: date,
      startTime: { [Op.lt]: endTimeWithAddedTime },
      endTime: { [Op.gt]: formattedStartTime },
      id: { [Op.not]: meetingId },
      status: { [Op.notIn]: ["completed", "cancelled"] },
    },
  });

  if (overlappingMeeting) {
    throw new ApiError(400, "Room is already booked for the selected time");
  }
  // Update fields
  // meeting.subject = subject || meeting.subject;
  // meeting.notes = notes || meeting.notes;
  meeting.startTime = formattedStartTime || meeting.startTime;
  meeting.endTime = formattedEndTime || meeting.endTime;
  meeting.roomId = roomId || meeting.roomId;
  // meeting.organizerId = organizerId || meeting.organizerId;
  meeting.attendees = attendees || meeting.attendees;

  // meeting.agenda = agenda || meeting.agenda;
  meeting.guestUser = guestUser || meeting.guestUser;
  meeting.meetingDate = date || meeting.date;

  meeting.committees = committees || meeting.committees;
  // meeting.additionalEquipment =
  //   additionalEquipment || meeting.additionalEquipment;
  // meeting.isPrivate = isPrivate || meeting.isPrivate;

  await meeting.save();

  // const attendeesArray = attendees.map((userId) => ({
  //   MeetingId: meetingId,
  //   UserId: userId,
  // }));
  // const committeesArray = committees.map((committee) => ({
  //   MeetingId: meetingId,
  //   CommitteeId: committee,
  // }));

  // Bulk insert into MeetingUser

  // Step 1: Find current entries for the meeting
  // const currentEntries = await MeetingUser.findAll({
  //   where: { MeetingId: meetingId },
  //   attributes: ["UserId"],
  // });

  // Step 2: Extract existing UserIds
  // const existingUserIds = currentEntries.map((entry) => entry.UserId);

  // Step 3: Determine UserIds to remove
  // const newUserIds = attendeesArray.map((attendee) => attendee.UserId);
  // const userIdsToRemove = existingUserIds.filter(
  //   (userId) => !newUserIds.includes(userId)
  // );

  // Step 4: Remove unneeded entries
  // if (userIdsToRemove.length > 0) {
  //   await MeetingUser.destroy({
  //     where: {
  //       MeetingId: meetingId,
  //       UserId: userIdsToRemove,
  //     },
  //   });
  // }

  // Step 5: Bulk upsert remaining entries
  // await MeetingUser.bulkCreate(attendeesArray, {
  //   updateOnDuplicate: ["UserId", "MeetingId"], // Fields to update
  // });

  // Bulk insert into MeetingCommittee
  // Step 1: Fetch current entries
  // const currentEntriesCommittee = await MeetingCommittee.findAll({
  //   where: { MeetingId: meetingId },
  //   attributes: ["CommitteeId"],
  // });

  // Step 2: Extract existing CommitteeIds
  // const existingCommitteeIds = currentEntriesCommittee.map(
  //   (entry) => entry.CommitteeId
  // );

  // Step 3: Determine CommitteeIds to remove
  // const newCommitteeIds = committeesArray.map(
  //   (committee) => committee.CommitteeId
  // );
  // const committeeIdsToRemove = existingCommitteeIds.filter(
  //   (id) => !newCommitteeIds.includes(id)
  // );

  // Step 4: Remove unneeded entries
  // if (committeeIdsToRemove.length > 0) {
  //   await MeetingCommittee.destroy({
  //     where: {
  //       MeetingId: meetingId,
  //       CommitteeId: committeeIdsToRemove,
  //     },
  //   });
  // }

  // Step 5: Perform bulk upsert
  // await MeetingCommittee.bulkCreate(committeesArray, {
  //   updateOnDuplicate: ["CommitteeId", "MeetingId"], // Fields to update on conflict
  // });

  // Fetch the data for email
  const rooms = await getRoomByIdService(roomId);
  const organizer = await getUserByIdService(organizerId);
  const emailTemplateValues = {
    subject: meeting?.subject,
    agenda: meeting?.agenda,
    notes: meeting.notes,
    roomName: rooms[0]?.dataValues?.name,
    bookingDate: meeting.meetingDate,
    startTime: meeting?.startTime,
    endTime: meeting?.endTime,
    location: rooms[0]?.dataValues?.Location?.locationName,
    organizerName: organizer[0]?.dataValues?.fullname,
  };

  const eventData = {
    uid: meeting?.id,
    meetingDate: meeting?.meetingDate,
    startTime: meeting?.startTime,
    endTime: meeting?.endTime,
    summary: meeting?.subject,
    description: meeting?.notes,
    location: rooms[0]?.dataValues?.Location?.locationName,
    sequence: 3,
    organizerName: organizer[0]?.dataValues?.fullname,
    organizerEmail: organizer[0]?.dataValues?.email,
  };
  const eventDetails = postponeEventMeetingData(eventData);

  // Notifications will be done here
  attendees &&
    attendees.forEach(async (attendee) => {
      const members = await User.findOne({
        where: { id: attendee },
        attributes: ["id", "email", "fullname", "phoneNumber"],
      });

      // Header notification section
      await Notification.create({
        type: "Meeting Rescheduled",
        message: `The meeting "${meeting?.dataValues?.subject}" has been Rescheduled.`,
        userId: members?.dataValues?.id,
        isRead: false,
        meetingId: meetingId,
      });

      // Sending email to all attendees
      const emailTemplateValuesSet = {
        ...emailTemplateValues,
        recipientName: members?.dataValues?.fullname,
      };
      await roomBookingPostponeEmail(
        eventDetails,
        members?.dataValues?.email,
        emailTemplateValuesSet
      );
      // End of Email sending section

      // Send SMS to all user
      const templateValue = {
        name: members?.dataValues?.fullname,
        date: getFormattedDate(meeting?.meetingDate),
        startTime: formatTimeShort(meeting?.startTime),
        endTime: formatTimeShort(meeting?.endTime),
      };
      sendSmsPostponeHelper(members?.dataValues?.phoneNumber, templateValue);
      // End of the SMS section
    });

  // Notifications will be done here for all committee user
  committees &&
    committees.forEach(async (committee) => {
      const members = await CommitteeMember.findAll({
        where: { committeeId: committee },
        include: [
          {
            model: User,
            attributes: ["email", "fullname", "avatarPath"],
          },
          {
            model: Committee,
          },
        ],
      });
      members &&
        members?.map(async (member) => {
          // Header notification section
          await Notification.create({
            type: "Meeting Rescheduled",
            message: `The meeting "${meeting?.dataValues?.subject}" has been Rescheduled.`,
            userId: member?.dataValues?.userId,
            isRead: false,
            meetingId: meetingId,
          });

          // Sending email to all attendees
          const emailTemplateValuesSet = {
            ...emailTemplateValues,
            recipientName: member?.dataValues?.User?.dataValues?.fullname,
          };
          await roomBookingPostponeEmail(
            eventDetails,
            member?.dataValues?.User?.dataValues?.email,
            emailTemplateValuesSet
          );
          // End of Email sending section

          // Send SMS to all user
          const templateValue = {
            name: member?.dataValues?.User?.dataValues?.fullname,
            date: getFormattedDate(meeting?.meetingDate),
            startTime: formatTimeShort(meeting?.startTime),
            endTime: formatTimeShort(meeting?.endTime),
          };
          sendSmsPostponeHelper(
            member?.dataValues?.User?.dataValues?.phoneNumber,
            templateValue
          );
          // End of the SMS section
        });
    });

  // Notifications will be done here for all quest user
  guestUser &&
    guestUser.split(",").forEach(async (quest) => {
      // Sending email to all attendees
      const recipientName = quest.split("@")[0];
      const emailTemplateValuesSet = {
        ...emailTemplateValues,
        recipientName: recipientName,
      };
      await roomBookingPostponeEmail(
        eventDetails,
        quest,
        emailTemplateValuesSet
      );
      // End of Email sending section

    });
  res
    .status(200)
    .json({ message: "Meeting Rescheduled successfully", data: meeting });
});

// 5. Delete a meeting
export const deleteMeeting = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;

  const meeting = await Meeting.findByPk(meetingId);
  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  await meeting.destroy();
  res.status(200).json({ message: "Meeting deleted successfully" });
});

// 6. Get meetings by room
export const getMeetingsByRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const meetings = await Meeting.findAll({
    where: { roomId },
    include: [
      { model: User, as: "organizer", attributes: ["username", "email"] },
    ],
  });

  res.status(200).json({ data: meetings });
});

// 7. Get meetings by organizer
export const getMeetingsByOrganizer = asyncHandler(async (req, res) => {
  const { organizerId } = req.params;

  const meetings = await Meeting.findAll({
    where: { organizerId },
    include: [{ model: Room, attributes: ["roomName", "location"] }],
  });

  res.status(200).json({ data: meetings });
});

// Cancel a meeting and notify attendees
export const changeMeetingStatus = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  const { meetingStatus } = req.body;

  const meeting = await Meeting.findAll({
    where: {
      id: meetingId,
    },
  });
  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }
  await Meeting.update(
    { status: meetingStatus }, // values to update
    {
      where: { id: meetingId }, // condition
    }
  ).then(async () => {
    const attendees = await MeetingUser?.findAll({
      where: {
        MeetingId: meetingId,
      },
    });

    const committees = await MeetingCommittee?.findAll({
      where: {
        MeetingId: meetingId,
      },
    });

    // Fetch the data for email
    const rooms = await getRoomByIdService(meeting[0]?.dataValues?.roomId);
    const organizer = await getUserByIdService(
      meeting[0]?.dataValues?.organizerId
    );
    const emailTemplateValues = {
      subject: meeting[0]?.dataValues?.subject,
      agenda: meeting[0]?.dataValues?.agenda,
      notes: meeting[0]?.dataValues?.notes,
      roomName: rooms[0]?.dataValues?.name,
      bookingDate: meeting[0]?.dataValues?.meetingDate,
      startTime: meeting[0]?.dataValues?.startTime,
      endTime: meeting[0]?.dataValues?.endTime,
      location: rooms[0]?.dataValues?.Location?.locationName,
      organizerName: organizer[0]?.dataValues?.fullname,
    };
    let eventData = "";
    let eventDetails = "";

    if (meetingStatus === "cancelled") {
      eventData = {
        uid: meeting[0]?.dataValues?.id,
        meetingDate: meeting[0]?.dataValues?.meetingDate,
        startTime: meeting[0]?.dataValues?.startTime,
        endTime: meeting[0]?.dataValues?.endTime,
        summary: meeting[0]?.dataValues?.subject,
        description: meeting[0]?.dataValues?.notes,
        location: rooms[0]?.dataValues?.Location?.locationName,
        sequence: 4,
        organizerName: organizer[0]?.dataValues?.fullname,
        organizerEmail: organizer[0]?.dataValues?.email,
      };
      eventDetails = cancelledEventMeetingData(eventData);
    } else if (meetingStatus === "scheduled") {
      const eventData = {
        uid: meeting[0]?.dataValues?.id,
        meetingDate: meeting[0]?.dataValues?.meetingDate,
        startTime: meeting[0]?.dataValues?.startTime,
        endTime: meeting[0]?.dataValues?.endTime,
        summary: meeting[0]?.dataValues?.subject,
        description: meeting[0]?.dataValues?.notes,
        location: rooms[0]?.dataValues?.Location?.locationName,
        organizerName: organizer[0]?.dataValues?.fullname,
        organizerEmail: organizer[0]?.dataValues?.email,
      };
      eventDetails = eventMeetingData(eventData);
    }
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
          meetingId: meetingId,
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

        if(meetingStatus === "cancelled"){
          // Send SMS to all user
          const templateValue = {
            name: members?.dataValues?.fullname,
            date: getFormattedDate(meeting[0]?.dataValues?.meetingDate),
            startTime: formatTimeShort(meeting[0]?.dataValues?.startTime),
            endTime: formatTimeShort(meeting[0]?.dataValues?.endTime),
          };
          sendSmsCancelHelper(members?.dataValues?.phoneNumber, templateValue);
          // End of the SMS section
        }

        if(meetingStatus === "scheduled"){
          // Send SMS to all user
          const templateValue = {
            name: members?.dataValues?.fullname,
            date: getFormattedDate(meeting[0]?.dataValues?.meetingDate),
            startTime: formatTimeShort(meeting[0]?.dataValues?.startTime),
            endTime: formatTimeShort(meeting[0]?.dataValues?.endTime),
          };
          sendSmsScheduledHelper(members?.dataValues?.phoneNumber, templateValue);
          // End of the SMS section
        }

        if(meetingStatus === "completed"){
          // Send SMS to all user
          const templateValue = {
            name: members?.dataValues?.fullname
          };
          sendSmsCompleteHelper(members?.dataValues?.phoneNumber, templateValue);
          // End of the SMS section
        }

        if(meetingStatus === "start"){
          // Send SMS to all user
          const templateValue = {
            name: members?.dataValues?.fullname
          };
          sendSmsStartHelper(members?.dataValues?.phoneNumber, templateValue);
          // End of the SMS section
        }
        

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
              meetingId: meetingId,
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

            if(meetingStatus === "cancelled"){
              // Send SMS to all user
              const templateValue = {
                name: member?.dataValues?.User?.dataValues?.fullname,
                date: getFormattedDate(meeting[0]?.dataValues?.meetingDate),
                startTime: formatTimeShort(meeting[0]?.dataValues?.startTime),
                endTime: formatTimeShort(meeting[0]?.dataValues?.endTime),
              };
              sendSmsCancelHelper(
                member?.dataValues?.User?.dataValues?.phoneNumber,
                templateValue
              );
            // End of the SMS section
            }

            if(meetingStatus === "scheduled"){
              // Send SMS to all user
              const templateValue = {
                name: member?.dataValues?.User?.dataValues?.fullname,
                date: getFormattedDate(meeting[0]?.dataValues?.meetingDate),
                startTime: formatTimeShort(meeting[0]?.dataValues?.startTime),
                endTime: formatTimeShort(meeting[0]?.dataValues?.endTime),
              };
              sendSmsScheduledHelper(
                member?.dataValues?.User?.dataValues?.phoneNumber,
                templateValue
              );
            // End of the SMS section
            }

            if(meetingStatus === "completed"){
              // Send SMS to all user
              const templateValue = {
                name: member?.dataValues?.fullname
              };
              sendSmsCompleteHelper(member?.dataValues?.phoneNumber, templateValue);
              // End of the SMS section
            }

            if(meetingStatus === "start"){
              // Send SMS to all user
              const templateValue = {
                name: member?.dataValues?.fullname
              };
              sendSmsStartHelper(member?.dataValues?.phoneNumber, templateValue);
              // End of the SMS section
            }
            
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

  
  await Room.update(
      { sanitationStatus: false },
      {
          where: {
              id: meeting[0]?.dataValues?.roomId
          },
      }
  );


  res.status(200).json({
    message: "Meeting status updated and notifications sent to attendees",
  });
});

export const getMeetingsById = asyncHandler(async (req, res) => {
  const meetingId = req.params.meetingId;

  if (!meetingId) {
    throw new ApiError(400, "meeting ID is required");
  }
  // Raw SQL query to fetch meetings organized by the user or where the user is an attendee
  const meetingsOnly = await Meeting.findAll({
    where: {
      id: meetingId,
    },
    include: [
      {
        model: User, // Many-to-Many relation through MeetingUser
      },
      {
        model: Committee, // Many-to-Many relation through MeetingCommittee
        include: [
          {
            model: CommitteeMember,
            include: [{model: User}]
          },
          {
            model: CommitteeType
          }
        ],
      },
      {
        model: Room,
        include: [
          {
            model: Location,
          },
        ],
      },
      {
        model: UserType, // Include UserType instead of MeetingAttendeeType
        through: { attributes: [] }, // Exclude join table fields from the response
      },
    ],
  });
  const meetingUsers = await MeetingUser.findAll({
    where: {
      MeetingId: meetingId,
    },
  });

  const meetingUser = await Promise.all(
    meetingUsers?.map(async (data) => {
      return await User.findOne({
        where: {
          id: data?.UserId,
        },
        attributes: ["id", "fullname"],
      });
    })
  );

  const meetings = {
    meetingsOnly,
    meetingUser,
  };

  // Respond with meetings
  return res
    .status(200)
    .json(
      new ApiResponse(200, { meetings }, "Meetings  Retrieved Successfully")
    );
});


export const swapMeeting = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  const requestedMeetingId = req.body.meetingId;

  const meeting = await Meeting.findByPk(meetingId);
  if (!meeting) throw new ApiError(404, "Meeting not found");

  const requestedMeeting = await Meeting.findByPk(requestedMeetingId);
  if (!requestedMeeting) throw new ApiError(404, "Requested Meeting not found");

   // Ensure neither meeting has a "completed" or "cancelled" status
   if (["completed", "cancelled"].includes(meeting.status) || ["completed", "cancelled"].includes(requestedMeeting.status)) {
    throw new ApiError(400, "Cannot swap meetings that are completed or cancelled");
  }

  const room = await Room.findByPk(meeting?.roomId);
  if (!room) throw new ApiError(404, "Room not found");

  const requestedMeetingRoom = await Room.findByPk(requestedMeeting?.roomId);
  if (!requestedMeetingRoom) throw new ApiError(404, "Requested Meeting Room not found");

  const sanitationPeriod = room.dataValues.sanitationPeriod || 0;
  const requestedMeetingRoomSanitation = requestedMeetingRoom.dataValues.sanitationPeriod || 0;

  // Convert meeting times to moments
  const meetingStartMoment = moment(`${meeting.meetingDate} ${meeting.startTime}`, "YYYY-MM-DD HH:mm:ss");
  const meetingEndMoment = moment(`${meeting.meetingDate} ${meeting.endTime}`, "YYYY-MM-DD HH:mm:ss").add(sanitationPeriod, "minutes");
  
  const requestedMeetingStartMoment = moment(`${requestedMeeting.meetingDate} ${requestedMeeting.startTime}`, "YYYY-MM-DD HH:mm:ss");
  const requestedMeetingEndMoment = moment(`${requestedMeeting.meetingDate} ${requestedMeeting.endTime}`, "YYYY-MM-DD HH:mm:ss").add(requestedMeetingRoomSanitation, "minutes");

  // Calculate durations
  const meetingDuration = moment.duration(meetingEndMoment.diff(meetingStartMoment)).asMinutes();
  const requestedDuration = moment.duration(requestedMeetingEndMoment.diff(requestedMeetingStartMoment)).asMinutes();
  

  // New start and end times after swap
  const newMeetingStart = requestedMeeting.startTime;
  const newMeetingEnd = moment(requestedMeetingStartMoment).add(meetingDuration, "minutes").subtract(sanitationPeriod, "minutes").format("HH:mm:ss");
  
  const newRequestedMeetingStart = meeting.startTime;
  const newRequestedMeetingEnd = moment(meetingStartMoment).add(requestedDuration, "minutes").subtract(requestedMeetingRoomSanitation, "minutes").format("HH:mm:ss");

  const newMeetingRoomId = requestedMeeting.roomId;
  const newRequestedMeetingRoomId = meeting.roomId;

  const newMeetingDate = requestedMeeting.meetingDate;
  const newRequestedMeetingDate = meeting.meetingDate;

  // Check if the swapped times are available
  const existingMeetingTiming = await Meeting.findOne({
    where: {
      id: { [Op.not]: requestedMeeting.id },
      roomId: newMeetingRoomId,
      meetingDate: requestedMeeting.meetingDate,
      startTime: { [Op.lt]: newMeetingEnd },
      endTime: { [Op.gt]: newMeetingStart },
    },
  });

  const existingRequestedMeetingTiming = await Meeting.findOne({
    where: {
      id: { [Op.not]: meeting.id },
      roomId: newRequestedMeetingRoomId,
      meetingDate: meeting.meetingDate,
      startTime: { [Op.lt]: newRequestedMeetingEnd },
      endTime: { [Op.gt]: newRequestedMeetingStart },
    },
  });

  // If no conflicts, swap the meetings
  if (!existingMeetingTiming && !existingRequestedMeetingTiming) {
    meeting.roomId = newMeetingRoomId;
    meeting.startTime = newMeetingStart;
    meeting.endTime = newMeetingEnd;
    meeting.meetingDate = newMeetingDate;

    requestedMeeting.roomId = newRequestedMeetingRoomId;
    requestedMeeting.startTime = newRequestedMeetingStart;
    requestedMeeting.endTime = newRequestedMeetingEnd;
    requestedMeeting.meetingDate = newRequestedMeetingDate;

    await meeting.save();
    await requestedMeeting.save();

    const meetingAttendees = meeting.attendees;
    const meetingCommittees = meeting.committees;

    const requestedMeetingAttendees = requestedMeeting.attendees;
    const requestedMeetingCommittees = requestedMeeting.committees;

    const rooms = await getRoomByIdService(meeting.roomId);
    const organizer = await getUserByIdService(meeting.organizerId);

    const requestedMeetingRooms = await getRoomByIdService(meeting.roomId);
    const requestedMeetingOrganizer = await getUserByIdService(meeting.organizerId);

    const emailTemplateValues = {
      subject: meeting?.subject,
      agenda: meeting?.agenda,
      notes: meeting.notes,
      roomName: rooms[0]?.dataValues?.name,
      bookingDate: meeting.meetingDate,
      startTime: meeting?.startTime,
      endTime: meeting?.endTime,
      location: rooms[0]?.dataValues?.Location?.locationName,
      organizerName: organizer[0]?.dataValues?.fullname,
    };

    const eventData = {
      uid: meeting?.id,
      meetingDate: meeting?.meetingDate,
      startTime: meeting?.startTime,
      endTime: meeting?.endTime,
      summary: meeting?.subject,
      description: meeting?.notes,
      location: rooms[0]?.dataValues?.Location?.locationName,
      sequence: 2,
    };

    const requestedMeetingEmailTemplateValues = {
      subject: requestedMeeting?.subject,
      agenda: requestedMeeting?.agenda,
      notes: requestedMeeting.notes,
      roomName: requestedMeetingRooms[0]?.dataValues?.name,
      bookingDate: requestedMeeting.meetingDate,
      startTime: requestedMeeting?.startTime,
      endTime: requestedMeeting?.endTime,
      location: requestedMeetingRooms[0]?.dataValues?.Location?.locationName,
      organizerName: requestedMeetingOrganizer[0]?.dataValues?.fullname,
    };

    const requestedMeetingEventData = {
      uid: requestedMeeting?.id,
      meetingDate: requestedMeeting?.meetingDate,
      startTime: requestedMeeting?.startTime,
      endTime: requestedMeeting?.endTime,
      summary: requestedMeeting?.subject,
      description: requestedMeeting?.notes,
      location: requestedMeetingRooms[0]?.dataValues?.Location?.locationName,
      sequence: 2,
    };
    const eventDetails = updateEventMeetingData(eventData);
    const requestedMeetingEventDetails = updateEventMeetingData(requestedMeetingEventData);

    // Notifications will be done here
    meetingAttendees &&
    meetingAttendees.forEach(async (attendee) => {
        const members = await User.findOne({
          where: { id: attendee },
          attributes: ["id", "email", "fullname"],
        });
        // Header notification section
        await Notification.create({
          type: "Meeting Update",
          message: `The meeting "${meeting?.dataValues?.subject}" has been Update.`,
          userId: members?.dataValues?.id,
          isRead: false,
          meetingId: meetingId,
        });

        // Sending email to all attendees
        const emailTemplateValuesSet = {
          ...emailTemplateValues,
          recipientName: members?.dataValues?.fullname,
        };
        await meetingSwapEmail(
          eventDetails,
          members?.dataValues?.email,
          emailTemplateValuesSet
        );
        // End of Email sending section

        // Send SMS to all user
        const templateValue = {
          name: members?.dataValues?.fullname
        };
        sendSmsEditedHelper(members?.dataValues?.phoneNumber, templateValue);
        // End of the SMS section
    });

    // Notifications will be done here for all committee user
    meetingCommittees &&
    meetingCommittees.forEach(async (committee) => {
        const members = await CommitteeMember.findAll({
          where: { committeeId: committee },
          include: [
            {
              model: User,
              attributes: ["email", "fullname", "avatarPath"],
            },
            {
              model: Committee,
            },
          ],
        });
        members &&
          members?.map(async (member) => {
            // Header notification section
            await Notification.create({
              type: "Meeting Update",
              message: `The meeting "${meeting?.dataValues?.subject}" has been Update.`,
              userId: member?.dataValues?.userId,
              isRead: false,
              meetingId: meetingId,
            });

            // Sending email to all attendees
            const emailTemplateValuesSet = {
              ...emailTemplateValues,
              recipientName: member?.dataValues?.User?.dataValues?.fullname,
            };
            await meetingSwapEmail(
              eventDetails,
              member?.dataValues?.User?.dataValues?.email,
              emailTemplateValuesSet
            );
            // End of Email sending section

            // Send SMS to all user
            const templateValue = {
              name: member?.dataValues?.fullname
            };
            sendSmsEditedHelper(member?.dataValues?.phoneNumber, templateValue);
            // End of the SMS section
          });
    });

    // Notifications will be done here for all quest user
    meeting.guestUser &&
    meeting.guestUser.split(",").forEach(async (quest) => {
        // Sending email to all attendees
        const recipientName = quest.split("@")[0];
        const emailTemplateValuesSet = {
          ...emailTemplateValues,
          recipientName: recipientName,
        };
        await meetingSwapEmail(eventDetails, quest, emailTemplateValuesSet);
        // End of Email sending section
    });

    // Notifications will be done here
    requestedMeetingAttendees &&
    requestedMeetingAttendees.forEach(async (attendee) => {
        const members = await User.findOne({
          where: { id: attendee },
          attributes: ["id", "email", "fullname"],
        });
        // Header notification section
        await Notification.create({
          type: "Meeting Update",
          message: `The meeting "${meeting?.dataValues?.subject}" has been Update.`,
          userId: members?.dataValues?.id,
          isRead: false,
          meetingId: meetingId,
        });

        // Sending email to all attendees
        const emailTemplateValuesSet = {
          ...requestedMeetingEmailTemplateValues,
          recipientName: members?.dataValues?.fullname,
        };
        await meetingSwapEmail(
          requestedMeetingEventDetails,
          members?.dataValues?.email,
          emailTemplateValuesSet
        );
        // End of Email sending section

        // Send SMS to all user
        const templateValue = {
          name: members?.dataValues?.fullname
        };
        sendSmsEditedHelper(members?.dataValues?.phoneNumber, templateValue);
        // End of the SMS section
    });

    // Notifications will be done here for all committee user
    requestedMeetingCommittees &&
    requestedMeetingCommittees.forEach(async (committee) => {
        const members = await CommitteeMember.findAll({
          where: { committeeId: committee },
          include: [
            {
              model: User,
              attributes: ["email", "fullname", "avatarPath"],
            },
            {
              model: Committee,
            },
          ],
        });
        members &&
          members?.map(async (member) => {
            // Header notification section
            await Notification.create({
              type: "Meeting Update",
              message: `The meeting "${meeting?.dataValues?.subject}" has been Update.`,
              userId: member?.dataValues?.userId,
              isRead: false,
              meetingId: meetingId,
            });

            // Sending email to all attendees
            const emailTemplateValuesSet = {
              ...requestedMeetingEmailTemplateValues,
              recipientName: member?.dataValues?.User?.dataValues?.fullname,
            };
            await meetingSwapEmail(
              requestedMeetingEventDetails,
              member?.dataValues?.User?.dataValues?.email,
              emailTemplateValuesSet
            );
            // End of Email sending section

            // Send SMS to all user
            const templateValue = {
              name: member?.dataValues?.fullname
            };
            sendSmsEditedHelper(member?.dataValues?.phoneNumber, templateValue);
            // End of the SMS section
          });
    });

    // Notifications will be done here for all quest user
    requestedMeeting.guestUser &&
    requestedMeeting.guestUser.split(",").forEach(async (quest) => {
        // Sending email to all attendees
        const recipientName = quest.split("@")[0];
        const emailTemplateValuesSet = {
          ...requestedMeetingEmailTemplateValues,
          recipientName: recipientName,
        };
        await meetingSwapEmail(requestedMeetingEventDetails, quest, emailTemplateValuesSet);
        // End of Email sending section
  });

    return res.status(200).json({ message: "Meeting swapped successfully", data: meeting });
  }

  throw new ApiError(400, "Unable to swap because of unavailability.");
});