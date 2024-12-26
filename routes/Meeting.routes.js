import express, { Router } from "express";
import {
  addMeeting,
  changeMeetingStatus,
  deleteMeeting,
  getAllAdminMeetings,
  getAllMeetings,
  getMeetingsById,
  getMyMeetings,
  getTodaysMeetings,
  postponeMeeting,
  updateMeeting,
} from "../controllers/meeting.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/add-meeting").post(verifyJWT, addMeeting);
router.route("/get-all-meeting").get(verifyJWT, getAllMeetings);
router.route("/get-all-admin-meeting").get(verifyJWT, getAllAdminMeetings);
router.route("/get-all-my-meeting").get(verifyJWT, getMyMeetings);
router.route("/todays-meetings").get(getTodaysMeetings); 
router.route("/get-single-meeting/:meetingId").get(verifyJWT, getMeetingsById);
router.route("/update-meeting/:meetingId").put(verifyJWT, updateMeeting);
router.route("/postpone-meeting/:meetingId").put(verifyJWT, postponeMeeting);
router.route("/delete-meeting/:meetingId").put(verifyJWT, deleteMeeting);
router.route("/update-meeting-status/:meetingId").put(verifyJWT, changeMeetingStatus);


export default router;
