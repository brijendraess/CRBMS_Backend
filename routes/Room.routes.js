import express from "express";
import {
  createRoom,
  roomLogin,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  changeSanitationStatus,
  changeStatus,
  addRoomGallery,
  deleteRoomGallery,
  getAllAmenitiesQuantity,
  getAllAmenitiesActiveQuantity,
  createAmenityQuantity,
  deleteAmenityQuantity,
  editAmenityQuantity,
  getSingleRoomController,
  getAllFoodBeverage,
  getAllFoodBeverageActive,
  createFoodBeverage,
  deleteFoodBeverage,
  editFoodBeverage,
  getAllMeeting,
} from "../controllers/room.controller.js";
import uploadRoomImage from "../middlewares/roomMulter.middleware.js";
import multipleGalleryUpload from "../middlewares/galleryRoomMulter.middleware.js";

const roomRouter = express.Router();

roomRouter.route("/amenity-quantity-all/:roomId").get(getAllAmenitiesQuantity);
roomRouter.route("/all-amenity-active-quantity/:roomId").get(getAllAmenitiesActiveQuantity);
roomRouter.route("/add-amenity-quantity").post(createAmenityQuantity);
roomRouter.route("/delete-amenity-quantity/:amenityQuantityId").delete(deleteAmenityQuantity);

roomRouter.route("/food-beverage-all/:roomId").get(getAllFoodBeverage);
roomRouter.route("/all-food-beverage-active/:roomId").get(getAllFoodBeverageActive);
roomRouter.route("/add-food-beverage").post(createFoodBeverage);
roomRouter.route("/delete-food-beverage/:foodBeverageId").delete(deleteFoodBeverage);
roomRouter.route("/all-meeting").get(getAllMeeting);
roomRouter.route("/add-room").post(uploadRoomImage.single("roomImage"), createRoom);
roomRouter.route("/all-rooms").get(getAllRooms);
roomRouter.route("/:roomId").get(getRoomById);

roomRouter.route("/edit-room/:roomId").put(uploadRoomImage.single("roomImage"),updateRoom);
roomRouter.route("/:roomId").delete(deleteRoom);
roomRouter.route("/login").post(roomLogin);
roomRouter.route("/change-sanitation-status").post(changeSanitationStatus);
roomRouter.route("/change-status").post(changeStatus);
roomRouter.route("/add-room-gallery").post(multipleGalleryUpload.array("images", 10), addRoomGallery);
roomRouter.route("/delete-room-gallery/:galleryId").delete(deleteRoomGallery);
roomRouter.route("/single-room-gallery/:roomId").get(getSingleRoomController);

roomRouter.route("/edit-amenity-quantity/:amenityQuantityId").put(editAmenityQuantity);
roomRouter.route("/edit-food-beverage/:foodBeverageId").put(editFoodBeverage);

export default roomRouter;
