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

export const getUserCount = asyncHandler(async (req, res, next) => {
  const count = await User.count();
  res.status(200).json(new ApiResponse(200, { count }));
});

export const getAmenityCount = asyncHandler(async (req, res, next) => {
  const count = await RoomAmenity.count();
  res.status(200).json(new ApiResponse(200, { count }));
});

export const getFoodBeverageCount = asyncHandler(async (req, res, next) => {
  const count = await FoodBeverage.count();
  res.status(200).json(new ApiResponse(200, { count }));
});

export const getRoomCount = asyncHandler(async (req, res, next) => {
  const count = await Room.count();
  res.status(200).json(new ApiResponse(200, { count }));
});

export const getMeetingCount = asyncHandler(async (req, res, next) => {
  const { filter } = req.query; // Get the filter value from query params

  // Define date ranges based on the filter
  const now = new Date();
  let startDate, endDate;

  if (filter === "Today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // End of today
  } else if (filter === "This Month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of this month
    endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1); // Start of next month
  } else if (filter === "This Year") {
    startDate = new Date(now.getFullYear(), 0, 1); // Start of this year
    endDate = new Date(now.getFullYear() + 1, 0, 1); // Start of next year
  } else {
    throw new ApiError(
      400,
      "Invalid filter value. Use 'Today', 'This Month', or 'This Year'."
    );
  }

  // Build the query condition for the `meetingDate` column
  const whereCondition = {
    meetingDate: {
      [Op.between]: [
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      ],
    },
  };

  // Count the meetings
  const meetingCount = await Meeting.count({ where: whereCondition });

  // Send the response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { meetingCount },
        "Meeting count fetched successfully"
      )
    );
});

export const getCommitteeCount = asyncHandler(async (req, res, next) => {
  const count = await Committee.count();
  res.status(200).json(new ApiResponse(200, { count }));
});

export const getActiveCommitteeCount = asyncHandler(async (req, res, next) => {
  const count = await Committee.count({
    where: {
      status: {
        [Op.eq]: true,
      },
    },
  });
  res.status(200).json(new ApiResponse(200, { count }));
});

export const getInactiveCommitteeCount = asyncHandler(
  async (req, res, next) => {
    const count = await Committee.count({
      where: {
        status: {
          [Op.eq]: false,
        },
      },
    });
    res.status(200).json(new ApiResponse(200, { count }));
  }
);

export const getVisitorCount = asyncHandler(async (req, res, next) => {
  const visitorCount = await Visitor.count();
  res.status(200).json(new ApiResponse(200, { visitorCount }));
});
