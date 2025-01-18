import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import RoomAmenity from "./RoomAmenity.model.js";

const Stock = sequelize.define(
  "Stock",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    stockType: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Ensure a default value
    },
  },
  {
    tableName: "stock",
    timestamps: true,
    paranoid: true,
  }
);

RoomAmenity.hasOne(Stock, {
  foreignKey: {
    name: "itemId",
    type: DataTypes.UUID,
  },
  onDelete: "CASCADE",
});
Stock.belongsTo(RoomAmenity, { foreignKey: "itemId" });

export default Stock;
