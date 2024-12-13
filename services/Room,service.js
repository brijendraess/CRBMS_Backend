import Room from "../models/Room.models.js";
import RoomAmenityQuantity from "../models/RoomAmenitiesQuantity.models.js";
import RoomAmenity from "../models/RoomAmenity.model.js";
import User from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllAmenitiesQuantityService = async (roomId) => {
  try {
    const quantityAmenities = await RoomAmenityQuantity.findAll({
      include: [
        {
          model: RoomAmenity,
        },
        {
          model: Room,
        },
        {
          model: User,
        },
      ],
      where:{
        roomId:roomId
      },
      order: [["createdAt", "DESC"]],
    });

    if (!quantityAmenities.length) {
      throw new ApiError(404, "No amenity quantity found");
    }
    return quantityAmenities;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const createAmenityQuantityService = async (
  quantity,
  status,
  createdBy,
  roomId,
  amenityId
) => {
  try {

    const roomAmenityQuantity = await RoomAmenityQuantity.findOne(
      {
        where:{
          roomId:roomId,
          amenityId:amenityId
        }
      }
    );
    if (roomAmenityQuantity) {
      throw new ApiError(404, "Room amenity already present");
    }


    const roomAmenity = await RoomAmenityQuantity.create({
      quantity,
      status,
      createdBy,
      roomId,
      amenityId,
    });

    return roomAmenity;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const getAllAmenitiesActiveQuantityService = async (roomId) => {
  try {
    const quantityAmenities = await RoomAmenityQuantity.findAll({
      include: [
        {
          model: RoomAmenity,
        },
        {
          model: Room,
        },
        {
          model: User,
        },
      ],
      order: [["createdAt", "DESC"]],
      where: { status: true, roomId:roomId },
    });

    if (!quantityAmenities.length) {
      throw new ApiError(404, "No amenity quantity found");
    }
    return quantityAmenities;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const editAmenityQuantityService = async (
  quantity,
  status,
  updatedBy,
  amenityQuantityId
) => {
  try {
    const roomAmenityQuantity = await RoomAmenityQuantity.findByPk(
      amenityQuantityId
    );

    if (!roomAmenityQuantity) {
      throw new ApiError(404, "Room not found");
    }

    roomAmenityQuantity.quantity = quantity ?? roomAmenityQuantity.quantity;
    roomAmenityQuantity.status = status ?? roomAmenityQuantity.status;
    roomAmenityQuantity.updatedBy = updatedBy ?? roomAmenityQuantity.updatedBy;

    await roomAmenityQuantity.save();

    return roomAmenityQuantity;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const deleteAmenityQuantityService = async (
  amenityQuantityId
) => {
  try {
    const roomAmenityQuantity = await RoomAmenityQuantity.findByPk(
      amenityQuantityId
    );

    if (!roomAmenityQuantity) {
      throw new ApiError(404, "Room amenity quantity not found");
    }
    await roomAmenityQuantity.destroy();

    return roomAmenityQuantity;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
