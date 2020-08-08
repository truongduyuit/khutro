const joi = require('@hapi/joi')

const BlockValidator = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    nameBlock: joi.string().required().max(250),
    address: joi.string().max(250),
    description: joi.string().max(250),
    // Owner: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    images: joi.array().items(joi.string().min(3)),
    priceFrom: joi.number().min(0).max(1000000000),
    priceTo: joi.number().min(joi.ref('priceFrom')).max(1000000000),
    rooms: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    services: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
})

const BlockDeleteManyValidator = joi.object({
    _ids: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
})

module.exports = {
    BlockValidator,
    BlockDeleteManyValidator
}