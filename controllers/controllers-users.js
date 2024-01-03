import { HttpError } from "../helpers/index.js";
import bcrypt from "bcrypt";
// import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import ctrlWrapper from "../decoratorse/ctrlWrapper.js";
import "dotenv/config";

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is invalide");
  }
  //сравниваем пароль, который пришел с фронтенда с тем, который сохраняется в базе
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is invalide");
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  // console.log(token);
  res.json({
    token,
  });
};

const getAll = async (req, res, next) => {
  const result = await User.find({});
  res.json(result);
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getAll: ctrlWrapper(getAll),
};
