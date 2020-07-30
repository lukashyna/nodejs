const {Router} = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Contact = require('../contact/contact.model');
const {authMiddelware} = require('../middlewares/auth.middleware')

const {
    validateCreateContactMiddleware,
} = require('../contact/contact.validator');

const {
    validateLoginMiddleware,
} = require('./auth.validation');

const authRouter = Router();

authRouter.post('/registration',
validateCreateContactMiddleware,
async (req, res) => {
    try {
        const { password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        await Contact.addContact({...req.body, password: hashPassword});
        res.status(201);
    } catch (e) {
        res.status(409).send(`Email in use`)
    } finally {
        res.end()
    }
})
authRouter.post('/login',
validateLoginMiddleware,
async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(res);
        const currentContact = await Contact.getContactWithQuery({email});
        if (!currentContact.length) {
            res.status(401).send(`Email or password is wrong`)
            return;
        }
        const isEqualPassword = await bcrypt.compare(password, currentContact[0].password);
        if (!isEqualPassword) {
            res.status(400).send('Email or password is wrong')
            return;
        }
        const acces_token = await jwt.sign({id: currentContact[0]._id}, process.env.PRIVATE_JWT_KEY, {expiresIn: '7d'});
        console.log(currentContact[0]._id)
        res.json({accces_token: `Bearer ${acces_token}`, user: `email: ${currentContact[0].email}, subscription: ${currentContact[0].subscription} `})
    } catch (e) {
        res.status(500).send(e)
    } finally {
        res.end()
    }
})
authRouter.post('/logout',
authMiddelware,
validateCreateContactMiddleware,
async (req, res) => {
    try {
        const {_id} = req.currentContact;
        const contact = await Contact.getContactById(_id);
        let token = req.headers.authorization;
        if(!contact) {
            res.status(401).send(`Not authorized`)
            return
        }
        await Contact.updateContact(_id, token = null);
        res.status(204).send(`204 No Content`)
    } catch (e) {
        res.status(401).send(`Not authorized`)
        console.log(e)
    
    } finally {
        res.end()
    }
})
authRouter.post('/current',
authMiddelware,
validateCreateContactMiddleware,
async (req, res) => {
    try {
        const contact = req.currentContact;
        console.log(contact)
        if(!contact) {
            res.status(401).send(`Not authorized`)
            return
        }
        res.json({ user: `email: ${contact.email}, subscription: ${contact.subscription} `})
    } catch (e) {
        res.status(500).send(e)
    
    } finally {
        res.end()
    }
})

module.exports = {
    authRouter,
}
