import { Router } from "express";
import {
  createRoomAmenity,
  deleteRoomAmenity,
  getAllActiveRoomAmenities,
  getAllRoomAmenities,
  getSingleRoomAmenityController,
  updateRoomAmenity,
  updateRoomAmenityQuantity,
} from "../controllers/amenity.controller.js";

const router = Router();

router.route("/add-amenity").post(createRoomAmenity);
router.route("/get-all-active-amenities").get(getAllActiveRoomAmenities);
router.route("/get-all-amenities").get(getAllRoomAmenities);
router.route("/get-single-amenity/:amenityId").get(getSingleRoomAmenityController);
router.route("/update-amenity").put(updateRoomAmenity);
router.route("/update-room-amenity-quantity").put(updateRoomAmenityQuantity);
router.route("/delete/:id").delete(deleteRoomAmenity);
export default router;
