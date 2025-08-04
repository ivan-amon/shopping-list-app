const Joi = require('joi')

const createListSchema = Joi.object({
    name: Joi.string().min(1).required(),
    date: Joi.date().required(),
    notes: Joi.string().allow('').optional(),
    isCompleted: Joi.boolean().optional()
})

const updateListSchema = Joi.object({
    name: Joi.string().optional(),
    date: Joi.date().optional(),
    notes: Joi.string().optional(),
    isCompleted: Joi.boolean().optional(),
}).min(1) // required 1 field min

module.exports = {
    createListSchema,
    updateListSchema
}