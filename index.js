import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection, sequelize } from "./database/database.js";
import router from "./router.js";
import RoomFoodBeverage from "./models/RoomFoodBeverage.models.js";
import RoomAmenityQuantity from "./models/RoomAmenitiesQuantity.models.js";
import Notification from "./models/Notification.models.js";
import MeetingUser from "./models/MeetingUser.js";
import MeetingCommittee from "./models/MeetingCommittee.js";
import Meeting from "./models/Meeting.models.js";
import User from "./models/User.models.js";
import cron from "node-cron";
import { CronHelper } from "./helpers/cron.helper.js";

const app = express();

dotenv.config({
  path: "env",
});
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost",
  "http://103.117.156.36:85",
  "http://103.117.156.36",
  "http://192.168.50.95:5173",
  "http://192.168.50.95:9000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests with a matching origin or requests without origin (e.g., curl, Postman)
      callback(null, true);
    } else {
      // Reject the request if the origin is not allowed
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true })); // for form-data
app.use(express.json()); // for raw JSON
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("working");
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
});

app.use("/avatars", express.static("public/avatars"));
app.use("/location", express.static("public/location"));
app.use("/room-images", express.static("public/room-images"));
app.use("/room-gallery", express.static("public/room-gallery"));

// API ROUTES

app.use(router);

const PORT = process.env.PORT || 9000;

dbConnection()
  .then(() => {
    app.listen(PORT,'0.0.0.0',() => {
      console.log(`Server Running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DATABASE CONNECTION FAILED !!!!", err);
  });


cron.schedule('*/5 * * * *', async () => {
  await CronHelper.sendSmsAndEmailBefore30Min();
})

cron.schedule('*/5 * * * *', async () => {
  await CronHelper.sendSmsAndEmailAfterCompletion();
})

// cron.schedule('*/30 * * * *', async () => {
//   await CronHelper.eFileCronData();
// })

const syncModels = async () => {
  let syncTable;
  try {
    const syncTable = User;
    await syncTable.sync({ alter: true, force: true });
    console.log(syncTable, "table synced.");
  } catch (error) {
    console.error("Error syncing ", syncTable, " table:", error);
  }
};
// syncModels();

// Sync all tables

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connected successfully.");

//     await sequelize.sync({ force: true }); // Change to `true` to drop and recreate tables
//     console.log("All models were synchronized successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database or sync models:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();
