import RoomAmenity from "../models/RoomAmenity.model.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllActiveAmenityService = async () => {
    try {
        const roomAmenities = await RoomAmenity.findAll({
            order: [["createdAt", "DESC"]],
            where: { status: true },
        });
        
        
          return roomAmenities
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}