import {
  activeServicesService,
  addServicesService,
  allServicesService,
  changeStatusServicesService,
  deleteServicesService,
  editServicesService,
  singleServicesService,
} from "../services/Services.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const singleServices = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await singleServicesService(id);
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "services retrieved successfully"));
});

// Getting all services
export const allServices = asyncHandler(async (req, res) => {
  const result = await allServicesService();
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "services retrieved successfully"));
});

// Deleting services
export const deleteServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteServicesService(id);
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "services deleted successfully"));
});

// Deleting services
export const changeStatusServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await changeStatusServicesService(id);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { result }, "services status changed successfully")
    );
});

// Getting all services
export const editServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { servicesName } = req.body;
  const params = { servicesName, id };
  const result = await editServicesService(params);
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "services updated successfully"));
});

export const addServices = asyncHandler(async (req, res) => {
  const { servicesName, status } = req.body;
const createdBy=req.user.id
  const result = await addServicesService(servicesName, status, createdBy);
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "services retrieved successfully"));
});

// Getting all services
export const activeServices = asyncHandler(async (req, res) => {
  const result = await activeServicesService();
  return res
    .status(200)
    .json(
      new ApiResponse(200, { result }, "active services retrieved successfully")
    );
});
