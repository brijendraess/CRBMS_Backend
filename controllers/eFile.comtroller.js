import User from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";

export const eFileController = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const response = await axios.get(
    `${process.env.EFILE_ACCESS_URL}/api/v1/user-list`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    { withCredentials: true }
  );
  response?.data?.userList?.map(async (data) => {
    const existingUser = await User.findAndCountAll({
      where: { userName: data?.username },
    });
   
    if (existingUser?.count === 0) {
      await User.create({
        email: data?.email,
        password: data?.password,
        userName: data?.username,
        fullname: data?.fname,
        phoneNumber: data?.mobile,
        avatarPath: data?.profile_image,
      });
    }
  });
  res.status(200).json({
    success: true,
    message: "User list executed successfully!!",
    data: response?.data?.userList,
  });
});
