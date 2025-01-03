import FoodBeverage from "../models/FoodBeverage.model.js";
import Location from "../models/Location.model.js";
import Meeting from "../models/Meeting.models.js";
import Room from "../models/Room.models.js";
import RoomAmenityQuantity from "../models/RoomAmenitiesQuantity.models.js";
import RoomAmenity from "../models/RoomAmenity.model.js";
import RoomFoodBeverage from "../models/RoomFoodBeverage.models.js";
import RoomGallery from "../models/RoomGallery.models.js";
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
      where: {
        roomId: roomId,
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
    const roomAmenityQuantity = await RoomAmenityQuantity.findOne({
      where: {
        roomId: roomId,
        amenityId: amenityId,
      },
    });
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
      where: { status: true, roomId: roomId },
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

export const deleteAmenityQuantityService = async (amenityQuantityId) => {
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

export const getAllFoodBeverageService = async (roomId) => {
  try {
    const foodBeverage = await RoomFoodBeverage.findAll({
      include: [
        {
          model: FoodBeverage,
        },
        {
          model: Room,
        },
        {
          model: User,
        },
      ],
      where: {
        roomId: roomId,
      },
      order: [["createdAt", "DESC"]],
    });

    return foodBeverage;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const createFoodBeverageService = async (
  quantity,
  status,
  createdBy,
  roomId,
  foodBeverageId
) => {
  try {
    const roomFoodBeverage = await RoomFoodBeverage.findOne({
      where: {
        roomId: roomId,
        foodBeverageId: foodBeverageId,
      },
    });
    if (roomFoodBeverage) {
      throw new ApiError(404, "Room food beverage already present");
    }

    const roomCreateRoomFoodBeverage = await RoomFoodBeverage.create({
      quantity,
      status,
      createdBy,
      roomId,
      foodBeverageId,
    });

    return roomCreateRoomFoodBeverage;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const getAllFoodBeverageActiveService = async (roomId) => {
  try {
    const foodBeverage = await RoomFoodBeverage.findAll({
      include: [
        {
          model: FoodBeverage,
        },
        {
          model: Room,
        },
        {
          model: User,
        },
      ],
      order: [["createdAt", "DESC"]],
      where: { status: true, roomId: roomId },
    });

    if (!foodBeverage.length) {
      throw new ApiError(404, "No food beverage found");
    }
    return foodBeverage;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const editFoodBeverageService = async (
  status,
  updatedBy,
  foodBeverageId
) => {
  try {
    const roomFoodBeverage = await RoomFoodBeverage.findByPk(foodBeverageId);

    if (!roomFoodBeverage) {
      throw new ApiError(404, "Room food beverage not found");
    }

    roomFoodBeverage.status = status ?? roomFoodBeverage.status;
    roomFoodBeverage.updatedBy = updatedBy ?? roomFoodBeverage.updatedBy;

    await roomFoodBeverage.save();

    return roomFoodBeverage;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const editSanitationStatus = async (status, roomId) => {
  try {
    const roomSanitationStatus = await Room.findByPk(roomId);

    if (!roomSanitationStatus) {
      throw new ApiError(404, "Room food beverage not found");
    }

    roomSanitationStatus.sanitationStatus =
      status ?? roomSanitationStatus.sanitationStatus;

    await roomSanitationStatus.save();

    return roomSanitationStatus;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const deleteFoodBeverageService = async (foodBeverageId) => {
  try {
    const roomFoodBeverage = await RoomFoodBeverage.findByPk(foodBeverageId);

    if (!roomFoodBeverage) {
      throw new ApiError(404, "Room food beverage not found");
    }
    await roomFoodBeverage.destroy();

    return roomFoodBeverage;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
export const getRoomByIdService = async (roomId) => {
  try {
    const room = await Room.findAll({
      where: {
        id: roomId,
      },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Location,
        },
        {
          model: RoomGallery,
        },
        {
          model: RoomAmenityQuantity,
          include: [
            {
              model: RoomAmenity,
            },
          ],
        },
        {
          model: RoomFoodBeverage,
          include: [
            {
              model: FoodBeverage,
            },
          ],
        },
        {
          model: Meeting,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });

    return room;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
