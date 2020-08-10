const {Router} = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const {authMiddelware} = require('../middlewares/auth.middleware');
const{avatarUploader} = require('../middlewares/avatarUploader.middleware');
const {getAvatar} = require('../utilits/avatar-generation');
const fs = require('fs');
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const {main} = require('../utilits/verification-email')

const {
    validateCreateUserMiddleware,
} = require('../user/user.validation');

const {
    validateLoginMiddleware,
} = require('./auth.validation');

const authRouter = Router();

authRouter.post('/registration',
validateCreateUserMiddleware,
avatarUploader,
async (req, res) => {
    try {
        const { email, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const avatar = await getAvatar(email);
        // const oldPath = path.join(__dirname,`../tmp/${avatar}.png`);
        // const newPath = path.join(__dirname,`../public/images/${avatar}.png`);

        //  fs.renameSync(oldPath, newPath, function (err) {
        //     if (err) {
        //         console.log(err)
        //         return
        // }
        //     console.log('Successfully renamed - AKA moved!')
        // })
        const avatarURL = `http://localhost:3000/images/${avatar}.png`;
        await User.addUser({...req.body, password: hashPassword, avatarURL: avatarURL});
        const verificationToken = uuidv4();
        console.log(verificationToken);
        const currentUser = await User.getUserWithQuery({email})
        const {_id}= currentUser[0]._id
        await User.updateUser(_id, {verificationToken: verificationToken});
        main(email, verificationToken)
        res.status(201).json({
            user: { email, avatarURL: avatarURL},
          });
    } catch (e) {
        res.status(409).send(console.log(e))
        
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
        console.log(currentUser)
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
        console.log(req)
        const user = req.currentUser;
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
authRouter.post( 
    '/avatars',
    authMiddelware,
    avatarUploader,
    async (req, res) => {
        try {
            const {_id} = req.currentUser;
        
            const {path} = req.file;
            await User.updateUser(_id, {avatarURL: path})
            res.json({avatarURL: path});
        } catch (e) {
            res.status(401).send(`Not authorized`)
        } finally {
            res.end()
        }
    }
    )
authRouter.post('/verify/:verificationToken',

async (req, res) => {
    try {
        const { verificationToken } = req.params;
        
      const verifyUser = await User.getUserWithQuery(
        {verificationToken}
      );
    
      if (!verifyUser) {
        res.status(404).send("User not found");
      }
     
      const {_id}= verifyUser[0]._id
      await User.updateUser(_id, {verificationToken: null});

      res.status(200).json("User been verificated");
    } catch (e) {
       
        res.status(404).send("User not found");
    
    } finally {
        res.end()
    }
})
module.exports = {
    authRouter,
}