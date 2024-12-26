import express from "express";
import {
  addLocation,
  changeLocationStatus,
  deleteLocation,
  getAllActiveLocations,
  getAllLocations,
  updateLocation,
} from "../controllers/location.controller.js";
import locationImage from "../middlewares/locationMulter.middleware.js";

const locationRouter = express.Router();

locationRouter
  .route("/locations")
  .post(locationImage.single("locationImage"), addLocation);
locationRouter.route("/locations").get(getAllLocations);
locationRouter.route("/activeLocations").get(getAllActiveLocations);
locationRouter
  .route("/locations/:id")
  .put(locationImage.single("locationImage"), updateLocation);
locationRouter.route("/locations/:id/status").patch(changeLocationStatus);
locationRouter.route("/locations/delete/:id").delete(deleteLocation);

export default locationRouter;
