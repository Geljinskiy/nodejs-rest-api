import { HttpError } from "../helpers/index.js";
import { cntrllrWrapper } from "../decorators/index.js";
import { Contact } from "../models/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 3, favorite = false } = req.query;

  const skip = (page - 1) * limit;

  const list = await Contact.find({ owner, favorite })
    .skip(skip)
    .limit(limit)
    .populate("owner", "email subscription");
  res.status(200).json(list);
};

const getById = async (req, res) => {
  const { contactId } = req.params;

  const listItem = await Contact.findById(contactId);

  if (!listItem) {
    throw HttpError(404);
  }

  res.status(200).json(listItem);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const createdContact = await Contact.create({ ...req.body, owner });

  res.status(201).json(createdContact);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;

  const removedContact = await Contact.findByIdAndDelete(contactId);
  if (!removedContact) {
    throw HttpError(404);
  }
  res.status(200).json({
    message: "contact deleted",
  });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const newContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!newContact) {
    throw HttpError(404);
  }

  res.status(200).json(newContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }

  res.status(200).json(result);
};

export default {
  getAll: cntrllrWrapper(getAll),
  getById: cntrllrWrapper(getById),
  add: cntrllrWrapper(add),
  deleteById: cntrllrWrapper(deleteById),
  updateById: cntrllrWrapper(updateById),
  updateStatusContact: cntrllrWrapper(updateStatusContact),
};
