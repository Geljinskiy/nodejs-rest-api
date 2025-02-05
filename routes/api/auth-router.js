// libs imports
import express from "express";
// local imports
import validateBody from "../../decorators/validateBody.js";
import { isEmptyBody, authenticate, upload } from "../../middlewares/index.js";
import { authJoiSchema } from "../../schemas/index.js";
import authController from "../../controllers/auth-controller.js";

const router = express.Router();

router.post(
  "/register",
  isEmptyBody(),
  validateBody(authJoiSchema.authSchema),
  authController.registration
);

router.post(
  "/login",
  isEmptyBody(),
  validateBody(authJoiSchema.authSchema),
  authController.login
);

router.post("/logout", authenticate, authController.logout);

router.get("/current", authenticate, authController.current);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

router.patch(
  "/subscription",
  isEmptyBody(),
  authenticate,
  validateBody(authJoiSchema.userUpdatePlan),
  authController.updateSubscription
);

router.post(
  "/verify",
  validateBody(authJoiSchema.userEmailSchema),
  authController.resendVerifyEmail
);

router.get("/verify/:verificationToken", authController.verifycationByToken);

export default router;
