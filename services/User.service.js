import User from "../models/User.models.js";
import UserType from "../models/UserType.model.js";

export const getUserByIdService = async (
    organizerId
  ) => {
    try {
      const user = await User.findAll( {
        where:{
          id:organizerId
        },
      });
  
      return user;
    } catch (error) {
      console.log("error", error);
      throw error;
    } 
  };

  export const getAllAdminUser = async () => {
    try {
      const user = await User.findAll( {
       include:[
        {
          model:UserType,
          where:{
            isAdmin:'admin'
          }

        }
       ]
      });
  
      return user;
    } catch (error) {
      console.log("error", error);
      throw error;
    } 
  };
  
  