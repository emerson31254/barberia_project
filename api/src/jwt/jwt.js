import jwt from "jwt-simple";
import moment from "moment";
var secret = "milu312";
export const createToken = (user) => {
  var payload = {
    sub: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(15, "days").unix,
  };

  return jwt.encode(payload, secret);
};
