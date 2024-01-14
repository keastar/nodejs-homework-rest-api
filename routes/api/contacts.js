import express from "express";
import { contactsController } from "../../controllers/index.js";
import { validateBody } from "../../decoratorse/index.js";
import { isNotEmptyBody, authenticate } from "../../middleware/index.js";
import {
  contactAddScheme,
  contactUpdateScheme,
  contactUpdateFavoriteSchema,
} from "../../models/Contact.js";
import { isValidId, upload } from "../../middleware/index.js";

const router = express.Router();

router.get("/", authenticate, contactsController.getAll);

router.get("/:id", authenticate, isValidId, contactsController.getByid);

router.post(
  "/",
  // upload.fields([{name: "poster", maxCount: 8}]),
  // upload.array("poster", 8),
  upload.single("poster"),
  authenticate,
  isNotEmptyBody,
  validateBody(contactAddScheme),
  contactsController.addContact
);

router.delete(
  "/:id",
  authenticate,
  isValidId,
  contactsController.deleteContact
);

router.put(
  "/:id",
  authenticate,
  isNotEmptyBody,
  isValidId,
  validateBody(contactUpdateScheme),
  contactsController.updateContact
);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  isNotEmptyBody,
  validateBody(contactUpdateFavoriteSchema),
  contactsController.updateContact
);

export default router;
