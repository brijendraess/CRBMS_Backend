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

}, {
  indexes: [
    {
      unique: true,
      fields: ["MeetingId", "CommitteeId"], // Composite unique constraint
    },
  ],
}
);
export default MeetingCommittee;
