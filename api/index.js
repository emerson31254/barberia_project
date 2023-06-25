import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./src/db.js";
import "./src/model/index.model.js";

try {
  sequelize.sync({ alter: true });
  console.log("database conectada");
  app.listen(3000, (_) => {
    console.log("server in port 3000");
  });
} catch (error) {
  console.log(error);
}
