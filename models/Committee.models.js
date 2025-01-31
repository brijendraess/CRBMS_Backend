import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import CommitteeType from "./CommitteeType.models.js";
import User from "./User.models.js";

const Committee = sequelize.define(
  "Committee",
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
    tableName: "committees",
    timestamps: true,
    paranoid: true,
  }
);

CommitteeType.hasMany(Committee, {
  foreignKey: {
    name: 'committeeTypeId',  // Foreign key in RoomAmenityQuantity
    type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
  },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  Committee.belongsTo(CommitteeType, { foreignKey: 'committeeTypeId' });

  User.hasMany(Committee, {
    foreignKey: {
      name: 'chairPersonId',  // Foreign key in RoomAmenityQuantity
      type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
    },
      onDelete: 'CASCADE' // Optional: What happens when a User is deleted
    });
  
    Committee.belongsTo(User, { foreignKey: 'chairPersonId' });

export default Committee;
