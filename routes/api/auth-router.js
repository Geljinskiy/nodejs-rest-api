// libs imports
import express from "express";
// local imports
import validateBody from "../../decorators/validateBody.js";
import { isEmptyBody, authenticate } from "../../middlewares/index.js";
import { authSchema } from "../../schemas/index.js";
import authController from "../../controllers/auth-controller.js";

const router = express.Router();

router.post(
  "/register",
  isEmptyBody(),
  validateBody(authSchema.authSchema),
  authController.registration
);

router.post(
  "/login",
  isEmptyBody(),
  validateBody(authSchema.authSchema),
  authController.login
);

router.post("/logout", authenticate, authController.logout);

router.get("/current", authenticate, authController.current);

export default router;
