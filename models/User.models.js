import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import UserType from "./UserType.model.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    userName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    userDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    avatarPath: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    activities: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
      defaultValue: [],
    },
    lastLoggedIn: {
      type: DataTypes.DATE,
    },
    refreshToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    accessToken: {
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
    isBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    tempOTP: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    zimbraUsername: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zimbraPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }
);

UserType.hasMany(User, {
  foreignKey: {
    name: "user_type", 
    type: DataTypes.UUID, 
  },
  onDelete: "CASCADE",
});
User.belongsTo(UserType, { foreignKey: "user_type" });

export default User;
