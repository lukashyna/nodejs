const {Router} = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const {authMiddelware} = require('../middlewares/auth.middleware')

const {
    validateCreateUserMiddleware,
} = require('../user/user.validation');

const {
    validateLoginMiddleware,
} = require('./auth.validation');

const authRouter = Router();

authRouter.post('/registration',
validateCreateUserMiddleware,
async (req, res) => {
    try {
        const { password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        await User.addUser({...req.body, password: hashPassword});
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
        const currentUser = await User.getUserWithQuery({email});
        if (!currentUser.length) {
            res.status(401).send(`Email or password is wrong`)
            return;
        }
        const isEqualPassword = await bcrypt.compare(password, currentUser[0].password);
        if (!isEqualPassword) {
            res.status(400).send('Email or password is wrong')
            return;
        }
        const acces_token = await jwt.sign({id: currentUser[0]._id}, process.env.PRIVATE_JWT_KEY, {expiresIn: '7d'});
        console.log(currentContact[0]._id)
        res.json({acces_token: `Bearer ${acces_token}`, user: `email: ${currentUser[0].email}, subscription: ${currentUser[0].subscription} `})
    } catch (e) {
        res.status(500).send(e)
    } finally {
        res.end()
    }
})
authRouter.post('/logout',
authMiddelware,
validateCreateUserMiddleware,
async (req, res) => {
    try {
        const {_id} = req.currentUser;
        const user = await User.getUserById(_id);
        let token = req.headers.authorization;
        if(!user) {
            res.status(401).send(`Not authorized`)
            return
        }
        await User.updateUser(_id, token = null);
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
validateCreateUserMiddleware,
async (req, res) => {
    try {
        const user = req.currentContact;
        console.log(user)
        if(!user) {
            res.status(401).send(`Not authorized`)
            return
        }
        res.json({ user: `email: ${user.email}, subscription: ${user.subscription} `})
    } catch (e) {
        res.status(500).send(e)
    
    } finally {
        res.end()
    }
})

module.exports = {
    authRouter,
}
