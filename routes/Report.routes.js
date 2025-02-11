import express from "express";
import {
  getActiveCommitteeCount,
  getAmenityCount,
  getFoodBeverageCount,
  getInactiveCommitteeCount,
  getMeetingCount,
  getMeetingRoomStats,
  getRoomCount,
  getUserCount,
} from "../controllers/report.controller.js";

const router = express.Router();

router.route("/user-count").get(getUserCount);
router.route("/amenity-count").get(getAmenityCount);
router.route("/food-count").get(getFoodBeverageCount);
router.route("/room-count").get(getRoomCount);
router.route("/meeting-count").get(getMeetingCount);
router.route("/active-committee-count").get(getActiveCommitteeCount);
router.route("/inactive-committee-count").get(getInactiveCommitteeCount);
router.route("/stats").get(getMeetingRoomStats);

export default router;
