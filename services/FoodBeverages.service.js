import FoodBeverage from "../models/FoodBeverage.model.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllActiveFoodBeverageService = async () => {
    try {
        const foodBeverages = await FoodBeverage.findAll({
            attributes: ["id", "foodBeverageName", "status", "createdAt", "updatedAt"],
            order: [["createdAt", "DESC"]],
            where: { status: true },
          });
        
          if (!foodBeverages.length) {
            throw new ApiError(404, "No foodBeverages found");
          }
          return foodBeverages
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}