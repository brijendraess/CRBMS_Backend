import express from "express";
import {
  addUserToCommittee,
  changeCommitteeStatus,
  createCommittee,
  deleteCommittee,
  getAllActiveCommittees,
  getAllCommittees,
  getCommitteeByUserId,
  getCommitteeDetails,
  getCommitteeMembers,
  isCommitteeAvailable,
  removeUserFromCommittee,
  updateCommittee,
} from "../controllers/committee.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Committee routes
router.route("/committees").post(createCommittee).get(getAllCommittees); // Create and get all committees
router
  .route("/committees/:committeeId")
  .get(getCommitteeDetails) // Get committee details
  .put(updateCommittee) // Update committee
  .delete(deleteCommittee); // Delete committee

// Committee members routes
router
  .route("/committees/:committeeId/members")
  .get(getCommitteeMembers) // Get members of a committee
  .post(addUserToCommittee); // Add a user to a committee

router
  .route("/committees/:committeeId/members/:userId")
  .delete(removeUserFromCommittee); // Remove a user from a committee

router.route("/my-committee").get(verifyJWT, getCommitteeByUserId);
router.route("/active-committee").get(getAllActiveCommittees);
router.route("/isAvailable").post(isCommitteeAvailable);


router.route("/change-status").put(changeCommitteeStatus);

export default router;
