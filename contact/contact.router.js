const {Router} = require('express');
const {
        listContacts,
        getContactById,
        removeContact,
        addContact,
        updateContact,
    } = require('./contact.model');
const {
    validateCreateContactMiddleware,
    validateUpdateContactMiddleware,
    } = require('./contact.validator');

const contactRouter = Router();
contactRouter.get('/', async(req, res) => {
    const contacts = await listContacts();
    res.status(200).json(contacts);
});
contactRouter.get('/:id', async(req, res) => {
    const {id} = req.params;
    const contacts = await getContactById(id);

    !contacts ? res.status(400).json({ message: 'Contact not found' }) : res.status(200).json(contacts);
});
contactRouter.delete('/:id', async(req, res) => {
    const {id} = req.params;
    const contact = await removeContact(+id);
    
    (!contact) ? res.status(404).json({ message: 'Contact not found' }) : res.status(200).json({ message: 'Contact successful deleted' });
})
contactRouter.post(
    '/', 
    validateCreateContactMiddleware,
    async (req, res) => {
    const { name, phone, email } = req.body;
    const createdContact = await addContact(name, phone, email);
    res.status(201).json(createdContact);
})

contactRouter.patch(
    '/:id', 
    validateUpdateContactMiddleware,
    async (req, res) => {
    const {id} = req.params;
    const updatedContact = await updateContact(id, req.body);
    (!updatedContact) ? res.status(404).json({ message: 'Contact not found' }) : res.status(200).json(updatedContact);
})


module.exports = {
    contactRouter,
}