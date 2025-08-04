const Joi = require('joi')

const registerUserSchema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})

const loginUserSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})

module.exports = {
    registerUserSchema,
    loginUserSchema
}