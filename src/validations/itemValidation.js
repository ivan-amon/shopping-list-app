const Joi = require('joi')

const createItemSchema = Joi.object({
    name: Joi.string().min(1).required()
})

const updateItemSchema = Joi.object({
    name: Joi.string().min(1).required()
})

module.exports = {
    createItemSchema,
    updateItemSchema
}