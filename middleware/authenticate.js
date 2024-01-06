import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/index.js";
import Join from "../models/Join.js";
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const join = await Join.findById(id);
    if (!join || !join.token || join.token !== token) {
      next(HttpError(401));
    }
    req.join = join;
    next();
  } catch {
    next(HttpError(401));
  }
};
export default authenticate;
