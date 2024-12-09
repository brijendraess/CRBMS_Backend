import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/database.js";
import router from "./router.js";
<<<<<<< HEAD
import RoomGallery from "./models/RoomGallery.models.js";
=======
import Location from "./models/Location.model.js";
import RoomAmenityQuantity from "./models/RoomAmenitiesQuantity.models.js";
import Room from "./models/Room.models.js";
import CommitteeMember from "./models/CommitteeMember.models.js";
>>>>>>> dae92396af8155ab1f3c85dbc65506e30e38c2b0

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
    console.log("MONGODB CONNECTION FAILED !!!!", err);
  });

const syncModels = async () => {
  try {
<<<<<<< HEAD
    const abc = RoomGallery;
=======
    const abc = CommitteeMember;
>>>>>>> dae92396af8155ab1f3c85dbc65506e30e38c2b0
    await abc.sync({ alter: true, force: true });
    console.log(abc, "table synced.");
  } catch (error) {
    console.error("Error syncing ", abc, " table:", error);
  }
};
//syncModels();
