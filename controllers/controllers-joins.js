import { HttpError } from "../helpers/index.js";
import gravatar from "gravatar";
import bcrypt from "bcrypt";
import Join from "../models/Join.js";
import Join from "../public/avatars";
import jwt from "jsonwebtoken";
import ctrlWrapper from "../decoratorse/ctrlWrapper.js";
import "dotenv/config";
import path from "path";
import fs from "fs/promises";

const { SECRET_KEY } = process.env;

const postersPath = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const { id: owner } = req.body;
  const join = await Join.findOne({ email });
  if (join) {
    throw HttpError(409, "Email already in use");
  }
  const poster = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const newJoin = await Join.create({
    ...req.body,
    password: hashPassword,
    poster,
    owner,
  });
  res.status(201).json({
    name: newJoin.name,
    email: newJoin.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const join = await Join.findOne({ email });
  if (!join) {
    throw HttpError(401, "Email or password is invalide");
  }
  //сравниваем пароль, который пришел с фронтенда с тем, который сохраняется в базе
  const passwordCompare = await bcrypt.compare(password, join.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is invalide");
  }

  const payload = {
    id: join.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await Join.findByIdAndUpdate(join.id, { token });
  res.json({
    token,
  });
};

const getCurrent = async (req, res, next) => {
  const { email, name } = req.join;
  res.json({
    email,
    name,
  });
};

const logout = async (req, res) => {
  const { id } = req.body;
  await Join.findByIdAndUpdate(id, { token: "" });
  res.json({
    message: "Logout success",
  });
};

const getAll = async (req, res, next) => {
  const { id: owner } = req.body;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  // const result = await Join.find({});
  const result = await Join.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.json(result);
};

updateAvatar = async (req, res) => {};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  getAll: ctrlWrapper(getAll),
  updateAvatar: ctrlWrapper(updateAvatar),
};
