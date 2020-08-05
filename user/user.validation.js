const { request } = require("express");

const Joi = require('@hapi/joi');

const CreateUserSchema = Joi.object({

    email: Joi
            .string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'ru', 'ua'] } }),
    
    password: Joi
            .string(),

    subscription: Joi
            .string()
            .valid(
                ...Object.values({
                    free: 'free',
                    pro: 'pro',
                    premium: 'premium'
                })
            ),
})

const validate = async (schema, data) => {
    const {error} = await schema.validate(data);
    if (error) {
        const message = error.details.reduce((message, item) => {
            if (message) return `${message}, ${item.message}`
            return `${item.message}`
        }, '')
        throw new Error(message)
    }
}

const validateCreateUserMiddleware = async (req, res, next) => {
    try {
        await validate(CreateUserSchema, req.body);
        next()
    } catch (e) {
        res.status(400).send(e.message)
        res.end();
        return;
    }
}


module.exports = {
    validateCreateUserMiddleware,
}