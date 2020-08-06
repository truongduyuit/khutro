const joi = require('@hapi/joi')

const ValidateBody = validator => {
    return (req, res, next) => {
        const result = validator.validate(req.body)

        if (result.error){
            return res.status(400).json({
                error: {
                    message: result.error
                }
            })
        }else {
            console.log('Validate thành công !')
            next()
        }
    }
}

const ValidateQueryParam = validator => {
    return (req, res, next) => {
        const result = validator.validate(req.query)
        if (result.error){
            return res.status(400).json({
                error: {
                    message: result.error
                }
            })
        }else {
            console.log('Validate thành công !')
            next()
        }
    }
}

module.exports = {
    ValidateBody,
    ValidateQueryParam
}