import {
  allStockService,
  plusStockService,
  addStockService,
  checkStockService,
  stockHistoryService,
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
