import {
  allStockService,
  plusStockService,
  addStockService,
  checkStockService,
  stockHistoryService,
  allPendingAmenitiesService,
  allPendingFoodBeverageService,
  changeStatusPendingAmenitiesService,
  allPendingAmenitiesCountService,
  allPendingFoodBeverageCountService,
  changeStatusPendingFoodBeverageService,
} from "../services/stock.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Getting all Stock
export const allStock = asyncHandler(async (req, res) => {
  const result = await allStockService();
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "user type retrieved successfully"));
});

// Getting all pending Amenities
export const allPendingAmenities = asyncHandler(async (req, res) => {
  const result = await allPendingAmenitiesService();
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "Pending amenities retrieved successfully"));
});

// Getting all pending Amenities
export const allPendingAmenitiesCount = asyncHandler(async (req, res) => {
  const result = await allPendingAmenitiesCountService();
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "Pending amenities count retrieved successfully"));
});

// Change status for pending amenities
export const changeStatusPendingAmenities = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await changeStatusPendingAmenitiesService(id);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { result }, "Amenities status changed successfully")
    );
});

// Getting all pending Food Beverage 
export const allPendingFoodBeverage = asyncHandler(async (req, res) => {
  const result = await allPendingFoodBeverageService();
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "Pending food beverage retrieved successfully"));
});

// Getting all pending Food Beverage
export const allPendingFoodBeverageCount = asyncHandler(async (req, res) => {
  const result = await allPendingFoodBeverageCountService();
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "Pending food beverage count retrieved successfully"));
});

// Change status for pending amenities
export const changeStatusPendingFoodBeverage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await changeStatusPendingFoodBeverageService(id);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { result }, "food beverage status changed successfully")
    );
});

// Getting all Stock history
export const stockHistory = asyncHandler(async (req, res) => {
  const result = await stockHistoryService();
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "user type retrieved successfully"));
});

// Adding Stock
export const addStock = asyncHandler(async (req, res) => {
  const { stockType, stock, itemId ,createdBy} = req.body;
  const result = await addStockService({
    stockType,
    stock,
    itemId,
    createdBy,
  });
  if (result.exists > 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { result }, "Stock already exits"));
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, { result }, "Stock added successfully"));
  }
});

// Increment the stock
export const plusStock = asyncHandler(async (req, res) => {
  const { amenityId,roomId,stock,createdBy, id } = req.body;
  const result = await plusStockService({
    amenityId,
    roomId,
    stock,
    createdBy,
    id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "user type deleted successfully"));
});

// Check the stock
export const checkStock = asyncHandler(async (req, res) => {
  const { amenityId } = req.params;
  const result = await checkStockService({
    amenityId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "user type deleted successfully"));
});
