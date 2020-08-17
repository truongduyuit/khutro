const joi = require('@hapi/joi')
const {throwError} = require('../helpers/responseToClient.helper')
const ValidateBody = validator => {
    return async (req, res, next) => {
        try {
            const validation = await validator.validate(req.body)
            if (validation.error) {
                return throwError({
                    errorCode: 'VALIDATE_BODY_FAILED',
                    message: validation.error.message
                })
            }

            console.log('Validate body thành công !')
            next()
        } catch (error) {
            return next(error)
        }
    }
}

const ValidateQueryParam = validator => {
    return async (req, res, next) => {
        try {
            const validation = await validator.validate(req.query)
            if (validation.error) {
                return throwError({
                    errorCode: 'VALIDATE_PARAM_FAILED',
                    message: validation.error.message
                })
            }

            console.log('Validate param thành công !')
            next()
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = {
    ValidateBody,
    ValidateQueryParam
}