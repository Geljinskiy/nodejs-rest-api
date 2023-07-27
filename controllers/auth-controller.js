import { HttpError } from "../helpers/index.js";
import { cntrllrWrapper } from "../decorators/index.js";
import { Contact } from "../models/index.js";

const registration = async (req, res) => {
        
};

const getById = async (req, res) => {
  const { contactId } = req.params;

  const listItem = await Contact.findById(contactId);

  if (!listItem) {
    throw HttpError(404);
  }

  res.status(200).json(listItem);
};


export default {
  getAll: cntrllrWrapper(getAll),
  getById: cntrllrWrapper(getById),
  add: cntrllrWrapper(add),
  deleteById: cntrllrWrapper(deleteById),
  updateById: cntrllrWrapper(updateById),
  updateStatusContact: cntrllrWrapper(updateStatusContact),
};
