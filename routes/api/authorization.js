import express from "express";
import { registerScheme, loginScheme } from "../../models/User.js";
import { validateBody } from "../../decoratorse/index.js";
import { usersController } from "../../controllers/index.js";
import { isNotEmptyBody } from "../../middleware/index.js";

const router = express.Router();

//SIGNUP когда приходит запрос на регистрацию, то проверка происходит по registerScheme
router.post(
  "/register",
  isNotEmptyBody,
  validateBody(registerScheme),
  usersController.register
);

//SIGNIN когда приходит запрос на логинизацию, то проверка происходит по loginScheme
router.post(
  "/login",
  isNotEmptyBody,
  validateBody(loginScheme),
  usersController.login
);

router.get("/", usersController.getAll);

// router.login("/login", usersController.login);
// router.logout("/logout", usersController.logout);
// router.current("/current", usersController.current);
//must be registration form and authorization
export default router;
