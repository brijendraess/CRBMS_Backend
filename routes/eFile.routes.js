import express from "express";
import { eFileController } from "../controllers/eFile.comtroller.js";

const eFileRouter = express.Router();

eFileRouter.route("/user-list").get(eFileController);

export default eFileRouter;