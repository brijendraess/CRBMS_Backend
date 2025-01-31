import path from "path";
import CommitteeType from "../models/CommitteeType.models.js";
import { getAllActiveCommitteeTypeService } from "../services/CommitteeType.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Sequelize } from "sequelize";

export const addCommitteeType = asyncHandler(async (req, res) => {
  const { committeeTypeName } = req.body;
  if (!committeeTypeName) {
    throw new ApiError(400, "CommitteeType name is required");
  }

  const existingCommitteeType = await CommitteeType.findOne({
    where: { name: committeeTypeName },
  });
  if (existingCommitteeType) {
    throw new ApiError(400, "Committee Type with this name already exists");
  }

  const committeeType = await CommitteeType.create({
    name: committeeTypeName,
    status: true,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { committeeType }, "Committee Type added successfully"));
});

export const updateCommitteeType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const committeeType = await CommitteeType.findByPk(id);

  if (!committeeType) {
    throw new ApiError(404, "CommitteeType not found");
  }

  const existingCommitteeType = await CommitteeType.findOne({
    where: { name: name, id: { [Sequelize.Op.ne]: id }, },
  });
  if (existingCommitteeType) {
    throw new ApiError(400, "Committee Type with this name already exists");
  }

  committeeType.name = name || committeeType.name;

  await committeeType.save();

  res
    .status(200)
    .json(new ApiResponse(200, { committeeType }, "Committee Type updated successfully"));
});

export const getAllCommitteeTypes = asyncHandler(async (req, res) => {
  const committeeTypes = await CommitteeType.findAll({
    attributes: [
      "id",
      "name",
      "status",
      "createdAt",
      "updatedAt",
    ],
    order: [["createdAt", "DESC"]],
  });

  // if (!committeeTypes.length) {
  //   throw new ApiError(404, "No committeeTypes found");
  // }

  res
    .status(200)
    .json(
      new ApiResponse(200, { committeeTypes }, "CommitteeTypes retrieved successfully")
    );
});

// Get all active committeeType
export const getAllActiveCommitteeTypes = asyncHandler(async (req, res) => {
  const result = await getAllActiveCommitteeTypeService();
  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "CommitteeTypes retrieved successfully"));
});

export const changeCommitteeTypeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const committeeType = await CommitteeType.findByPk(id);

  if (!committeeType) {
    throw new ApiError(404, "CommitteeType not found");
  }

  committeeType.status = !committeeType.status;
  await committeeType.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { committeeType },
        `CommitteeType status changed to ${committeeType.status ? "active" : "inactive"}`
      )
    );
});

export const deleteCommitteeType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const committeeType = await CommitteeType.findByPk(id);

  if (!committeeType) {
    throw new ApiError(404, "CommitteeType not found");
  }

  await committeeType.destroy(); // Permanent delete (or use soft delete if configured)

  res
    .status(200)
    .json(new ApiResponse(200, null, "CommitteeType deleted successfully"));
});
