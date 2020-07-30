const jwt = require('jsonwebtoken');
const Contact = require('../contact/contact.model');

const authMiddelware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).send('No token provided');
            return;
        }
        const parsedToken = token.replace('Bearer ', '');
        const data = await jwt.verify(parsedToken, process.env.PRIVATE_JWT_KEY);
        const contact = await Contact.getContactById(data.id);
        req.currentContact = contact;
        next()
    } catch (e) {
        res.status(401).send('Not authorized')
        
    }
}

module.exports = {
    authMiddelware,
}