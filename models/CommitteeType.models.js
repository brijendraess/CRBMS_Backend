import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const CommitteeType = sequelize.define(
  "CommitteeType",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "committees-type",
    timestamps: true,
    paranoid: true,
  }
);


export default CommitteeType;
