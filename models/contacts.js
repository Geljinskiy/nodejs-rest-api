// libs imports
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

// common vars
const contactsPath = path.resolve("models", "contacts.json");

// common fncs
const updateContactsList = async (updatedList) => {
  await fs.writeFile(contactsPath, JSON.stringify(updatedList, null, 2));
};

// fs operations
/**
 * Getting full list of contacts
 *
 * @async
 * @returns {Promise<Object>}
 */
const listContacts = async () => {
  const list = await fs.readFile(contactsPath);
  return JSON.parse(list);
};

/**
 * Getting contact by id (if exist)
 *
 * @async
 * @param {string} contactId - id of wanted contact
 * @returns {Promise<Object|null>}
 */
const getContactById = async (contactId) => {
  const list = await listContacts();
  return list.find((el) => el.id === contactId) || null;
};

/**
 * Removing contact by id (if exist)
 *
 * @async
 * @param {string} contactId - id of wanted contact
 * @returns {Promise<true|null>}
 */
const removeContact = async (contactId) => {
  const isExist = await getContactById(contactId);
  if (!isExist) {
    return null;
  }
  const list = await listContacts();
  const updatedList = list.filter((el) => el.id !== contactId);
  await updateContactsList(updatedList);
  return true;
};

/**
 * Adding new contact
 *
 * @async
 * @param {{name: string, email: string, phone: string}} body - new contact to add
 * @returns {Promise<Object>}
 */
const addContact = async (body) => {
  const { name, email, phone } = body;
  const prevList = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  const updatedList = [...prevList, newContact];
  await updateContactsList(updatedList);
  return newContact;
};

/**
 * Updating contact by id (if exist)
 *
 * @async
 * @param {string} contactId - id of wanted contact
 * @param {{name: string, email: string, phone: string}} body - new contact to update
 * @returns {Promise<Object|null>}
 */
const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  const list = await listContacts();
  const inx = list.findIndex((el) => el.id === contactId);
  if (inx === -1) {
    return null;
  }
  list[inx] = { id: contactId, name, email, phone };
  await updateContactsList(list);

  return list[inx];
};

//exprts
export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
