const joi = require('@hapi/joi')
const {USER_ROLES} = require('../../configs/app.config')

const UserValidator = joi.object({
    Email: joi.string().required().email(),
    Password: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{6,32}$')),
    Role: joi.string().valid(USER_ROLES.toString()),
    Confirmed: joi.bool(),
    FullName: joi.string().min(6).max(50),
    Address: joi.string().min(6).max(50),
    PhoneNumber: joi.string().length(10),
    DateJoined: joi.date().max(Date.now())
})

const UserChangPasswordValidator = joi.object({
    oldPassword: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{6,32}$')),
    newPassword: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{6,32}$')),
})

const UserChangInfoValidator = joi.object({
    FullName: joi.string().min(6).max(50),
    Address: joi.string().min(6).max(50),
    PhoneNumber: joi.string().length(10),
})

module.exports = {
    UserValidator,
    UserChangPasswordValidator,
    UserChangInfoValidator
}