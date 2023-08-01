import { HttpError } from "../helpers/index.js";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import { cntrllrWrapper } from "../decorators/index.js";
import dotenv from "dotenv";
dotenv.config();

const { JWT_PHRASE } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");

  if (!token || bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, JWT_PHRASE);
    const user = await User.findById(id);
    if (!user) {
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};
export default cntrllrWrapper(authenticate);
