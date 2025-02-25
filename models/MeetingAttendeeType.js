import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import Meeting from "./Meeting.models.js";
import UserType from "./UserType.model.js";

const MeetingAttendeeType = sequelize.define(
  "MeetingAttendeeType", // Model name should be in PascalCase
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    meetingId: {
      type: DataTypes.UUID,
      allowNull: false, // Ensures it's always linked to a meeting
      references: {
        model: Meeting,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userTypeId: {
      type: DataTypes.UUID,
      allowNull: false, // Ensures it's always linked to a user type
      references: {
        model: UserType,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "meeting_attendee_type", // Use plural table name for convention
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["meetingId", "userTypeId"], // Ensures no duplicate entries
      },
    ],
  }
);

// Define Many-to-Many Relationship
Meeting.belongsToMany(UserType, {
  through: MeetingAttendeeType,
  foreignKey: "meetingId",
  otherKey: "userTypeId",
});

UserType.belongsToMany(Meeting, {
  through: MeetingAttendeeType,
  foreignKey: "userTypeId",
  otherKey: "meetingId",
});

export default MeetingAttendeeType;
