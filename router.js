import { Router } from "express";

import userRoutes from "./routes/User.routes.js";
import amenityRoutes from "./routes/RoomAmenity.routes.js";
import committeeRoutes from "./routes/Committee.routes.js";
import meetingRoutes from "./routes/Meeting.routes.js";
import locationRouter from "./routes/Location.routes.js";
import foodBeverageRouter from "./routes/FoodBeverages.routes.js";
import reportRouter from "./routes/Report.routes.js";
import roomRouter from './routes/Room.routes.js';
import notificationRouter from './routes/Notification.routes.js';
import cronRouter from "./routes/cron.routes.js";
import eFileRouter from "./routes/eFile.routes.js";
import userTypeRouter from "./routes/UserType.routes.js";
import servicesRouter from "./routes/Services.router.js";
import stockRouter from "./routes/stock.routes.js";

const router = Router();

router.use("/api/v1/user", userRoutes);
router.use("/api/v1/rooms", roomRouter);
router.use("/api/v1/amenity", amenityRoutes);
router.use("/api/v1/committee", committeeRoutes);
router.use("/api/v1/meeting", meetingRoutes);
router.use("/api/v1/location", locationRouter);
router.use("/api/v1/food-beverages", foodBeverageRouter);
router.use("/api/v1/report", reportRouter);
router.use("/api/v1/notification", notificationRouter);
router.use("/api/v1/cron", cronRouter);
router.use("/api/v1/e-file", eFileRouter);
router.use("/api/v1/user-type", userTypeRouter);
router.use("/api/v1/services", servicesRouter);
router.use("/api/v1/stock", stockRouter);

export default router;
