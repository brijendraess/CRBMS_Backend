import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const MeetingCommittee = sequelize.define(
  "meeting_committee",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

}
);
export default MeetingCommittee;
