// libs imports
import express from "express";
// local imports
import { isEmptyBody, validateBody } from "../../middlewares/index.js";
import { joiSchema } from "../../schemas/index.js";

const router = express.Router();

router.post(
  "/register",
  isEmptyBody(),
  validateBody(joiSchema.contactsUpdateFavSchema)
);
router.post(
  "/login",
  isEmptyBody(),
  validateBody(joiSchema.contactsUpdateFavSchema)
);

export default router;
