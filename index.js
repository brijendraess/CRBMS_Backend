import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection, sequelize } from "./database/database.js";
import router from "./router.js";
import RoomFoodBeverage from "./models/RoomFoodBeverage.models.js";
import RoomAmenityQuantity from "./models/RoomAmenitiesQuantity.models.js";

const app = express();

dotenv.config({
  path: "env",
});

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
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
app.use("/room-images", express.static("public/room-images"));
app.use("/room-gallery", express.static("public/room-gallery"));

// API ROUTES

app.use(router);

const PORT = process.env.PORT || 9000;

dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DATABASE CONNECTION FAILED !!!!", err);
  });

const syncModels = async () => {
  try {
    const roomModel = RoomAmenityQuantity;
    await roomModel.sync({ alter: true, force: true });
    console.log(roomModel, "table synced.");
  } catch (error) {
    console.error("Error syncing ", roomModel, " table:", error);
  }
};
//syncModels();

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
