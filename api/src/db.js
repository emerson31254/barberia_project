import { Sequelize } from "sequelize";
const { DB_USER, DB_PASSWORD, DB_HOST, NAME_DB } = process.env;

//aqui se realiza la conexion de la base de datos//
export const sequelize = new Sequelize(NAME_DB, DB_USER, DB_PASSWORD, {
  logging: false,
  host: DB_HOST,
  dialect: "postgres",
});
