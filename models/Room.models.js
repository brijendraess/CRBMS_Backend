import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import Location from "./Location.model.js";
import Services from "./Services.models.js";

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tolerancePeriod: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sanitationPeriod: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sanitationStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    roomImagePath: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "rooms",
    timestamps: true,
    paranoid: true,
  }
);

Location.hasOne(Room, {
  foreignKey: {
    name: "location", // Foreign key in RoomAmenityQuantity
    type: DataTypes.UUID, // Ensure it's UUID if Room has UUID primary key
  },
  onDelete: "CASCADE",
});
Room.belongsTo(Location, { foreignKey: "location" });

Services.hasOne(Room, {
  foreignKey: {
    name: "services", // Foreign key in RoomAmenityQuantity
    type: DataTypes.UUID, // Ensure it's UUID if Room has UUID primary key
  },
  onDelete: "CASCADE",
});
Room.belongsTo(Services, { foreignKey: "services" });

export default Room;
