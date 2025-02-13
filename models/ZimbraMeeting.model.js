import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import User from "./User.models.js";

const ZimbraMeetings = sequelize.define(
  "ZimbraMeetings",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "scheduled",
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "zimbra_meetings",
    timestamps: true,
    paranoid: true,
  }
);

// Define relationships
User.hasMany(ZimbraMeetings, { foreignKey: "userId", onDelete: "CASCADE" });
ZimbraMeetings.belongsTo(User, { foreignKey: "userId" });

export default ZimbraMeetings;
