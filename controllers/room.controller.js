import bcrypt from "bcrypt";
import Room from "../models/Room.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import path from "path";
import fs from "fs";
import {
  createAmenityQuantityService,
  deleteAmenityQuantityService,
  editAmenityQuantityService,
  getAllAmenitiesActiveQuantityService,
  getAllAmenitiesQuantityService,
} from "../services/Room,service.js";
import Location from "../models/Location.model.js";
import RoomGallery from "../models/RoomGallery.models.js";

export const createRoom = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    location,
    capacity,
    tolerancePeriod,
    sanitationStatus,
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
    roomImagePath,
    sanitationStatus,
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
  const rooms = await Room.findAll({
    include: [
      {
        model: Location,
      },
      {
        model: RoomGallery,
      },
    ],
  });

  return res
    .status(201)
    .json(new ApiResponse(200, { rooms }, "Rooms  Retrieved Successfully"));
});

export const getRoomById = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await Room.findByPk(roomId, {
    attributes: { exclude: ["password"] },
  });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { room }, "Room Fetched Successfully"));
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
  const result = await getAllAmenitiesQuantityService();
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
  const result = await getAllAmenitiesActiveQuantityService();
  return res
    .status(201)
    .json(new ApiResponse(200, { result }, "Rooms  Retrieved Successfully"));
});

export const createAmenityQuantity = asyncHandler(async (req, res) => {
 console.log(req.body)


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
  const { deletedBy } = req.body;
  const result = await deleteAmenityQuantityService(
    amenityQuantityId,
    deletedBy
  );

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
