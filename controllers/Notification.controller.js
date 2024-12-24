import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Notification from "../models/Notification.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/User.models.js";
import Meeting from "../models/Meeting.models.js";
import Location from "../models/Location.model.js";
import Room from "../models/Room.models.js";

export const limitedNotificationController = asyncHandler(async (req, res) => {

  const userId=req.user.id

  const notification = await Notification.findAll({
    where:{
      userId:userId
    },
    order:[
      ['createdAt', 'Desc'],
    ],
   include:[
    {
      model:User,
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'], 
      },
    },
    
    {
      model:Meeting,
      include:[
        {
          model:Room,
          include:[
            {
              model:Location
            }
          ]
        },
      ]
    },
    
  ]
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  res.status(200).json({
    success: true,
    message: "Retrieve all notification",
    notification,
  });
});
export const allNotificationController = asyncHandler(async (req, res) => {

  const userId=req.user.id

  const notification = await Notification.findAll({
    where:{
      userId:userId
    },
    order:[
      ['isRead', 'ASC'],
    ],
    include:[
      {
        model:User,
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'], 
        },
      },
      
      {
        model:Meeting,
        include:[
          {
            model:Room,
            include:[
              {
                model:Location
              }
            ]
          },
        ]
      },
      
    ]
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.status(200).json({
    success: true,
    message: "Retrieve all notification",
    data: notification,
  });
});

export const changeReadNotificationController = asyncHandler(async (req, res) => {

    const { id } = req.params;
    
    const notification = await Notification.findByPk(id);
  
    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }
    notification.isRead = !notification.isRead;
    await notification.save();
  
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { notification },
          `Location status changed to ${notification.status ? "active" : "inactive"}`
        )
      );
  });
  
  export const deleteNotificationController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await Notification.findOne({
      where:{
        id
      }
    });
    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }
    await notification.destroy(); // Permanent delete (or use soft delete if configured)
  
    res
      .status(200)
      .json(new ApiResponse(200, notification, "Notification deleted successfully"));
  });

  export const deleteAllNotificationController = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const location = await Location.findByPk(id);
  
    if (!location) {
      throw new ApiError(404, "Location not found");
    }
  
    await location.destroy(); // Permanent delete (or use soft delete if configured)
  
    res
      .status(200)
      .json(new ApiResponse(200, null, "Location deleted successfully"));
  });