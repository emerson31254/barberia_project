import { Code } from "./Code.model.js";
import { User } from "./User.model.js";

User.hasOne(Code);
Code.belongsTo(User);

export { Code, User };
