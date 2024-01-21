import { HttpError, sendEmail } from "../helpers/index.js";
import gravatar from "gravatar";
import bcrypt from "bcrypt";
import Join from "../models/Join.js";
import jwt from "jsonwebtoken";
import ctrlWrapper from "../decoratorse/ctrlWrapper.js";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import fs from "fs/promises";

const { SECRET_KEY, BASE_URL } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarsPath = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const { id: owner } = req.body;
  const join = await Join.findOne({ email });
  if (join) {
    throw HttpError(409, "Email already in use");
  }
  const poster = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const newJoin = await Join.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
    poster,
    owner,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/joins/verify/${verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    name: newJoin.name,
    email: newJoin.email,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const join = await Join.findOne({ verificationToken });
  if (!join) {
    throw HttpError(404, "Email not found or already verify");
  }
  await Join.findByIdAndUpdate(join.id, {
    verify: true,
    verificationToken: "",
  });
  res.json({
    message: "Email verify success",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const join = await Join.findOne({ email });

  if (!join) {
    throw HttpError(404, "Email not found");
  }
  if (join.verify) {
    throw HttpError(400, "Email already verify");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/joins/verify/${join.verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email success",
  });
};

const login = async (req, res) => {
  const { name, email, password } = req.body;
  const join = await Join.findOne({ email });
  if (!join) {
    throw HttpError(401, "Email or password is invalide");
  }
  if (!join.verify) {
    throw HttpError(401, "Email not verify");
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
    name,
    email,
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

const updateAvatar = async (req, res) => {
  const { id } = req.join;
  const { path: tempPath, originalname } = req.file;
  const filename = `${id}_${originalname}`;
  const resultPath = path.join(avatarsPath, filename);
  await fs.rename(tempPath, resultPath);
  const avatarURL = `/avatars/${filename}`;
  await Join.findByIdAndUpdate(id, { avatarURL });
  res.json({
    avatarURL,
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  logout: ctrlWrapper(logout),
  getAll: ctrlWrapper(getAll),
  updateAvatar: ctrlWrapper(updateAvatar),
};
