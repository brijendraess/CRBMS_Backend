import express from "express";
import {
  addFoodBeverage,
  changeFoodBeverageStatus,
  deleteFoodBeverage,
  getAllActiveFoodBeverages,
  getAllFoodBeverages,
  updateFoodBeverage,
} from "../controllers/foodBeverages.controller.js";

const foodBeverageRouter = express.Router();

foodBeverageRouter.route("/food-beverage").post(addFoodBeverage);
foodBeverageRouter.route("/food-beverage").get(getAllFoodBeverages);
foodBeverageRouter.route("/active-food-beverage").get(getAllActiveFoodBeverages);
foodBeverageRouter.route("/food-beverage/:id").put(updateFoodBeverage);
foodBeverageRouter.route("/food-beverage/:id/status").patch(changeFoodBeverageStatus);
foodBeverageRouter.route("/food-beverage/delete/:id").delete(deleteFoodBeverage);

export default foodBeverageRouter;
