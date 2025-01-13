import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import User from "./User.models.js";

const UserType = sequelize.define(
  "UserType",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userTypeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    calendarModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    committeeModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    committeeMemberModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    amenitiesModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    roomModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    locationModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    foodBeverageModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reportModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    meetingLogsModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userRoleModule: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAdmin: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    createdBy: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
    },
    updatedBy: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "user_type",
    timestamps: true,
  }
);

export default UserType;
