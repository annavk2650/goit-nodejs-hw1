const path = require('path');
const fsp = require('fs/promises');
const { nanoid } = require('nanoid');
const filePath = path.join(__dirname, './db/contacts.json');

async function parsedContacts() {
  const contacts = await fsp.readFile(filePath);
  const parsed = JSON.parse(contacts);
  return parsed;
}

async function updateContactsList(contacts) {
  await fsp.writeFile(filePath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  try {
    const contacts = await parsedContacts();
    console.log('List of contacts:');
    console.table(contacts);
    return contacts;
  } catch (error) {
    return console.error(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await parsedContacts();
    const contact = contacts.find(({ id }) => id === contactId);

    if (!contact) return console.error(`Contact with ID ${contactId} not found`);
    console.log(`Contact with ID ${contactId}:`);
    console.table(contact);
    return contact;
  } catch (error) {
    return console.error(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await parsedContacts();
    const contactIndex = contacts.findIndex(contact => contact.id === contactId);

    if (contactIndex === -1) return console.error(`Contact with ID ${contactId} not found`);

    contacts.splice(contactIndex, 1);

    await updateContactsList(contacts);

    console.log('Contact deleted successfully! New list of contacts:');
    console.table(contacts);
    return contacts;
  } catch (error) {
    return console.error(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };

    const contacts = await parsedContacts();

    contacts.push(newContact);

    await updateContactsList(contacts);
    console.log('Contact added successfully! New list of contacts:');
    console.table(contacts);
    return newContact;
  } catch (error) {
    return console.error(error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
