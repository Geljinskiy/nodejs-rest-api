import { HttpError } from "../helpers/index.js";

const isEmptyBody = ((message = "missing fields") => (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    next(HttpError(400, message));
  }
  next();
});

export default isEmptyBody;
