import express from "express";
import { registerScheme, loginScheme } from "../../models/Join.js";
import { validateBody } from "../../decoratorse/index.js";
import { joinsController } from "../../controllers/index.js";
import { isNotEmptyBody, authenticate } from "../../middleware/index.js";

const router = express.Router();

//SIGNUP когда приходит запрос на регистрацию, то проверка происходит по registerScheme
router.post(
  "/register",
  authenticate,
  isNotEmptyBody,
  validateBody(registerScheme),
  joinsController.register
);

//SIGNIN когда приходит запрос на логинизацию, то проверка происходит по loginScheme
router.post(
  "/login",
  authenticate,
  isNotEmptyBody,
  validateBody(loginScheme),
  joinsController.login
);
router.get("/current", authenticate, joinsController.getCurrent);

router.post("/logout", authenticate, joinsController.logout);

router.get("/", authenticate, joinsController.getAll);

// router.login("/login", usersController.login);
// router.logout("/logout", usersController.logout);
// router.current("/current", usersController.current);
//must be registration form and authorization
export default router;
