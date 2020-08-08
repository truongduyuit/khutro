const joi = require('@hapi/joi')

const serviceValidator = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    nameService: joi.string().required().max(250),
    price: joi.number().required().min(0),
    unit: joi.string().required().max(250),
    isDeleted: joi.boolean(),
    block: joi.string().regex(/^[0-9a-fA-F]{24}$/),
})

const ServiceDeleteManyValidator = joi.object({
    _ids: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
})

module.exports = {
    serviceValidator,
    ServiceDeleteManyValidator
}