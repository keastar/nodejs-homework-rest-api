import express from "express";
import { registerScheme, loginScheme, emailScheme } from "../../models/Join.js";
import { validateBody } from "../../decoratorse/index.js";
import { joinsController } from "../../controllers/index.js";
import {
  isNotEmptyBody,
  authenticate,
  upload,
} from "../../middleware/index.js";

const router = express.Router();

//SIGNUP когда приходит запрос на регистрацию, то проверка происходит по registerScheme
router.post(
  "/register",
  isNotEmptyBody,
  validateBody(registerScheme),
  joinsController.register
);

//SIGNIN когда приходит запрос на логинизацию, то проверка происходит по loginScheme
router.post(
  "/login",
  isNotEmptyBody,
  validateBody(loginScheme),
  joinsController.login
);
router.get("/current", authenticate, joinsController.getCurrent);

router.get("/verify/:verificationToken", joinsController.verify);

router.post(
  "/verify",
  isNotEmptyBody,
  validateBody(emailScheme),
  joinsController.resendVerifyEmail
);

router.post("/logout", authenticate, joinsController.logout);

router.get("/", authenticate, joinsController.getAll);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  joinsController.updateAvatar
);

export default router;
