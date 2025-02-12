import FoodBeverage from "../models/FoodBeverage.model.js";
import Room from "../models/Room.models.js";
import RoomAmenityQuantity from "../models/RoomAmenitiesQuantity.models.js";
import RoomAmenity from "../models/RoomAmenity.model.js";
import RoomFoodBeverage from "../models/RoomFoodBeverage.models.js";
import Stock from "../models/Stock.models.js";
import StockHistory from "../models/StockHistory.models.js";
import User from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";

// Getting all user type

export const allStockService = async () => {
  try {
    const stock = await Stock.findAll({
      include: [
        {
          model: RoomAmenity,
        },
      ],
    });
    if (!stock) {
      throw new ApiError(404, "No user type found");
    }
    return stock;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const allPendingAmenitiesService = async () => {
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
    });
    if (!quantityAmenities) {
      throw new ApiError(404, "No pending amenities found");
    }
    const sortedData = quantityAmenities.sort((a, b) => {
      if (a.status === b.status) {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort by date if status is same
      }
      return a.status ? 1 : -1; // False (or 0) comes first
    });
    return sortedData;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const allPendingAmenitiesCountService = async () => {
  try {
    const quantityAmenities = await RoomAmenityQuantity.count({
      where: { status: false },
    });
    return quantityAmenities;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// Change status of pending amenities
export const changeStatusPendingAmenitiesService = async (id) => {
  try {
    const amenities = await RoomAmenityQuantity.findByPk(id);

    if (!amenities) {
      throw new ApiError(404, "Pending amenities not found");
    }

    amenities.status = !amenities.status;
    await amenities.save();

    return amenities;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const allPendingFoodBeverageService = async () => {
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
    });
    const sortedData = foodBeverage.sort((a, b) => {
      if (a.status === b.status) {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort by date if status is same
      }
      return a.status ? 1 : -1; // False (or 0) comes first
    });
    return sortedData;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const allPendingFoodBeverageCountService = async () => {
  try {
    const quantityRoomFoodBeverage = await RoomFoodBeverage.count({
      where: { status: false },
    });
    return quantityRoomFoodBeverage;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// Change status of pending amenities
export const changeStatusPendingFoodBeverageService = async (id) => {
  try {
    const foodBeverage = await RoomFoodBeverage.findByPk(id);

    if (!foodBeverage) {
      throw new ApiError(404, "Pending food beverage not found");
    }

    foodBeverage.status = !foodBeverage.status;
    await foodBeverage.save();

    return foodBeverage;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const stockHistoryService = async () => {
  try {
    const stock = await StockHistory.findAll({
      include: [
        {
          model: Room,
        },
        {
          model: RoomAmenity,
        },
      ],
      order: [["createdAt", "DESC"]], // Order by 'createdAt' column in descending order
    });
    if (!stock) {
      throw new ApiError(404, "No user type found");
    }
    return stock;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const addStockService = async ({
  stockType,
  stock,
  itemId,
  createdBy,
}) => {
  try {
    const stockCheck = await Stock.findAndCountAll({ where: { itemId } });
    if (stockCheck.count === 0) {
      const stockResult = await Stock.create({
        stockType,
        stock,
        itemId,
      }).then(async () => {
        await StockHistory.create({
          stockInOut: "increase",
          stockUsed: stock,
          amenityId: itemId,
          createdBy,
        });
      });

      return { exists: 0, result: stockResult };
    } else {
      return { exists: stockCheck.count, result: stockCheck };
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const plusStockService = async ({
  amenityId,
  roomId,
  stock,
  createdBy,
  id,
}) => {
  try {
    if (isNaN(stock)) {
      throw new Error("Invalid stock value. Must be a number.");
    }

    const result = await Stock.increment(
      { stock: Number(stock) },
      { where: { itemId: amenityId } }
    ).then(async () => {
      await StockHistory.create({
        stockInOut: roomId
          ? stock < 0
            ? "out"
            : "in"
          : stock < 0
          ? "decrease"
          : "increase",
        stockUsed: stock,
        amenityId,
        roomId,
        createdBy,
      });
    });

    return result;
  } catch (error) {
    console.error("Error incrementing stock:", error.message);
    throw error;
  }
};

export const checkStockService = async ({ amenityId }) => {
  try {
    const stock = await Stock.findAll({
      where: {
        itemId: amenityId,
      },
      include: [
        {
          model: RoomAmenity,
        },
      ],
    });
    if (!stock) {
      throw new ApiError(404, "No user type found");
    }
    return stock;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
