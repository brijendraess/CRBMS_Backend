import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const FoodBeverage = sequelize.define(
  "FoodBeverage",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    foodBeverageName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
   
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "foodBeverage",
    timestamps: true,
    paranoid: true,
  }
);

export default FoodBeverage;
