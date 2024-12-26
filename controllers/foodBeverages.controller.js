import FoodBeverage from "../models/FoodBeverage.model.js";
import { getAllActiveFoodBeverageService } from "../services/FoodBeverages.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addFoodBeverage = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "FoodBeverage name is required");
  }

  // Check for duplicate foodBeverageName
  const existingFoodBeverage = await FoodBeverage.findOne({
    where: { foodBeverageName: name },
  });
  if (existingFoodBeverage) {
    throw new ApiError(400, "FoodBeverage with this name already exists");
  }

  const foodBeverage = await FoodBeverage.create({ foodBeverageName: name, status: true });

  res
    .status(201)
    .json(new ApiResponse(201, { foodBeverage }, "FoodBeverage added successfully"));
});

export const updateFoodBeverage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const foodBeverage = await FoodBeverage.findByPk(id);

  if (!foodBeverage) {
    throw new ApiError(404, "FoodBeverage not found");
  }

  foodBeverage.foodBeverageName = name || foodBeverage.foodBeverageName;

  await foodBeverage.save();

  res
    .status(200)
    .json(new ApiResponse(200, { foodBeverage }, "FoodBeverage updated successfully"));
});

export const getAllFoodBeverages = asyncHandler(async (req, res) => {
  const foodBeverages = await FoodBeverage.findAll({
    attributes: ["id", "foodBeverageName", "status", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, { foodBeverages }, "Food beverages retrieved successfully")
    );
});

// Get all active foodBeverage
export const getAllActiveFoodBeverages = asyncHandler(async (req, res) => {

  const result = await getAllActiveFoodBeverageService();
  return res
  .status(200)
  .json(
    new ApiResponse(200, { result }, "FoodBeverages retrieved successfully")
  );
  
});

export const changeFoodBeverageStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const foodBeverage = await FoodBeverage.findByPk(id);

  if (!foodBeverage) {
    throw new ApiError(404, "FoodBeverage not found");
  }

  foodBeverage.status = !foodBeverage.status;
  await foodBeverage.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { foodBeverage },
        `FoodBeverage status changed to ${foodBeverage.status ? "active" : "inactive"}`
      )
    );
});

export const deleteFoodBeverage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const foodBeverage = await FoodBeverage.findByPk(id);

  if (!foodBeverage) {
    throw new ApiError(404, "FoodBeverage not found");
  }

  await foodBeverage.destroy(); // Permanent delete (or use soft delete if configured)

  res
    .status(200)
    .json(new ApiResponse(200, null, "FoodBeverage deleted successfully"));
});
