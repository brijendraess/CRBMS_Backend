import multer from "multer";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";

// Define the storage configuration
const multipleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/room-gallery"; // Define the folder path for uploads

    // Ensure the directory exists or create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Recursively create the directory
     // console.log("Directory created:", dir);
    } 
    cb(null, dir); // Pass the directory path to Multer
  },
  filename: (req, file, cb) => {
    // Use the current timestamp + the file's original extension as the filename
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|heif|heic|dng|tiff|bmp|gif/; // Allowed file types

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Validate extension
  const mimetype = filetypes.test(file.mimetype); // Validate MIME type

  if (mimetype && extname) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new ApiError(400, "Only image files (jpeg, jpg, png, webp) are allowed")
    ); // Reject the file
  }
};

// Create the multer instance with the custom storage and file filter
const multipleGalleryUpload = multer({
  storage: multipleStorage, // Use the corrected key name
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter, // Apply the file filter
});

export default multipleGalleryUpload;
