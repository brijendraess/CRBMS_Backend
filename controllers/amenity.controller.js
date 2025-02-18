import RoomAmenity from "../models/RoomAmenity.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getAllActiveAmenityService } from "../services/Amenity.service.js";

export const createRoomAmenity = asyncHandler(async (req, res) => {
  const { name, description, quantity } = req.body;

  if (!name) {
    throw new ApiError(400, "Name Is required");
  }
  const roomAmenity = await RoomAmenity.create({
    name,
    description,
    quantity,
    status:true
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, { roomAmenity }, "Room Amenity added successfully")
    );
});

export const getAllRoomAmenities = asyncHandler(async (req, res) => {
  const roomAmenities = await RoomAmenity.findAll();

  res
    .status(200)
    .json(
      new ApiResponse(201, { roomAmenities }, "Room Amenity added successfully")
    );
});

export const getSingleRoomAmenityController = asyncHandler(async (req, res) => {
  const { amenityId } = req.params;
  const roomAmenity = await RoomAmenity.findOne({
    where: {
      id: amenityId,
    },
  });
  res
    .status(200)
    .json(
      new ApiResponse(201, { roomAmenity }, "Room fetch successfully")
    );
});

export const getAllActiveRoomAmenities = asyncHandler(async (req, res) => {

  const result = await getAllActiveAmenityService();
  return res
  .status(200)
  .json(
    new ApiResponse(200, { result }, "Amenity retrieved successfully")
  );
 

});

export const updateRoomAmenity = asyncHandler(async (req, res) => {
  const { amenityId } = req.params;
  const { name, description, status, quantity } = req.body;

  const roomAmenity = await RoomAmenity.findByPk(amenityId);

  if (!roomAmenity) {
    throw new ApiError(404, "Room Amenity not found");
  }

  roomAmenity.name = name || roomAmenity.name;
  roomAmenity.description = description || roomAmenity.description;
  roomAmenity.status = status || roomAmenity.status;
  roomAmenity.quantity = quantity || roomAmenity.quantity;

  await roomAmenity.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, { roomAmenity }, "Room Amenity Updated successfully")
    );
});

export const deleteRoomAmenity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const roomAmenity = await RoomAmenity.findByPk(id);

  if (!roomAmenity) {
    throw new ApiError(404, "Room Amenity not found");
  }

  await roomAmenity.destroy();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Room Amenity Deleted successfully"));
});

export const updateRoomAmenityQuantity = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const { quantity } = req.body;

  if (quantity === undefined || quantity < 0) {
    throw new ApiError(400, "Valid quantity is required");
  }

  const roomAmenity = await RoomAmenity.findByPk(id);

  if (!roomAmenity) {
    throw new ApiError(404, "Room Amenity not found");
  }

  roomAmenity.quantity = quantity;

  await roomAmenity.save();

  res.status(200).json({
    success: true,
    message: "Room Amenity quantity updated successfully",
    data: roomAmenity,
  });
});

export const changeAmenityStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const roomAmenity = await RoomAmenity.findByPk(id);
  if (!roomAmenity) {
    throw new ApiError(404, "Amenity not found");
  } 
  roomAmenity.status = !roomAmenity.dataValues.status;
  await roomAmenity.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomAmenity },
        `Amenity status changed to ${roomAmenity?.dataValues?.status ? "active" : "inactive"}`
      )
    );
});