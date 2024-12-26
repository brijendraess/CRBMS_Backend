import multer from "multer";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";

const locationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/location";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const { name } = req.body;
    const fileExt = path.extname(file.originalname).toLowerCase();
    const newFileName = `${name.replace(/\s+/g, "_")}${fileExt}`;
    cb(null, newFileName);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|heif|heic|dng|tiff|bmp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new ApiError(400, "Only image files (jpeg, jpg, png, webp) are allowed")
    );
  }
};

const locationImage = multer({
  storage: locationStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: fileFilter,
});

export default locationImage;
