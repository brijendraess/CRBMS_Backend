import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { outlookController } from "../controllers/outlook.controller.js";

const outlookRouter = express.Router();

outlookRouter.route("/all-response").get(outlookController);


export default outlookRouter;