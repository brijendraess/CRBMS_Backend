import express from "express";
import {
  addCommitteeType,
  changeCommitteeTypeStatus,
  deleteCommitteeType,
  getAllActiveCommitteeTypes,
  getAllCommitteeTypes,
  updateCommitteeType,
} from "../controllers/committeeType.controller.js";

const committeeTypeRouter = express.Router();

committeeTypeRouter.route("/committeeTypes").post(addCommitteeType);
committeeTypeRouter.route("/committeeTypes").get(getAllCommitteeTypes);
committeeTypeRouter
  .route("/activeCommitteeTypes")
  .get(getAllActiveCommitteeTypes);
committeeTypeRouter
  .route("/committeeTypes/:id")
  .put(updateCommitteeType);
committeeTypeRouter
  .route("/committeeTypes/:id/status")
  .patch(changeCommitteeTypeStatus);
committeeTypeRouter
  .route("/committeeTypes/delete/:id")
  .delete(deleteCommitteeType);

export default committeeTypeRouter;
