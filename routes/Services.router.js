import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  activeServices,
  addServices,
  allServices,
  changeStatusServices,
  deleteServices,
  editServices,
  singleServices,
} from "../controllers/services.controller.js";

const servicesRouter = Router();

servicesRouter.route("/get-single/:id").get(verifyJWT, singleServices);
servicesRouter.route("/add-services").post(verifyJWT, addServices);
servicesRouter.route("/all").get(verifyJWT, allServices);
servicesRouter.route("/active").get(verifyJWT, activeServices);
servicesRouter.route("/edit/:id").put(verifyJWT, editServices);
servicesRouter.route("/delete/:id").delete(verifyJWT, deleteServices);
servicesRouter
  .route("/changeStatus/:id")
  .patch(verifyJWT, changeStatusServices);

export default servicesRouter;
