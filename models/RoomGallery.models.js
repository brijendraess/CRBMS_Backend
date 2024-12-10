import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import Room from "./Room.models.js";
import User from "./User.models.js";

const RoomGallery = sequelize.define(
  "RoomGallery",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
     imageName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "room_gallery",
    timestamps: true,
  }
);

Room.hasMany(RoomGallery, {
  foreignKey: {
    name: 'roomId',  // Foreign key in RoomAmenityQuantity
    type: DataTypes.UUID,  // Ensure it's UUID if RoomAmenity has UUID primary key
  },
  onDelete: 'CASCADE' // Optional: What happens when a User is deleted
});

RoomGallery.belongsTo(Room, { foreignKey: 'roomId' });

  User.hasMany(RoomGallery, {
    foreignKey: {
      name: 'createdBy',  // Foreign key in RoomGallery
      type: DataTypes.UUID,  // Ensure it's UUID if User has UUID primary key
    },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  RoomGallery.belongsTo(User, { foreignKey: 'createdBy' });

  User.hasMany(RoomGallery, {
    foreignKey: {
      name: 'updatedBy',  // Foreign key in RoomGallery
      type: DataTypes.UUID,  // Ensure it's UUID if User has UUID primary key
    },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  RoomGallery.belongsTo(User, { foreignKey: 'updatedBy' });

  User.hasMany(RoomGallery, {
    foreignKey: {
      name: 'deletedBy',  // Foreign key in RoomGallery
      type: DataTypes.UUID,  // Ensure it's UUID if User has UUID primary key
    },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  RoomGallery.belongsTo(User, { foreignKey: 'deletedBy' });

export default RoomGallery;

