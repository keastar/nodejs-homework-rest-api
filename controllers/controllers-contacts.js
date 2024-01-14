import { HttpError } from "../helpers/index.js";
import Contact from "../models/Contact.js";
import ctrlWrapper from "../decoratorse/ctrlWrapper.js";
import fs from "fs/promises";
import path from "path";

const getAll = async (req, res, next) => {
  const { id: owner } = req.join;
  const result = await Contact.find(
    { owner },
    "-createdAt -updatedAt"
  ).populate("owner", "name email");
  res.json(result);
};

const getByid = async (req, res) => {
  const { id } = req.params;
  const resultId = await Contact.findById(id);
  if (!resultId) {
    throw HttpError(404, `Contact with contactId=${id} not found`);
  }
  res.json(resultId);
};

const postersPath = path.join(__dirname, "../", "public", "avatars");

const addContact = async (req, res, next) => {
  const { id: owner } = req.join;
  // const { path: oldPath, filename } = req.file;
  // const newPath = path.join(postersPath, filename);
  // await fs.rename(oldPath, newPath);
  // avatarURL;
  // const poster = path.join("avatars", filename);
  console.log(req.body);
  // if (!req.file) {
  //   return res.send("Please upload a file");
  // }
  console.log(req.file);
  // const resultAdd = await Contact.create({ ...req.body, poster, owner });
  // res.json(resultAdd);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const resultDel = await Contact.findByIdAndDelete(id);
  if (!resultDel) {
    throw HttpError(404, `Contact with contactId=${id} not found`);
  }
  res.json(resultDel);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const resultUpdate = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!resultUpdate) {
    throw HttpError(404, `Contact with contactId=${id} not found`);
  }
  res.json(resultUpdate);
};

export default {
  getAll: ctrlWrapper(getAll),
  getByid: ctrlWrapper(getByid),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
};
