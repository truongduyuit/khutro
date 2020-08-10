const joi = require('@hapi/joi')


const UserValidator = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{6,32}$')),
    fullName: joi.string().min(6).max(50),
    address: joi.string().min(6).max(50),
    phoneNumber: joi.string().length(10)
})

const UserChangPasswordValidator = joi.object({
    oldPassword: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{6,32}$')),
    newPassword: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{6,32}$')),
})

const UserChangInfoValidator = joi.object({
    fullName: joi.string().min(6).max(50),
    address: joi.string().min(6).max(50),
    phoneNumber: joi.string().length(10),
})

module.exports = {
    UserValidator,
    UserChangPasswordValidator,
    UserChangInfoValidator
}