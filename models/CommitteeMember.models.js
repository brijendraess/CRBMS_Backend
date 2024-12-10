import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import Committee from "./Committee.models.js";
import User from "./User.models.js";

const CommitteeMember = sequelize.define(
  "CommitteeMember",
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
    tableName: "committee_members",
  }
);

Committee.hasMany(CommitteeMember, {
  foreignKey: {
    name: 'committeeId',  // Foreign key in RoomAmenityQuantity
    type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
  },
    onDelete: 'CASCADE' // Optional: What happens when a User is deleted
  });

  CommitteeMember.belongsTo(Committee, { foreignKey: 'committeeId' });

  User.hasMany(CommitteeMember, {
    foreignKey: {
      name: 'userId',  // Foreign key in RoomAmenityQuantity
      type: DataTypes.UUID,  // Ensure it's UUID if Room has UUID primary key
    },
      onDelete: 'CASCADE' // Optional: What happens when a User is deleted
    });
  
    CommitteeMember.belongsTo(User, { foreignKey: 'userId' });

export default CommitteeMember;


