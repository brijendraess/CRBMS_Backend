import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import User from "./User.models.js";
import Meeting from "./Meeting.models.js";

const Notification = sequelize.define(
  "notification",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Notification, {
  foreignKey: {
    name: 'userId',  // Foreign key in userId
    type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
  },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  Notification.belongsTo(User, { foreignKey: 'userId' }); 


Meeting.hasMany(Notification, {
  foreignKey: {
    name: 'meetingId',  // Foreign key in meetingId
    type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
  },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  Notification.belongsTo(Meeting, { foreignKey: 'meetingId' });

export default Notification;
