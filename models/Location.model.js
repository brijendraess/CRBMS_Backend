import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const Location = sequelize.define(
  "Location",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    locationName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    locationImagePath: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "location",
    timestamps: true,
    paranoid: true,
  }
);

export default Location;
