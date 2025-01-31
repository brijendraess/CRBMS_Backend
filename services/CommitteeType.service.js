import CommitteeType from "../models/CommitteeType.models.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllActiveCommitteeTypeService = async () => {
  try {
    const committeeTypes = await CommitteeType.findAll({
      attributes: [
        "id",
        "name",
        "status",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
      where: { status: true },
    });
    if (!committeeTypes.length) {
      throw new ApiError(404, "No committeeTypes found");
    }
    return committeeTypes;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
