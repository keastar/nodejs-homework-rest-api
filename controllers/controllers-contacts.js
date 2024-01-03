// import express from "express";
import { HttpError } from "../helpers/index.js";
import Contact from "../models/Contact.js";
import ctrlWrapper from "../decoratorse/ctrlWrapper.js";

// const router = express.Router();

const getAll = async (req, res, next) => {
  const result = await Contact.find({});
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

const addContact = async (req, res, next) => {
  const resultAdd = await Contact.create(req.body);
  res.json(resultAdd);
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
