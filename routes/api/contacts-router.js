// libs imports
import express from "express";
// local imports
import contactsController from "../../controllers/contacts-controller.js";
import { isEmptyBody, isValidId } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { joiSchema } from "../../schemas/index.js";

const router = express.Router();

router.get("/", contactsController.getAll);

router.get("/:contactId", isValidId, contactsController.getById);

router.post(
  "/",
  isEmptyBody(),
  validateBody(joiSchema.contactsSchema),
  contactsController.add
);

router.delete("/:contactId", isValidId, contactsController.deleteById);

router.put(
  "/:contactId",
  isValidId,
  isEmptyBody(),
  validateBody(joiSchema.contactsSchema),
  contactsController.updateById
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody("missing field favorite"),
  validateBody(joiSchema.contactsUpdateFavSchema),
  contactsController.updateStatusContact
);

export default router;
