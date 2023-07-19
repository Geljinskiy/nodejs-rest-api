import filesOperations from "../models/contacts.js";
import { HttpError } from "../helpers/index.js";
import { cntrllrWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const list = await filesOperations.listContacts();
  res.status(200).json(list);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const listItem = await filesOperations.getContactById(contactId);

  if (!listItem) {
    throw HttpError(404);
  }

  res.status(200).json(listItem);
};

const add = async (req, res) => {
  const createdContact = await filesOperations.addContact(req.body);

  res.status(201).json(createdContact);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;

  const removedContact = await filesOperations.removeContact(contactId);
  if (!removedContact) {
    throw HttpError(404);
  }

  res.status(200).json({
    message: "contact deleted",
  });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const newContact = await filesOperations.updateContact(contactId, req.body);
  if (!newContact) {
    throw HttpError(404);
  }

  res.status(200).json(newContact);
};

export default {
  getAll: cntrllrWrapper(getAll),
  getById: cntrllrWrapper(getById),
  add: cntrllrWrapper(add),
  deleteById: cntrllrWrapper(deleteById),
  updateById: cntrllrWrapper(updateById),
};
