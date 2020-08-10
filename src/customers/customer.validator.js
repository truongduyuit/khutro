const joi = require('@hapi/joi')

const CustomerValidator = joi.object({
    email: joi.string().email(),
    fullName: joi.string().required().min(6).max(50),
    address: joi.string().required().min(6).max(50),
    phoneNumber: joi.string().required().length(10),
    room: joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
})

const CustomerChangInfoValidator = joi.object({
    _id: joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    email: joi.string().email(),
    fullName: joi.string().required().min(6).max(50),
    address: joi.string().required().min(6).max(50),
    phoneNumber: joi.string().required().length(10),
    room: joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
})

const CustomerDeleteManyValidator = joi.object({
    _ids: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
})

module.exports = {
    CustomerValidator,
    CustomerChangInfoValidator,
    CustomerDeleteManyValidator
}