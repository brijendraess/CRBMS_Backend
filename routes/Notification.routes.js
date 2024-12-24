import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { allNotificationController, changeReadNotificationController, deleteAllNotificationController, deleteNotificationController, limitedNotificationController } from "../controllers/Notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.route("/all-notification").get(verifyJWT, allNotificationController);
notificationRouter.route("/limited-notification").get(verifyJWT, limitedNotificationController);
notificationRouter.route("/change-read-status-notification/:id").put(verifyJWT, changeReadNotificationController);
notificationRouter.route("/delete-single-notification/:id").delete(verifyJWT, deleteNotificationController);
notificationRouter.route("/delete-all-notification").put(verifyJWT, deleteAllNotificationController);

export default notificationRouter;
