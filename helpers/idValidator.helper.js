const joi = require('@hapi/joi')

const idValidator = joi.object({
    _id: joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
})

module.exports = idValidator