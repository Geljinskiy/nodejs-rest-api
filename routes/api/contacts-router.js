// libs imports
import express from "express";
// local imports
import contactsController from "../../controllers/contacts-controller.js";
import { isEmptyBody } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { contactsShema } from "../../schemas/index.js";

const router = express.Router();

router.get("/", contactsController.getAll);

router.get("/:contactId", contactsController.getById);

router.post(
  "/",
  isEmptyBody,
  validateBody(contactsShema),
  contactsController.add
);

router.delete("/:contactId", contactsController.deleteById);

router.put(
  "/:contactId",
  isEmptyBody,
  validateBody(contactsShema),
  contactsController.updateById
);

export default router;
