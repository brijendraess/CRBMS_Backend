import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { allStock,plusStock, addStock, checkStock, stockHistory } from "../controllers/stock.controller.js";

const stockRouter = Router();

stockRouter.route("/all").get(verifyJWT, allStock);
stockRouter.route("/stock-history").get(verifyJWT, stockHistory);
stockRouter.route("/add").post(verifyJWT, addStock);
stockRouter.route("/increment").post(verifyJWT, plusStock);
stockRouter.route("/checkStock/:amenityId").get(verifyJWT, checkStock);


export default stockRouter;