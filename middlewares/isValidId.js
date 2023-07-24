// libs imports
import { isValidObjectId } from "mongoose";
// local imports
import { HttpError } from "../helpers/index.js";

const isValdId = (req, res, next) => {
  const { contactId } = req.params;
  console.log(134513451345);
  if (!isValidObjectId(contactId)) {
    next(HttpError(404, `${contactId} is not valid id`));
  }
  next();
};

export default isValdId;
