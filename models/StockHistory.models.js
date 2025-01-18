import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import RoomAmenity from "./RoomAmenity.model.js";
import Room from "./Room.models.js";

const StockHistory = sequelize.define(
  "StockHistory",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    stockInOut: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    stockUsed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Ensure a default value
    },
    createdBy: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
      },
  },
  {
    tableName: "stock_history",
    timestamps: true,
    paranoid: true,
  }
);

Room.hasMany(StockHistory, {
  foreignKey: {
    name: "roomId",
    type: DataTypes.UUID,
  },
  onDelete: "CASCADE",
});
StockHistory.belongsTo(Room, { foreignKey: "roomId" });

RoomAmenity.hasMany(StockHistory, {
    foreignKey: {
      name: "amenityId",
      type: DataTypes.UUID,
    },
    onDelete: "CASCADE",
  });
  StockHistory.belongsTo(RoomAmenity, { foreignKey: "amenityId" });

export default StockHistory;
