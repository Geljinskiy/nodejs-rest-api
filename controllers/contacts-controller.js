import filesOperations from "../models/contacts.js";
import { HttpError } from "../helpers/index.js";
import { cntrllrWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const list = await filesOperations.listContacts();
  res.status(200).json({
    status: 200,
    message: "success",
    response: list,
  });
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const listItem = await filesOperations.getContactById(contactId);

  if (!listItem) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json({
    status: 200,
    message: "success",
    response: listItem,
  });
};

const add = async (req, res) => {
  const createdContact = await filesOperations.addContact(req.body);

  res.status(201).json({
    status: 201,
    message: "successfully created",
    response: createdContact,
  });
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;

  const removedContact = await filesOperations.removeContact(contactId);
  if (!removedContact) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json({
    status: 200,
    message: "contact deleted",
  });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const newContact = await filesOperations.updateContact(contactId, req.body);
  if (!newContact) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json({
    status: 200,
    message: "contact updated",
    response: newContact,
  });
};

export default {
  getAll: cntrllrWrapper(getAll),
  getById: cntrllrWrapper(getById),
  add: cntrllrWrapper(add),
  deleteById: cntrllrWrapper(deleteById),
  updateById: cntrllrWrapper(updateById),
};
