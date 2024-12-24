import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import User from "./User.models.js";
import Meeting from "./Meeting.models.js";

const Notification = sequelize.define(
  "Notification",
  {
    notificationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    meetingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Meeting,
        key: "id",
      },
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

export default Notification;
