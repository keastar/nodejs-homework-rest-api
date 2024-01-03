import express from "express";
import { contactsController } from "../../controllers/index.js";
import { validateBody } from "../../decoratorse/index.js";
import { isNotEmptyBody } from "../../middleware/index.js";
import {
  contactAddScheme,
  contactUpdateScheme,
  contactUpdateFavoriteSchema,
} from "../../models/Contact.js";
import { isValidId } from "../../middleware/index.js";

const router = express.Router();

router.get("/", contactsController.getAll);

router.get("/:id", isValidId, contactsController.getByid);

router.post(
  "/",
  isNotEmptyBody,
  validateBody(contactAddScheme),
  contactsController.addContact
);

router.delete("/:id", isValidId, contactsController.deleteContact);

router.put(
  "/:id",
  isNotEmptyBody,
  isValidId,
  validateBody(contactUpdateScheme),
  contactsController.updateContact
);

router.patch(
  "/:id/favorite",
  isValidId,
  isNotEmptyBody,
  validateBody(contactUpdateFavoriteSchema),
  contactsController.updateContact
);

export default router;
