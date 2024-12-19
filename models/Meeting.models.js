import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import Room from "./Room.models.js";
import User from "./User.models.js";
import MeetingUser from "./MeetingUser.js";
import Location from "./Location.model.js";
import Committee from "./Committee.models.js";
import MeetingCommittee from "./MeetingCommittee.js";

const Meeting = sequelize.define(
  "Meeting",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    agenda: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    guestUser: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    additionalEquipment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    meetingDate: {
      type: DataTypes.DATEONLY, // Only stores the date (e.g., 2024-11-17)
      allowNull: false,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Public by default
    },

    status: {
      type: DataTypes.ENUM("scheduled", "ongoing", "completed", "cancelled"),
      defaultValue: "scheduled", // Default to scheduled
    },
  },
  {
    tableName: "meetings",
    timestamps: true, // Adds createdAt and updatedAt
    paranoid: true, // Enables soft delete with deletedAt field
  }
);

Room.hasMany(Meeting, {
  foreignKey: {
    name: 'roomId',  // Foreign key in userId
    type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
  },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

Meeting.belongsTo(Room, { foreignKey: 'roomId' });


User.hasMany(Meeting, {
  foreignKey: {
    name: 'organizerId',  // Foreign key in organizerId
    type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
  },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

Meeting.belongsTo(User, { foreignKey: 'organizerId' });

Meeting.belongsToMany(User, { through: MeetingUser });
User.belongsToMany(Meeting, { through: MeetingUser });

Meeting.belongsToMany(Committee, { through: MeetingCommittee });
Committee.belongsToMany(Meeting, { through: MeetingCommittee });

export default Meeting;
