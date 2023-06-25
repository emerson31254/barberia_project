import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Code = sequelize.define(
  "code",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
