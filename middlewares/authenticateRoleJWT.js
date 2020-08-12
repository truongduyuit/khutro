const jwt = require('jsonwebtoken')
const configs = require('../configs/app.config')

const userService = require('../src/users/user.service')

const AuthenticateRoleJWT = roles => {
    return async (req, res, next) => {
        const authHeader = await req.headers['authorization']

        if (authHeader){
            const token = authHeader.split(/\s+/).pop() || ''

            jwt.verify(token, configs.SECRET_KEY,async (err, userId) => {
                if (err) return res.status(403).json({
                    error: {
                        massage: 'Xác thực người dùng không chính xác !'
                    }
                })

                const user = await userService.GetUserById(userId.payload)
                let error = false

                if (roles.indexOf(configs.USER_ROLE_ENUM.ALL) === -1)
                {
                    if (roles.indexOf(user.role) === -1) {
                        error = true
                    }
                }

                if (error) return res.status(401).json({
                    error: {
                        message: 'Bạn không có quyền thực hiện !'
                    }
                })

                console.log('Xác thực thành công !')
                req.userId = userId.payload
                req.user = user
                next()
            })
        }else {
            return res.status(401).json({
                error: {
                    message: 'Bạn chưa đăng nhập !'
                }
            })
        }
    }
}

module.exports = {
    AuthenticateRoleJWT
}