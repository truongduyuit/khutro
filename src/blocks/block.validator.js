const joi = require('@hapi/joi')

const BlockValidator = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    NameBlock: joi.string().required().max(250),
    Address: joi.string().max(250),
    Description: joi.string().max(250),
    // Owner: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    Images: joi.array().items(joi.string().min(3)),
    PriceFrom: joi.number().min(0).max(1000000000),
    PriceTo: joi.number().min(joi.ref('PriceFrom')).max(1000000000),
})

const BlockDeleteManyValidator = joi.object({
    _ids: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
})

module.exports = {
    BlockValidator,
    BlockDeleteManyValidator
}