const {Router} = require('express');
const Contact = require('./contact.model');

const contactRouter = Router();
contactRouter.get('/', async(req, res) => {
    const contacts = await Contact.listContacts();
    res.status(200).json(contacts);
    console.log(contacts)
});
contactRouter.get('/:id', async(req, res) => {
    const {id} = req.params;
    const contacts = await Contact.getContactById(id);

    !contacts ? res.status(400).json({ message: 'Contact not found' }) : res.status(200).json(contacts);
});
contactRouter.delete('/:id', async(req, res) => {
    const {id} = req.params;
    const contact = await Contact.removeContact(id);
    
    (!contact) ? res.status(404).json({ message: 'Contact not found' }) : res.status(200).json({ message: 'Contact successful deleted' });
})
contactRouter.post(
    '/', 
    async (req, res) => {
    const { name, phone, email } = req.body;
    const createdContact = await Contact.addContact(name, phone, email);
    res.status(201).json(createdContact);
})

contactRouter.patch(
    '/:id', 
    async (req, res) => {
    const {id} = req.params;
    const updatedContact = await Contact.updateContact(id, req.body);
    (!updatedContact) ? res.status(404).json({ message: 'Contact not found' }) : res.status(200).json(updatedContact);
})

module.exports = {
    contactRouter,
}