import jwt from "jwt-simple";
import moment from "moment";
var secret = "milu312";

export const ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ msg: "la peticion no tiene cabecera" });
  }
  var token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(401).json({ msg: "el token ya expiro" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "el token no es valido" });
  }

  req.user = payload;

  next();
};
