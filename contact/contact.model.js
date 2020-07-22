const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const contactsPath =  path.join('db', './contacts.json');

class Contact {
    constructor({ name, email, phone}, id) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}

const listContacts = async () => {
    const contacts = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(contacts);
  }
  
const getContactById = async id => {
    const contacts = await listContacts() || [];
    return contacts.find(contact => contact.id === id);
  }
  
const removeContact = async id => {
    const contacts = await listContacts() || [];
    const result = contacts.filter(contact => contact.id !== id);
    await fs.writeFile(contactsPath, JSON.stringify(result));
    return result;
  }
  
const addContact = async (name, phone,email) => {
    const contacts = await listContacts() || [];
    const newId = uuidv4();
    const createdContact = new Contact({name,phone,email}, newId);
    contacts.push(createdContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    console.log(contacts)
  }

const updateContact = async (id, data) => {
    const contacts = await listContacts() || [];
    const result = contacts.map(item => {
        if (item.id === id) {
            return {...item, ...data}
        }
        return item;
    })
    await fs.writeFile(contactsPath, JSON.stringify(result));
    return result.find(contact => contact.id === id);
}
module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
}
