const jwt = require('jsonwebtoken')
const configs = require('../configs/app.config')

const {throwError} = require('../helpers/responseToClient.helper')
const userService = require('../src/users/user.service')

const AuthenticateRoleJWT = roles => {
    return async (req, res, next) => {
        const authHeader = await req.headers['authorization']

        if (authHeader){
            const token = authHeader.split(/\s+/).pop() || ''
            try {
                jwt.verify(token, configs.SECRET_KEY,async (err, data) => {
                    if (err) return throwError({
                        statusCode: 403,
                        errorCode: 'AUTHORIZATION_FAILED',
                        message: 'Xác thực người dùng không chính xác !'
                    })

                    const user = await userService.GetUserById(data.payload)

                    if (roles.indexOf(configs.USER_ROLE_ENUM.ALL) === -1)
                    {
                        if (roles.indexOf(user.role) === -1) return throwError({
                            statusCode: 403,
                            errorCode: 'AUTHORIZATION_FAILED',
                            message: 'Bạn không có quyền thực hiện !'
                        })
                    }

                    console.log('Xác thực thành công !')
                    req.user = user
                    next()
                })
            } catch (error) {
                return next(error)
            }
        }else {
            try {
                throwError({
                    statusCode: 403,
                    errorCode: 'AUTHORIZATION_FAILED',
                    message: 'Xác thực người dùng không chính xác !'
                })
            } catch (error) {
                return next(error)
            }
        }
    }
}

module.exports = {
    AuthenticateRoleJWT
}