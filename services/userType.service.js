import UserType from "../models/UserType.model.js";
import { ApiError } from "../utils/ApiError.js";

export const singleUserTypeDetailService = async (id) => {
  try {
    if (!id) {
      console.log("Invalid ID provided");
    } else {
      const userType = await UserType.findOne({
        where: { id },
      });
      if (!userType) {
        throw new ApiError(404, "No user type found");
      }
      return userType;
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// Getting all user type

export const allUserTypeDetailService = async () => {
  try {
    const userType = await UserType.findAll();
    if (!userType) {
      throw new ApiError(404, "No user type found");
    }
    return userType;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// Getting all user type

export const activeUserTypeDetailService = async () => {
  try {
    const userType = await UserType.findAll({
      where: {
        status: true,
      },
    });
    if (!userType) {
      throw new ApiError(404, "No user type found");
    }
    return userType;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const deleteUserTypeDetailService = async (id) => {
  try {
    const userType = await UserType.findByPk(id);
    if (!userType) {
      throw new ApiError(404, "user type not found");
    }

    await userType.destroy(); // Permanent delete (or use soft delete if configured)
    return userType;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const changeStatusUserTypeDetailService = async (id) => {
  try {
    const userType = await UserType.findByPk(id);

    if (!userType) {
      throw new ApiError(404, "userType not found");
    }

    userType.status = !userType.status;
    await userType.save();

    return userType;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// Edit the user type
export const editUserTypeDetailService = async (params) => {
  try {
    const {
      userTypeName,
      calendarModule,
      userModule,
      committeeModule,
      committeeTypeModule,
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
      servicesModule,
      isAdmin
    } = params;
    const userType = await UserType.findByPk(userTypeId);

    if (!userType) {
      throw new ApiError(404, "User type not found");
    }

    userType.userTypeName = userTypeName || userType.userTypeName;
    userType.calendarModule = calendarModule;
    userType.userModule = userModule;
    userType.committeeModule = committeeModule;
    userType.committeeTypeModule = committeeTypeModule;
    userType.notificationModule = notificationModule;
    userType.inventoryModule = inventoryModule;
    userType.committeeMemberModule = committeeMemberModule;
    userType.amenitiesModule = amenitiesModule;
    userType.roomModule = roomModule;
    userType.locationModule = locationModule;
    userType.foodBeverageModule = foodBeverageModule;
    userType.meetingLogsModule = meetingLogsModule;
    userType.reportModule = reportModule;
    userType.userRoleModule = userRoleModule;
    userType.servicesModule = servicesModule;
    userType.isAdmin = isAdmin;

    await userType.save();

    return userType;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const addUserTypeService = async (
  userTypeName,
  calendarModule,
  userModule,
  committeeModule,
  committeeTypeModule,
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
  servicesModule
) => {
  try {
    if (!userTypeName) {
      throw new ApiError(400, "Please put user Type");
    }
    const userType = await UserType.create({
      userTypeName,
      calendarModule,
      userModule,
      committeeModule,
      committeeTypeModule,
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
      servicesModule,
    });
    return userType;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
