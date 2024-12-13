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

}
);
export default MeetingUser;
