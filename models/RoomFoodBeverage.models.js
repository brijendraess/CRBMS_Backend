import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import Room from "./Room.models.js";
import User from "./User.models.js";
import FoodBeverage from "./FoodBeverage.model.js";

const RoomFoodBeverage = sequelize.define(
  "RoomFoodBeverage",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "room_food_beverage",
    timestamps: true,
  }
);

Room.hasMany(RoomFoodBeverage, {
  foreignKey: {
    name: 'roomId',  // Foreign key in RoomFoodBeverage
    type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
  },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

RoomFoodBeverage.belongsTo(Room, { foreignKey: 'roomId' });

  FoodBeverage.hasMany(RoomFoodBeverage, {
    foreignKey: {
      name: 'foodBeverageId',  // Foreign key in RoomFoodBeverage
      type: DataTypes.UUID,  // Ensure it's UUID if RoomAmenity has UUID primary key
    },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  RoomFoodBeverage.belongsTo(FoodBeverage, { foreignKey: 'foodBeverageId' });

  User.hasMany(RoomFoodBeverage, {
    foreignKey: {
      name: 'createdBy',  // Foreign key in RoomFoodBeverage
      type: DataTypes.UUID,  // Ensure it's UUID if User has UUID primary key
    },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  RoomFoodBeverage.belongsTo(User, { foreignKey: 'createdBy' });

  User.hasMany(RoomFoodBeverage, {
    foreignKey: {
      name: 'updatedBy',  // Foreign key in RoomFoodBeverage
      type: DataTypes.UUID,  // Ensure it's UUID if User has UUID primary key
    },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  RoomFoodBeverage.belongsTo(User, { foreignKey: 'updatedBy' });

  User.hasMany(RoomFoodBeverage, {
    foreignKey: {
      name: 'deletedBy',  // Foreign key in RoomFoodBeverage
      type: DataTypes.UUID,  // Ensure it's UUID if User has UUID primary key
    },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  RoomFoodBeverage.belongsTo(User, { foreignKey: 'deletedBy' });

export default RoomFoodBeverage;