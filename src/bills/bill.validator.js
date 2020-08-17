const joi = require('@hapi/joi')

const billValidator = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    title: joi.string().required().min(6).max(500),
    room: joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    roomPrice: joi.number().required().min(0),
    roomTotalAmount: joi.number().required().min(0),
    customers: joi.array().required().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    services: joi.array().required().items(joi.string().regex(/^[0-9a-fA-F]{24}$/),),
    serviceTotalAmount: joi.number().required().min(0),
    totalBillAmount: joi.number().required().min(0),
    isPay: joi.boolean().required()
})

module.exports = {
    billValidator
}