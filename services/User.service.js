import User from "../models/User.models.js";

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
  