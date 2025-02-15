// TODOs

import { Op } from "sequelize";
import User from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import RoomAmenity from "../models/RoomAmenity.model.js";
import FoodBeverage from "../models/FoodBeverage.model.js";
import Room from "../models/Room.models.js";
import Meeting from "../models/Meeting.models.js";
import Committee from "../models/Committee.models.js";
import { getUniqueTopRooms, getUniqueTopUsers } from "../utils/utils.js";
import Services from "../models/Services.models.js";
import Location from "../models/Location.model.js";

export const getUserCount = asyncHandler(async (req, res, next) => {
  const count = await User.count();
  const latestUser = await User.findOne({ order: [['createdAt', 'DESC']] });
  res.status(200).json(new ApiResponse(200, { count, latestUser }));
});


export const getAmenityCount = asyncHandler(async (req, res, next) => {
  const count = await RoomAmenity.count();
  const latestAmenity = await RoomAmenity.findOne({ order: [['createdAt', 'DESC']] });
  res.status(200).json(new ApiResponse(200, { count, latestAmenity }));
});

export const getServiceCount = asyncHandler(async (req, res, next) => {
  const count = await Services.count();
  const latestServices = await Services.findOne({ order: [['createdAt', 'DESC']] });
  res.status(200).json(new ApiResponse(200, { count, latestServices }));
});

export const getLocationCount = asyncHandler(async (req, res, next) => {
  const count = await Location.count();
  const latestLocation = await Location.findOne({ order: [['createdAt', 'DESC']] });
  res.status(200).json(new ApiResponse(200, { count, latestLocation }));
});

export const getAllMeetingCount = asyncHandler(async (req, res, next) => {
  const count = await Meeting.count();
  const latestMeeting = await Meeting.findOne({ order: [['createdAt', 'DESC']] });
  res.status(200).json(new ApiResponse(200, { count, latestMeeting }));
});

export const getFoodBeverageCount = asyncHandler(async (req, res, next) => {
  const count = await FoodBeverage.count();
  const latestFoodBeverage = await FoodBeverage.findOne({ order: [['createdAt', 'DESC']] });
  res.status(200).json(new ApiResponse(200, { count, latestFoodBeverage }));
});

export const getRoomCount = asyncHandler(async (req, res, next) => {
  const count = await Room.count();
  const latestRoom = await Room.findOne({ order: [['createdAt', 'DESC']] });
  res.status(200).json(new ApiResponse(200, { count, latestRoom }));
});

export const getMeetingCount = asyncHandler(async (req, res, next) => {
  const { filter } = req.query;

  const now = new Date();
  let startDate, endDate;

  if (filter === "Today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
  } else if (filter === "This Week") {
    const currentDay = now.getDay();
    const diffToStartOfWeek = currentDay === 0 ? 6 : currentDay - 1;
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(now.getDate() - diffToStartOfWeek);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);
  } else if (filter === "This Month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
  } else if (filter === "This Year") {
    startDate = new Date(now.getFullYear(), 0, 1);
    endDate = new Date(now.getFullYear() + 1, 0, 1);
  } else {
    throw new ApiError(
      400,
      "Invalid filter value. Use 'Today', 'This Month', or 'This Year'."
    );
  }

  const whereCondition = {
    meetingDate: {
      [Op.between]: [
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      ],
    },
  };

  const cancelledWhereCondition = {
    meetingDate: {
      [Op.between]: [
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      ],
    },
    status: "cancelled",
  };

  const completedWhereCondition = {
    meetingDate: {
      [Op.between]: [
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      ],
    },
    status: "completed",
  };

  const [
    meetingCount,
    cancelledMeetingCount,
    completedMeetingCount,
    latestMeeting,
    latestCancelledMeeting,
    latestCompletedMeeting,
  ] = await Promise.all([
    Meeting.count({ where: whereCondition }),
    Meeting.count({ where: cancelledWhereCondition }),
    Meeting.count({ where: completedWhereCondition }),
    Meeting.findOne({
      where: whereCondition,
      order: [['meetingDate', 'DESC']],
    }),
    Meeting.findOne({
      where: cancelledWhereCondition,
      order: [['meetingDate', 'DESC']],
    }),
    Meeting.findOne({
      where: completedWhereCondition,
      order: [['meetingDate', 'DESC']],
    }),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        meetingCount,
        cancelledMeetingCount,
        completedMeetingCount,
        latestMeeting,
        latestCancelledMeeting,
        latestCompletedMeeting,
      },
      "Meeting count and latest meetings fetched successfully"
    )
  );
});


export const getCommitteeCount = asyncHandler(async (req, res, next) => {
  const count = await Committee.count();
  const latestCommittee = await Committee.findOne({ order: [['createdAt', 'DESC']] });
  res.status(200).json(new ApiResponse(200, { count, latestCommittee }));
});

export const getActiveCommitteeCount = asyncHandler(async (req, res, next) => {
  const count = await Committee.count({
    where: {
      status: {
        [Op.eq]: true,
      },
    },
  })

  const latestActiveCommittee = await Committee.findOne({
    where: {
      status: {
        [Op.eq]: true,
      },
    },
    order: [['createdAt', 'DESC']],
  })
  res.status(200).json(new ApiResponse(200, { count, latestActiveCommittee }));
});


export const getInactiveCommitteeCount = asyncHandler(
  async (req, res, next) => {
    const count = await Committee.count({
      where: {
        status: {
          [Op.eq]: false,
        },
      },
    })

    const latestInactiveCommittee = await Committee.findOne({
      where: {
        status: {
          [Op.eq]: false,
        },
      },
      order: [['createdAt', 'DESC']],
    })

    res.status(200).json(new ApiResponse(200, { count, latestInactiveCommittee }));
  }
);

export const getVisitorCount = asyncHandler(async (req, res, next) => {
  const visitorCount = await Visitor.count();
  res.status(200).json(new ApiResponse(200, { visitorCount }));
});

export const getMeetingRoomStats = asyncHandler(
  async (req, res, next) => {
    // const { filter } = req.query; // Get the filter value from query params

    // // Define date ranges based on the filter
    // const now = new Date();
    // let startDate, endDate;

    // if (filter === "Today") {
    //   startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
    //   endDate = new Date(startDate);
    //   endDate.setDate(startDate.getDate() + 1); // End of today
    // }else if (filter === "This Week") {
    //   const currentDay = now.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    //   const diffToStartOfWeek = currentDay === 0 ? 6 : currentDay - 1; // Assuming the week starts on Monday
    //   startDate = new Date(now);
    //   startDate.setHours(0, 0, 0, 0); // Reset time to midnight
    //   startDate.setDate(now.getDate() - diffToStartOfWeek); // Move to the start of the week (Monday)
    //   endDate = new Date(startDate);
    //   endDate.setDate(startDate.getDate() + 7);
    //  } else if (filter === "This Month") {
    //   startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of this month
    //   endDate = new Date(startDate);
    //   endDate.setMonth(startDate.getMonth() + 1); // Start of next month
    // } else if (filter === "This Year") {
    //   startDate = new Date(now.getFullYear(), 0, 1); // Start of this year
    //   endDate = new Date(now.getFullYear() + 1, 0, 1); // Start of next year
    // } else {
    //   throw new ApiError(
    //     400,
    //     "Invalid filter value. Use 'Today', 'This Month', or 'This Year'."
    //   );
    // }

    const meetings = await Meeting.findAll();

    const meetingRooms = meetings.map((meeting) => String(meeting.roomId));
    const meetingOrganizers = meetings.map((meeting) => String(meeting.organizerId));

    const totalMeetingRooms = meetingRooms.length;

    const uniqueMeetingRoomIds = [...new Set(meetingRooms)];
    const uniqueOrganizerIds = [... new Set(meetingOrganizers)];

    let roomCount = [];
    let organizerCount = [];

    for (let uniqueMeetingRoom of uniqueMeetingRoomIds) {
      const uniqueRoomCount = meetingRooms.filter((meetingRoom) => meetingRoom === uniqueMeetingRoom).length;
      const roomPercentage = ((uniqueRoomCount / totalMeetingRooms) * 100).toFixed(2);
      const roomData = await Room.findOne({ where: { id: uniqueMeetingRoom } });

      roomCount.push({ roomData: roomData, count: uniqueRoomCount, roomPercentage: roomPercentage });
    }

    for (let uniqueOrganizerId of uniqueOrganizerIds) {
      const uniqueOrganizerCount = meetingOrganizers.filter((meetingOrganizer) => meetingOrganizer === uniqueOrganizerId).length;
      const organizerPercentage = ((uniqueOrganizerCount / totalMeetingRooms) * 100).toFixed(2);
      const userData = await User.findOne({ where: { id: uniqueOrganizerId } });

      organizerCount.push({ userData: userData, count: uniqueOrganizerCount, organizerPercentage: organizerPercentage });
    }


    const uniqueTopRooms = getUniqueTopRooms(roomCount);
    const uniqueTopUsers = getUniqueTopUsers(organizerCount);


    res.status(200).json(new ApiResponse(200, { roomCount: uniqueTopRooms, organizerCount: uniqueTopUsers }));
  }
);
