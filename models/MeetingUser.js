import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const MeetingUser = sequelize.define(
  "meeting_user",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

}, {
  indexes: [
    {
      unique: true,
      fields: ["MeetingId", "UserId"], // Composite unique constraint
    },
  ],
}
);
export default MeetingUser;
