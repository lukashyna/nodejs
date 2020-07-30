require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {contactRouter} = require('./contact/contact.router');
const {authRouter} = require('./auth/auth.router')
const app = express();
const mongoose = require('mongoose');


const createServer = async() => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL, {useUnifiedTopology:true, useNewUrlParser:true, useCreateIndex : true, });
        console.log(process.env.MONGODB_URL)
        console.log('Database connection successful')
        console.log(db)
        app.use(cors())
        app.use('/', express.static('public'))
        app.use(express.json())
        app.use('/contacts', contactRouter)
        app.use('/auth', authRouter)
        app.listen(3000, () => console.log('Server listening on port: 3000'))
    } catch(e){
        console.error(e)
        process.exit(1)
    }
}
createServer();