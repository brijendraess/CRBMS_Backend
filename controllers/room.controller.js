import bcrypt from "bcrypt";
import Room from "../models/Room.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import path from "path";
import { Op } from "sequelize";
import fs from "fs";
import {
  createAmenityQuantityService,
  createFoodBeverageService,
  deleteAmenityQuantityService,
  deleteFoodBeverageService,
  editAmenityQuantityService,
  editFoodBeverageService,
  getAllAmenitiesActiveQuantityService,
  getAllAmenitiesQuantityService,
  getAllFoodBeverageActiveService,
  getAllFoodBeverageService,
  getRoomByIdService,
} from "../services/Room.service.js";
import Location from "../models/Location.model.js";
import RoomGallery from "../models/RoomGallery.models.js";
import Meeting from "../models/Meeting.models.js";
import RoomAmenity from "../models/RoomAmenity.model.js";
import RoomAmenityQuantity from "../models/RoomAmenitiesQuantity.models.js";
import RoomFoodBeverage from "../models/RoomFoodBeverage.models.js";
import FoodBeverage from "../models/FoodBeverage.model.js";
import MeetingUser from "../models/MeetingUser.js";
import User from "../models/User.models.js";

export const createRoom = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    location,
    capacity,
    tolerancePeriod,
    sanitationStatus,
    sanitationPeriod,
    isAvailable,
  } = req.body;

  if (!name || !location || !capacity) {
    throw new ApiError(400, "Please fill in all fields");
  }

  const existingRoom = await Room.findOne({ where: { name } });
  if (existingRoom) {
    throw new ApiError(400, "Room already exists");
  }

  let roomImagePath = null;
  if (req.file) {
    roomImagePath = `room-images/${name.replace(/\s+/g, "_")}${path
      .extname(req.file.originalname)
      .toLowerCase()}`;
  }

  const room = await Room.create({
    name,
    description,
    location,
    capacity,
    tolerancePeriod,
    sanitationPeriod,
    roomImagePath,
    sanitationStatus,
    isAvailable,
  });

  if (!room) {
    if (req.file) fs.unlinkSync(`public/${roomImagePath}`); // Remove image if room creation fails
    throw new ApiError(500, "Failed to create room");
  }

  if (req.file) {
    const newRoomImagePath = `room-images/${name.replace(/\s+/g, "_")}_${
      room.id
    }${path.extname(req.file.originalname).toLowerCase()}`;
    fs.renameSync(`public/${roomImagePath}`, `public/${newRoomImagePath}`);
    room.roomImagePath = newRoomImagePath;
    await room.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(200, { room }, "Room Created Successfully"));
});

export const getAllRooms = asyncHandler(async (req, res) => {
  const {
    filterDate,
    filterStartTime,
    filterEndingTime,
    filterAmenities,
    filterCapacity,
  } = req.query;

  // Checking the available time of the room
  const sanitationPeriod = 15;
  const tolerancePeriod = 15;
  let newFormattedStartTime = filterStartTime
    ? new Date(filterStartTime)
    : null; // HH:mm:ss
  const extraCalculatedTime = sanitationPeriod + tolerancePeriod;
  filterStartTime &&
    newFormattedStartTime.setMinutes(
      newFormattedStartTime.getMinutes() - extraCalculatedTime
    );
  const newFormattedStartTimeChecked = newFormattedStartTime
    ? newFormattedStartTime.toTimeString().split(" ")[0]
    : null;
  // Convert startTime and endTime to TIME format
  const formattedEndTime = filterEndingTime
    ? new Date(filterEndingTime).toTimeString().split(" ")[0]
    : null; // HH:mm:ss
  const whereClause =
    filterDate && formattedEndTime && newFormattedStartTimeChecked
      ? {
          meetingDate: filterDate,
          ...(formattedEndTime && { startTime: { [Op.lt]: formattedEndTime } }),
          ...(newFormattedStartTimeChecked && {
            endTime: { [Op.gt]: newFormattedStartTimeChecked },
          }),
        }
      : 1;
  const findAvailability =
    whereClause != 1
      ? await Meeting.findAll({
          where: whereClause,
          attributes: ["roomId"],
        })
      : [];
  const findAvailabilityCal = findAvailability.map(
    (meeting) => meeting?.dataValues?.roomId
  );

const amenityIds=filterAmenities?await RoomAmenity.findAll({
  where: {
    name: {
      [Op.in]: filterAmenities,
    },
  },
}):[];

const amenityIdCalculated=amenityIds?amenityIds.map((amenity)=>amenity?.dataValues?.id):[];
const filterCapacityCalculated=filterCapacity?filterCapacity:1;
  // Getting Id

  const whereClauseAmenityQuantity = amenityIdCalculated.length
  ? { amenityId: { [Op.in]: amenityIdCalculated } }
  : {}; // Default condition when the array is empty

  const rooms = await Room.findAll({
    where: {
      id: {
        [Op.notIn]: findAvailabilityCal,
      },
      capacity: {
        [Op.gte]:filterCapacityCalculated,
      },
    },
    include: [
      {
        model: Location,
      },
      {
        model: RoomGallery,
      },
      {
        model: RoomAmenityQuantity,
       // where:whereClauseAmenityQuantity,
      },
    ],
  });
  return res
    .status(201)
    .json(new ApiResponse(200, { rooms }, "Rooms  Retrieved Successfully"));
});

export const getRoomById = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await getRoomByIdService(roomId);


  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { room }, "Room Fetched Successfully"));
});

export const getAllMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findAll( {
include:[
  {
    model:Room,
    include:[
      {
        model:Location
      }
    ]
  },
  {
    model:User
  }
]
  });
  if (!meeting) {
    throw new ApiError(404, "Room not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { meeting }, "Meeting Fetched Successfully"));
});

export const updateRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const {
    name,
    location,
    capacity,
    roomImagePath,
    sanitationStatus,
    tolerancePeriod,
    sanitationPeriod,
    isAvailable,
    amenities,
  } = req.body;

  const room = await Room.findByPk(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }
  room.name = name ?? room.name;
  room.location = location ?? room.location.id;
  room.capacity = capacity ?? room.capacity;
  room.roomImagePath = roomImagePath ?? room.roomImagePath;
  room.sanitationStatus = sanitationStatus ?? room.sanitationStatus;
  room.tolerancePeriod = tolerancePeriod ?? room.tolerancePeriod;
  room.sanitationPeriod = sanitationPeriod ?? room.sanitationPeriod;
  room.isAvailable = isAvailable ?? room.isAvailable;

  await room.save();

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await Room.findByPk(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  await room.destroy();

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
  });
});

export const roomLogin = asyncHandler(async (req, res) => {
  const { roomId, password } = req.body;

  if (!roomId || !password) {
    throw new ApiError(400, "Room ID and password are required");
  }

  const room = await Room.findByPk(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const isPasswordValid = await bcrypt.compare(password, room.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { password: roomPassword, ...roomData } = room.toJSON();

  res.status(200).json({
    success: true,
    message: "Room login successful",
    data: roomData,
  });
});

export const changeSanitationStatus = asyncHandler(async (req, res) => {
  const { roomId, sanitationStatus } = req.body;

  if (!roomId || !sanitationStatus) {
    throw new ApiError(400, "Room ID and sanitation status are required");
  }
  const room = await Room.findByPk(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  room.sanitationStatus = sanitationStatus;

  await room.save();

  res.status(200).json({
    success: true,
    message: "Sanitation status updated successfully",
    data: room,
  });
});

export const changeStatus = asyncHandler(async (req, res) => {
  const { roomId, status } = req.body;

  if (!roomId || !status) {
    throw new ApiError(400, "Room ID and status are required");
  }

  const room = await Room.findByPk(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  room.status = status;
  await room.save();
  res.status(200).json({
    success: true,
    message: "Room status updated successfully",
    data: room,
  });
});

export const addRoomGallery = asyncHandler(async (req, res) => {
  const { images, roomId, userId, status } = req.body;

  try {
    // Prepare data for bulkCreate
    const galleryEntries = req.files.map((file, index) => ({
      imageName: file.filename, // Saved file name
      roomId: roomId[index],
      createdBy: userId[index],
      status: status[index],
    }));
    const roomGallery = await RoomGallery.bulkCreate(galleryEntries);
    res.status(200).json({
      message: "Files uploaded successfully",
      files: req.files,
      roomGallery: roomGallery,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Failed to upload files" });
  }
});

export const deleteRoomGallery = asyncHandler(async (req, res) => {
  const { galleryId } = req.params;
  const room = await RoomGallery.findOne({
    where: { id: galleryId },
  });

  if (!room) {
    throw new ApiError(404, "Room gallery not found");
  }
  await room.destroy().then((res) => {
    const filePath = `public/room-gallery/${room.imageName}`;
    // Deleting the files

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("File does not exist");
        return;
      }

      // File exists, proceed to delete
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`);
          return;
        }
        console.log("File successfully deleted");
      });
    });
  });
  res.status(200).json({
    success: true,
    message: "Room gallery deleted successfully",
  });
});

export const getAllAmenitiesQuantity = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const result = await getAllAmenitiesQuantityService(roomId);
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { result },
        "Rooms amenities quantity retrieved Successfully"
      )
    );
});

// Get all Amenity quantity
export const getAllAmenitiesActiveQuantity = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const result = await getAllAmenitiesActiveQuantityService(roomId);
  return res
    .status(201)
    .json(new ApiResponse(200, { result }, "Rooms  Retrieved Successfully"));
});

export const createAmenityQuantity = asyncHandler(async (req, res) => {
  const { quantity, status, createdBy, roomId, amenityId } = req.body;

  const result = await createAmenityQuantityService(
    quantity,
    status,
    createdBy,
    roomId,
    amenityId
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { result },
        "Room Amenity Quantity added successfully"
      )
    );
});

export const editAmenityQuantity = asyncHandler(async (req, res) => {
  const { amenityQuantityId } = req.params;
  const { quantity, status, updatedBy } = req.body;

  const result = await editAmenityQuantityService(
    quantity,
    status,
    updatedBy,
    amenityQuantityId
  );

  res.status(200).json({
    success: true,
    message: "Room amenity quantity updated successfully",
    data: result,
  });
});

export const deleteAmenityQuantity = asyncHandler(async (req, res) => {
  const { amenityQuantityId } = req.params;
  const result = await deleteAmenityQuantityService(amenityQuantityId);

  res.status(200).json({
    success: true,
    data: result,
    message: "Room amenity quantity deleted successfully",
  });
});

export const getSingleRoomController = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const roomGallery = await RoomGallery.findAll({
    where: {
      roomId: roomId,
    },
  });
  res
    .status(200)
    .json(
      new ApiResponse(201, { roomGallery }, "Room gallery fetch successfully")
    );
});

export const getAllFoodBeverage = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const result = await getAllFoodBeverageService(roomId);
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { result },
        "Rooms food beverage retrieved Successfully"
      )
    );
});

// Get all Amenity quantity
export const getAllFoodBeverageActive = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const result = await getAllFoodBeverageActiveService(roomId);
  return res
    .status(201)
    .json(new ApiResponse(200, { result }, "Rooms food beverage  Retrieved Successfully"));
});

export const createFoodBeverage = asyncHandler(async (req, res) => {
  const { quantity, status, createdBy, roomId, foodBeverageId } = req.body;

  const result = await createFoodBeverageService(
    quantity,
    status,
    createdBy,
    roomId,
    foodBeverageId
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { result },
        "Room food beverage added successfully"
      )
    );
});

export const editFoodBeverage = asyncHandler(async (req, res) => {
  const { foodBeverageId } = req.params;
  const { status, updatedBy } = req.body;

  const result = await editFoodBeverageService(
    status,
    updatedBy,
    foodBeverageId
  );

  res.status(200).json({
    success: true,
    message: "Room food beverage updated successfully",
    data: result,
  });
});

export const deleteFoodBeverage = asyncHandler(async (req, res) => {
  const { foodBeverageId } = req.params;
  const result = await deleteFoodBeverageService(foodBeverageId);

  res.status(200).json({
    success: true,
    data: result,
    message: "Room food beverage deleted successfully",
  });
});
