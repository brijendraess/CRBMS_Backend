import Committee from "../models/Committee.models.js";
import CommitteeMember from "../models/CommitteeMember.models.js";
import User from "../models/User.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sequelize } from "../database/database.js";
import { Op, QueryTypes, Sequelize } from "sequelize";
import CommitteeType from "../models/CommitteeType.models.js";

export const createCommittee = asyncHandler(async (req, res) => {
  const { name,committeeType,chairperson, description, createdByUserId } = req.body;

  if (!name) {
    throw new ApiError(400, "Committee name is required");
  }

  const existingCommittee = await Committee.findOne({
    where: {
      name,
      deletedAt: null,
    },
  });

  if (existingCommittee) {
    throw new ApiError(400, "Committee with this name already exists");
  }

  const committee = await Committee.create({
    name,
    committeeTypeId:committeeType,
    chairPersonId:chairperson,
    description,
    // createdBy: createdByUserId,
    status: true,
  });

  if (!committee) {
    throw new ApiError(500, "Failed to create committee");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, { committee }, "Committee created successfully")
    );
});

export const updateCommittee = asyncHandler(async (req, res) => {
  const { committeeId } = req.params;
  const { name, committeeType,chairperson, description } = req.body;

  const committee = await Committee.findOne({
    where: {
      id: committeeId,
      deletedAt: null,
    },
  });

  if (!committee) {
    throw new ApiError(404, "Committee not found");
  }
  if (name && name !== committee.name) {
    const existingCommittee = await Committee.findOne({
      where: {
        name,
        deletedAt: null,
        id: { [Op.ne]: committeeId },
      },
    });

    if (existingCommittee) {
      throw new ApiError(400, "Committee with this name already exists");
    }
  }

  committee.name = name || committee.name;
  committee.committeeTypeId = committeeType || committee.committeeTypeId;
  committee.chairPersonId = chairperson || committee.chairPersonId;
  committee.description = description || committee.description;

  //committee.updatedBy = req.user.id;
  committee.updatedAt = new Date();

  await committee.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { committee }, "Committee updated successfully")
    );
});

export const changeCommitteeStatus = asyncHandler(async (req, res) => {
  const { committeeId, status } = req.body;
  const committee = await Committee.findOne({
    where: {
      id: committeeId,
      deletedAt: null,
    },
  });

  if (!committee) {
    throw new ApiError(404, "Committee not found");
  }

  committee.status = status !== undefined ? status : committee.status;

  await committee.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { committee }, "Committee updated successfully")
    );
});

export const addUserToCommittee = asyncHandler(async (req, res) => {
  const { committeeId, userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new ApiError(400, "User IDs are required and should be an array");
  }

  // Validate if the committee exists
  const committee = await Committee.findOne({
    where: {
      id: committeeId,
      deletedAt: null,
    },
  });

  if (!committee) {
    throw new ApiError(404, "Committee not found");
  }

  // Results and errors arrays
  const results = [];
  const errors = [];

  // Iterate over userIds
  for (const userId of userIds) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        errors.push({ userId, message: "User not found" });
        continue;
      }

      // Check if the user is already a member of the committee
      const existingMember = await CommitteeMember.findOne({
        where: {
          committeeId,
          userId,
        },
      });

      if (existingMember) {
        errors.push({
          userId,
          message: "User is already a member of this committee",
        });
        continue;
      }

      // Add the user to the committee
      const committeeMember = await CommitteeMember.create({
        committeeId,
        userId,
        status: false, // Default status
      });

      results.push(committeeMember);
    } catch (error) {
      console.error(`Error processing user ID ${userId}:`, error);
      errors.push({ userId, message: "An unexpected error occurred" });
    }
  }

  // Return response
  if (results.length > 0) {
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          addedMembers: results,
          errors, // Include errors for any failed user additions
        },
        "Users processed successfully"
      )
    );
  } else {
    throw new ApiError(400, "No users were added to the committee");
  }
});

export const removeUserFromCommittee = asyncHandler(async (req, res) => {
  const { committeeId, userId } = req.params;
  const committeeMember = await CommitteeMember.findOne({
    where: {
      committeeId,
    },
  });

  if (!committeeMember) {
    throw new ApiError(404, "User is not a member of this committee");
  }

  // Permanently delete the committee member
  await committeeMember.destroy();

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "User removed from committee successfully")
    );
});

// Delete committee (soft delete)
export const deleteCommittee = asyncHandler(async (req, res) => {
  const { committeeId } = req.params;

  // Find the committee by ID
  const committee = await Committee.findOne({
    where: {
      id: committeeId,
    },
  });

  if (!committee) {
    throw new ApiError(404, "Committee not found");
  }

  const users = await User.findAll({
    include: {
      model: CommitteeMember,
      where: { committeeId }, // Filter CommitteeMember by committeeId
    },
  });

  if(users.length >  0){
    throw new ApiError(404, "Committee already assigned to few users.");
  }

  await CommitteeMember.destroy({
    where: {
      id: committeeId,
    },
    force: true,
  });

  await committee.destroy({ force: true });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Committee and its members deleted successfully"
      )
    );
});


export const getCommitteeMembers = asyncHandler(async (req, res) => {
  const { committeeId } = req.params;

  try {
    // Verify if the committee exists and is not soft-deleted
    const committee = await Committee.findAll({
      where: {
        id: committeeId,
      },
    });

    if (!committee) {
      throw new ApiError(404, "Committee not found");
    }

    const members = await CommitteeMember.findAll({
      where: { committeeId: committeeId },
      include: [
        {
          model: User,
          attributes: ["id", "email", "fullname", "phoneNumber", "avatarPath"],
        },
        {
          model: Committee,
        },
      ],
    });

    const filteredMembers = members.filter((member) => member.User != null)

    if (!members.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, { members: [] }, "No active members found"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { members: filteredMembers },
          "Committee members retrieved successfully"
        )
      );
  } catch (error) {
    console.error("Error retrieving committee members:", error);
    throw error;
  }
});

export const getAllCommittees = asyncHandler(async (req, res) => {
  // Fetch committees with their member details
  const committees = await Committee.findAll({
    include: [
      {
        model: CommitteeMember,
        include: [
          {
            model: User,
            attributes: [
              "id",
              "email",
              "fullname",
              "phoneNumber",
              "avatarPath",
            ],
          },
        ],
      },
      {
        model:CommitteeType,
      },
      {
        model:User,
      }
    ],
  });

  const filteredCommittees = committees.map(committee => {
    // Convert Sequelize instance to plain object
    const plainCommittee = committee.toJSON();

    // Filter out CommitteeMembers with User === null
    plainCommittee.CommitteeMembers = plainCommittee.CommitteeMembers.filter(member => member.User !== null);

    return plainCommittee;
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { committees: filteredCommittees },
        "Committees with members retrieved successfully"
      )
    );
});

export const getAllActiveCommittees = asyncHandler(async (req, res) => {
  // Fetch committees with their member details
  const committees = await Committee.findAll({
    where: {
      status: true,
    },
    include: [
      {
        model: CommitteeMember,
        include: [
          {
            model: User,
            attributes: [
              "id",
              "email",
              "fullname",
              "phoneNumber",
              "avatarPath",
            ],
          },
        ],
      },
    ],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { committees },
        "Committees with members retrieved successfully"
      )
    );
});

// Get committee details
export const getCommitteeDetails = asyncHandler(async (req, res) => {
  const { committeeId } = req.params;
  const committee = await Committee.findOne({
    where: {
      id: committeeId,
    },
  });

  if (!committee) {
    throw new ApiError(404, "Committee not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { committee },
        "Committee details retrieved successfully"
      )
    );
});

// Update committee member role
export const updateCommitteeMemberRole = asyncHandler(async (req, res) => {
  const { committeeId, userId } = req.params;
  const { role } = req.body;

  if (!role) {
    throw new ApiError(400, "Role is required");
  }

  const committeeMember = await CommitteeMember.findOne({
    where: {
      committeeId,
      userId,
      status: "active",
    },
  });

  if (!committeeMember) {
    throw new ApiError(404, "Committee member not found");
  }

  committeeMember.role = role;
  committeeMember.updatedAt = new Date();
  await committeeMember.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { committeeMember },
        "Committee member role updated successfully"
      )
    );
});

export const getCommitteeByUserId = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Fetch committees associated with the user
  const userCommittees = await CommitteeMember.findAll({
    where: { userId },
    include: [
      {
        model: Committee,
        attributes: ["id", "name", "description"], // Include relevant committee fields
      },
    ],
  });

  if (!userCommittees.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No committees found for the user"));
  }

  // Build the data structure with counts
  const dataUserCommittees = await Promise.all(
    userCommittees.map(async (committeeMember) => {
      const committee = committeeMember.Committee;
      const memberCount = await CommitteeMember.count({
        where: { committeeId: committee.id },
      });

      return {
        committeeId: committee.id,
        committeeName: committee.name,
        description: committee.description,
        memberCount,
      };
    })
  );
  // Respond with aggregated data
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { committees: dataUserCommittees },
        "Committees with members retrieved successfully for the user"
      )
    );
});
