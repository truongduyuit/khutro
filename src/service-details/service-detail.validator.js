const joi = require('@hapi/joi')

const serviceDetailValidator = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    room: joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    service: joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    quantity: joi.number().required().min(0),
    serviceAmount: joi.number().required().min(0),
    ofMonth: joi.date().required()
})

const ServiceDetailByRoomAndMonthValidator = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    month: joi.number().required().min(0).max(11),
    year: joi.number().required()
})

module.exports = {
    serviceDetailValidator,
    ServiceDetailByRoomAndMonthValidator
}