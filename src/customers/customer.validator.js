const joi = require('@hapi/joi')
const {USER_ROLES} = require('../../configs/app.config')

const CustomerValidator = joi.object({
    email: joi.string().email(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,32}$')),
    role: joi.string().valid(USER_ROLES.toString()),
    fullName: joi.string().min(6).max(50),
    address: joi.string().min(6).max(50),
    phoneNumber: joi.string().length(10)
})

const CustomerChangInfoValidator = joi.object({
    fullName: joi.string().min(6).max(50),
    address: joi.string().min(6).max(50),
    phoneNumber: joi.string().length(10),
})

const CustomerDeleteManyValidator = joi.object({
    _ids: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
})

module.exports = {
    CustomerValidator,
    CustomerChangInfoValidator,
    CustomerDeleteManyValidator
}