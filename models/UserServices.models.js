import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import User from "./User.models.js";
import Services from "./Services.models.js";

const UserServices = sequelize.define(
  "UserServices",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
     status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // enables automatic `createdAt` and `updatedAt` management
    tableName: "user_services",
  }
);

Services.hasMany(UserServices, {
  foreignKey: {
    name: 'servicesId',  // Foreign key in RoomAmenityQuantity
    type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
  },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  UserServices.belongsTo(Services, { foreignKey: 'servicesId' });

  User.hasMany(UserServices, {
    foreignKey: {
      name: 'userId',  // Foreign key in RoomAmenityQuantity
      type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
    },
      onDelete: 'CASCADE' // Optional: What happens when a User is deleted
    });
  
    UserServices.belongsTo(User, { foreignKey: 'userId' });

export default UserServices;


