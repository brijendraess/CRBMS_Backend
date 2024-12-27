import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { autoMeetingCron, meetingNotificationBeforeFifteenMinCron, sendEmailToOrganizerToExtendMeetingCron } from "../controllers/cronJob.controller.js";

const cronRouter = express.Router();

cronRouter.route("/auto-meeting-cron-after-fifteen-min-cron").get(verifyJWT, autoMeetingCron);
cronRouter.route("/meeting-notification-before-fifteen-min-cron").get(verifyJWT, meetingNotificationBeforeFifteenMinCron);
cronRouter.route("/send-email-to-organizer-to-extend-meeting-cron").get(verifyJWT, sendEmailToOrganizerToExtendMeetingCron);

export default cronRouter;