const joi = require('@hapi/joi')

const roomValidator = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    nameRoom: joi.string().required().max(250),
    floor: joi.number().min(0).max(100),
    square: joi.number().min(0).max(1000),
    price: joi.number().min(0).max(100000000),
    description: joi.string().max(1000),
    maxPeople: joi.number().min(0).max(100),
    isDeleted: joi.boolean(),
    block: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    customers: joi.array().items({
        _id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    })
})

const RoomDeleteManyValidator = joi.object({
    _ids: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
})

module.exports = {
    roomValidator,
    RoomDeleteManyValidator
}