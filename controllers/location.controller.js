import path from "path";
import Location from "../models/Location.model.js";
import { getAllActiveLocationService } from "../services/Location.services.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Sequelize } from "sequelize";

export const addLocation = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Location name is required");
  }

  const existingLocation = await Location.findOne({
    where: { locationName: name },
  });
  if (existingLocation) {
    throw new ApiError(400, "Location with this name already exists");
  }
  let locationImagePath = null;
  if (req.file) {
    locationImagePath = `location/${name.replace(/\s+/g, "_")}${path
      .extname(req.file.originalname)
      .toLowerCase()}`;
  }

  const location = await Location.create({
    locationName: name,
    locationImagePath,
    status: true,
  });

  if (!location) {
    if (req.file) fs.unlinkSync(`public/${locationImagePath}`); // Remove image if room creation fails
    throw new ApiError(500, "Failed to create Location");
  }

  res
    .status(201)
    .json(new ApiResponse(201, { location }, "Location added successfully"));
});

export const updateLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const location = await Location.findByPk(id);

  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  const existingLocation = await Location.findOne({
    where: { locationName: name, id: { [Sequelize.Op.ne]: id }, },
  });
  if (existingLocation) {
    throw new ApiError(400, "Location with this name already exists");
  }
  let locationImagePath = null;
  if (req.file) {
    locationImagePath = `location/${name.replace(/\s+/g, "_")}${path
      .extname(req.file.originalname)
      .toLowerCase()}`;
  }

  location.locationName = name || location.locationName;
  location.locationImagePath = locationImagePath || location.locationImagePath;

  await location.save();

  res
    .status(200)
    .json(new ApiResponse(200, { location }, "Location updated successfully"));
});

export const getAllLocations = asyncHandler(async (req, res) => {
  const locations = await Location.findAll({
    attributes: [
      "id",
      "locationName",
      "status",
      "createdAt",
      "updatedAt",
      "locationImagePath",
    ],
    order: [["createdAt", "DESC"]],
  });

  // if (!locations.length) {
  //   throw new ApiError(404, "No locations found");
  // }

  res
    .status(200)
    .json(
      new ApiResponse(200, { locations }, "Locations retrieved successfully")
    );
});

// Get all active location
export const getAllActiveLocations = asyncHandler(async (req, res) => {
  const result = await getAllActiveLocationService();
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "Locations retrieved successfully"));
});

export const changeLocationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const location = await Location.findByPk(id);

  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  location.status = !location.status;
  await location.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { location },
        `Location status changed to ${location.status ? "active" : "inactive"}`
      )
    );
});

export const deleteLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const location = await Location.findByPk(id);

  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  await location.destroy(); // Permanent delete (or use soft delete if configured)

  res
    .status(200)
    .json(new ApiResponse(200, null, "Location deleted successfully"));
});
