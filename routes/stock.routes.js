import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { allStock,plusStock, addStock, checkStock, stockHistory, allPendingAmenities, allPendingFoodBeverage, changeStatusPendingAmenities, allPendingAmenitiesCount, changeStatusPendingFoodBeverage, allPendingFoodBeverageCount } from "../controllers/stock.controller.js";
import { allPendingFoodBeverageCountService, changeStatusPendingFoodBeverageService } from "../services/stock.service.js";

const stockRouter = Router();

stockRouter.route("/all").get(verifyJWT, allStock);

stockRouter.route("/pending-amenities").get(verifyJWT, allPendingAmenities);
stockRouter.route("/pending-amenities-count").get(verifyJWT, allPendingAmenitiesCount);
stockRouter.route("/pending-amenities-changeStatus/:id").patch(verifyJWT, changeStatusPendingAmenities);

stockRouter.route("/pending-food-beverage").get(verifyJWT, allPendingFoodBeverage);
stockRouter.route("/pending-food-beverage-count").get(verifyJWT, allPendingFoodBeverageCount);
stockRouter.route("/pending-food-beverage-changeStatus/:id").patch(verifyJWT, changeStatusPendingFoodBeverage);

stockRouter.route("/stock-history").get(verifyJWT, stockHistory);
stockRouter.route("/add").post(verifyJWT, addStock);
stockRouter.route("/increment").post(verifyJWT, plusStock);
stockRouter.route("/checkStock/:amenityId").get(verifyJWT, checkStock);


export default stockRouter;