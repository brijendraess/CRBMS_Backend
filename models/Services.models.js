import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const Services = sequelize.define(
  "Services",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    servicesName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "services",
    timestamps: true,
  }
);

export default Services;
