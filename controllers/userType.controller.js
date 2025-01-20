import {
  activeUserTypeDetailService,
  addUserTypeService,
  allUserTypeDetailService,
  changeStatusUserTypeDetailService,
  deleteUserTypeDetailService,
  editUserTypeDetailService,
  singleUserTypeDetailService,
} from "../services/userType.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const singleUserTypeDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await singleUserTypeDetailService(id);
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "user type retrieved successfully"));
});

// Getting all user Type
export const allUserTypeDetail = asyncHandler(async (req, res) => {
  const result = await allUserTypeDetailService();
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "user type retrieved successfully"));
});

// Deleting user Type
export const deleteUserTypeDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteUserTypeDetailService(id);
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "user type deleted successfully"));
});

// Deleting user Type
export const changeStatusUserTypeDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await changeStatusUserTypeDetailService(id);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { result }, "user type status changed successfully")
    );
});

// Getting all user Type
export const editUserTypeDetail = asyncHandler(async (req, res) => {
  const { userTypeId } = req.params;
  const {
    userTypeName,
    calendarModule,
    userModule,
    committeeModule,
    notificationModule,
    inventoryModule,
    committeeMemberModule,
    amenitiesModule,
    roomModule,
    locationModule,
    foodBeverageModule,
    reportModule,
    meetingLogsModule,
    userRoleModule,
  } = req.body;
  const params = {
    userTypeName,
    calendarModule,
    userModule,
    committeeModule,
    notificationModule,
    inventoryModule,
    committeeMemberModule,
    amenitiesModule,
    roomModule,
    locationModule,
    foodBeverageModule,
    reportModule,
    meetingLogsModule,
    userRoleModule,
    userTypeId,
  };
  const result = await editUserTypeDetailService(params);
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "user type updated successfully"));
});

export const addUserType = asyncHandler(async (req, res) => {
  const {
    userTypeName,
    calendarModule,
    userModule,
    committeeModule,
    notificationModule,
    inventoryModule,
    committeeMemberModule,
    amenitiesModule,
    roomModule,
    locationModule,
    foodBeverageModule,
    reportModule,
    meetingLogsModule,
    userRoleModule,
    status,
    createdBy,
    isAdmin,
  } = req.body;

  const result = await addUserTypeService(
    userTypeName,
    calendarModule,
    userModule,
    committeeModule,
    notificationModule,
    inventoryModule,
    committeeMemberModule,
    amenitiesModule,
    roomModule,
    locationModule,
    foodBeverageModule,
    reportModule,
    meetingLogsModule,
    userRoleModule,
    status,
    createdBy,
    isAdmin
  );
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "user type retrieved successfully"));
});

// Getting all user Type
export const activeUserTypeDetail = asyncHandler(async (req, res) => {
  const result = await activeUserTypeDetailService();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result },
        "active user type retrieved successfully"
      )
    );
});
