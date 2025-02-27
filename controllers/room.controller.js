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
  editSanitationStatus,
  getAllAmenitiesActiveQuantityService,
  getAllAmenitiesQuantityService,
  getallCurrentMeetingService,
  getAllFoodBeverageActiveService,
  getAllFoodBeverageService,
  getRoomByIdService,
} from "../services/Room.service.js";
import Location from "../models/Location.model.js";
import RoomGallery from "../models/RoomGallery.models.js";
import Meeting from "../models/Meeting.models.js";
import RoomAmenity from "../models/RoomAmenity.model.js";
import RoomAmenityQuantity from "../models/RoomAmenitiesQuantity.models.js";
import User from "../models/User.models.js";
import Services from "../models/Services.models.js";
import FoodBeverage from "../models/FoodBeverage.model.js";
import RoomFoodBeverage from "../models/RoomFoodBeverage.models.js";
import moment from "moment";

export const createRoom = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    location,
    services,
    capacity,
    tolerancePeriod,
    sanitationStatus,
    sanitationPeriod,
    isAvailable,
  } = req.body;

  if (!name || !location || !capacity || !services) {
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
    services,
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
    filterLocation,
    filterServices,
    filterFoodBeverage,
    filterCapacity,
  } = req.query;

  const meetingDate = filterDate ? moment(new Date(filterDate)).format("YYYY-MM-DD") : null;
  const requiredStartTime = filterStartTime ? new Date(filterStartTime)?.toTimeString()?.split(" ")[0] : null;
  const requiredEndTime = filterEndingTime ? new Date(filterEndingTime)?.toTimeString()?.split(" ")[0] : null;

  const user = req.user.UserType.isAdmin === "admin";
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


    let meetingsData = [];

    if(meetingDate, requiredStartTime, requiredEndTime){
      const whereCondition = meetingDate
      ? {
          [Op.and]: [
            { meetingDate }, // Only consider meetings on this date
            {
              [Op.and]: [
                { startTime: { [Op.lt]: requiredEndTime } }, // Starts before given endTime
                { endTime: { [Op.gt]: requiredStartTime } }, // Ends after given startTime
              ],
            },
          ],
        }
      : {
          // If meetingDate is not provided, check only time
          [Op.and]: [
            { startTime: { [Op.lt]: requiredEndTime } }, // Starts before given endTime
            { endTime: { [Op.gt]: requiredStartTime } }, // Ends after given startTime
          ],
        };
        meetingsData = await Meeting.findAll({
          where: whereCondition,
        });
    }
  // Amenities execution
  const amenityIds = filterAmenities
    ? await RoomAmenity.findAll({
        where: {
          name: {
            [Op.in]: filterAmenities,
          },
        },
      })
    : [];

  const amenityIdCalculated = amenityIds
    ? amenityIds.map((amenity) => amenity?.dataValues?.id)
    : [];

  const whereClauseAmenityQuantity = amenityIdCalculated.length
    ? { amenityId: { [Op.in]: amenityIdCalculated } }
    : null; // Default condition when the array is empty

  // Food and beverage execution
  const foodBeverageIds = filterFoodBeverage
    ? await FoodBeverage.findAll({
        where: {
          foodBeverageName: {
            [Op.in]: filterFoodBeverage,
          },
        },
      })
    : [];
  const foodBeverageIdCalculated = foodBeverageIds
    ? foodBeverageIds.map((foodBeverage) => foodBeverage?.dataValues?.id)
    : [];

  const whereClauseFoodBeverage = foodBeverageIdCalculated.length
    ? { foodBeverageId: { [Op.in]: foodBeverageIdCalculated } }
    : null; // Default condition when the array is empty

  const filterCapacityCalculated = filterCapacity ? filterCapacity : 1;

  const filterLocationCalculated = filterLocation ? filterLocation : null;
  const whereClauseLocation = filterLocationCalculated
    ? { locationName: { [Op.in]: filterLocationCalculated } }
    : null;

  const filterServicesCalculated = filterServices ? filterServices : null;
  const whereClauseServices = filterServicesCalculated
    ? { servicesName: { [Op.in]: filterServicesCalculated } }
    : null;

  let rooms;
  if(meetingsData && meetingsData.length > 0){
    const notAvailableRoomIds = meetingsData.map(
      (meeting) => meeting?.dataValues?.roomId);
      rooms = await Room.findAll({
        where: {
          id: {
            [Op.notIn]: notAvailableRoomIds,
          },
          capacity: {
            [Op.gte]: filterCapacityCalculated,
          },
          isAvailable: user ? { [Op.in]: [true, false] } : true,
        },
        include: [
          {
            model: Location,
            where: whereClauseLocation || null,
          },
          {
            model: Services,
            where: whereClauseServices || null,
          },
          {
            model: RoomGallery,
          },
          {
            model: RoomAmenityQuantity,
            where: whereClauseAmenityQuantity || null,
          },
          {
            model: RoomFoodBeverage,
            where: whereClauseFoodBeverage || null,
          },
          {
            model: Meeting,
          },
        ],
    });
  } 
  else{
    rooms = await Room.findAll({
      where: {
        capacity: {
          [Op.gte]: filterCapacityCalculated,
        },
        isAvailable: user ? { [Op.in]: [true, false] } : true,
      },
      include: [
        {
          model: Location,
          where: whereClauseLocation || null,
        },
        {
          model: Services,
          where: whereClauseServices || null,
        },
        {
          model: RoomGallery,
        },
        {
          model: RoomAmenityQuantity,
          where: whereClauseAmenityQuantity || null,
        },
        {
          model: RoomFoodBeverage,
          where: whereClauseFoodBeverage || null,
        },
        {
          model: Meeting,
        },
      ],
    });
  }
  
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
  const meeting = await Meeting.findAll({
    include: [
      {
        model: Room,
        include: [
          {
            model: Location,
          },
          {
            model: Services,
          },
        ],
      },
      {
        model: User,
      },
    ],
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
    services,
    capacity,
    sanitationStatus,
    tolerancePeriod,
    sanitationPeriod,
    isAvailable,
    description,
  } = req.body;

  const room = await Room.findByPk(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }
  let roomImagePath = null;
  if (req.file) {
    roomImagePath = `room-images/${name.replace(/\s+/g, "_")}${path
      .extname(req.file.originalname)
      .toLowerCase()}`;
  }

  room.name = name ?? room.name;
  room.location = location ?? room.location.id;
  room.services = services ?? room.services.id;
  room.capacity = capacity ?? room.capacity;
  room.roomImagePath = roomImagePath ?? room.roomImagePath;
  room.sanitationStatus = sanitationStatus ?? room.sanitationStatus;
  room.tolerancePeriod = tolerancePeriod ?? room.tolerancePeriod;
  room.sanitationPeriod = sanitationPeriod ?? room.sanitationPeriod;
  room.isAvailable = isAvailable ?? room.isAvailable;
  room.description = description ?? room.description;

  await room.save();

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
  const { quantity, updatedBy } = req.body;

  const result = await editAmenityQuantityService(
    quantity,
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
    .json(
      new ApiResponse(
        200,
        { result },
        "Rooms food beverage  Retrieved Successfully"
      )
    );
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
      new ApiResponse(201, { result }, "Room food beverage added successfully")
    );
});

export const editFoodBeverage = asyncHandler(async (req, res) => {
  const { foodBeverageId } = req.params;
  const {  updatedBy } = req.body;

  const result = await editFoodBeverageService(
    updatedBy,
    foodBeverageId
  );

  res.status(200).json({
    success: true,
    message: "Room food beverage updated successfully",
    data: result,
  });
});

export const updateSanitationStatus = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { status } = req.body;

  const result = await editSanitationStatus(status, roomId);

  res.status(200).json({
    success: true,
    message: "Sanitation status updated successfully",
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

// Get all Amenity quantity
export const getallCurrentMeeting = asyncHandler(async (req, res) => {
  const result = await getallCurrentMeetingService();
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { result },
        "All meeting of current time retrieved Successfully"
      )
    );
});
