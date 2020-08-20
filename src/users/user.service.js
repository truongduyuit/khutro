const passwordHelper = require('../../helpers/password.helper')
const mailHelper = require('../../helpers/mail.helper')
const tokenHelper = require('../../helpers/token.helper')

const userModel = require('./user.model')
const Code = require('./user.code')
const {throwError} = require('../../helpers/responseToClient.helper')

module.exports.Register = async (email, password) => {
  try {
    if (password.length < 6) return throwError({
        errorCode: Code.PASSWORD_LEAST_6_CHARACTERS,
        message : 'Mật khẩu phải tối thiếu 6 ký tự !'
    })
    if (password.length >= 32) return throwError({
        errorCode: Code.PASSWORD_MAX_32_CHARACTERS,
        message : 'Mật khẩu tối đa 32 ký tự !'
    })

    let user = await userModel.findOne({email})
    if (user) return throwError({
        errorCode: Code.EMAIL_IS_EXIST,
        message: 'Email đã được sử dụng !'
    })

    const newUser = new userModel({email, password})
    const newPassword = await passwordHelper.HashPassword(password)
    newUser.password = newPassword

    await newUser.save()
    return newUser
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CREATE_USER_FAILED
        return throwError(error)
    }
}

module.exports.Login = async (email, password) => {
  try {
    const user = await userModel.findOne({email})
    if (!user) return throwError({
        errorCode: Code.EMAIL_IS_EXIST,
        message: 'Email không tồn tại !'
    })

    const result = await passwordHelper.ComparePassword(password, user.password)
    if (result) {
        if (!user.confirmed){
            const newToken = await tokenHelper.GenerateToken(user)

            await mailHelper.sendMail(
            '"KhuTro.Com" <khutro247@gmail.com>',
            user.email,
            "Xác thực tài khoản",
            "Nhấp vào link dưới đây để xác thực tài khoản",
            `
                <b>Nhấp vào link dưới đây để xác thực tài khoản</b> <br/>
                <a href= "http://localhost:3001/api/user/confirm/${newToken}"> http://localhost:3001/api/user/confirm/${newToken} </a>
            `
            )

            return throwError({
                errorCode: Code.EMAIL_IS_EXIST,
                message: 'Hãy vào gmail để xác thực tài khoản !',
                options: {
                    link: `http://localhost:3001/api/user/confirm/${newToken}`
                }
            })
        }

        const token = await tokenHelper.GenerateToken(user._id)
        return {
            role : user.role,
            token
        }
    }

    return throwError({
        errorCode: Code.EMAIL_OR_PASSWORD_FALSE,
        message: 'Email hoặc mật khẩu không chính xác !'
    })
  } catch (error) {
    if (!error.errorCode) error.errorCode = Code.LOGIN_FAILED
    return throwError(error)
  }
}

module.exports.ConfirmUser = async token => {
    try {
        const {payload} = await tokenHelper.DecodePayload(token)
        const user = await userModel.findOne({email: payload.email})

        if (user.confirmed) return throwError({
            errorCode: Code.EMAIL_IS_CONFIRMED,
            message: 'Email đã được xác thực !'
        })

        await userModel.findByIdAndUpdate(payload._id, {confirmed: true})
        return token
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CONFIRM_EMAIL_FAILED
        return throwError(error)
    }
}

module.exports.ChangePassword = async (userId, password, newPassword) => {
    try {
        const user = await userModel.findById(userId)
        if (!user) return throwError({
            errorCode: Code.USER_NOT_EXIST,
            message: 'Người dùng không tồn tại !'
        })


        const result = await passwordHelper.ComparePassword(password, user.password)
        if (!result)  return throwError({
            errorCode: Code.CURRENT_PASSWORD_FALSE,
            message: 'Mật khẩu hiện tại không chính xác !'
        })

        const newPasswordHashed = await passwordHelper.HashPassword(newPassword)
        await user.updateOne({password: newPasswordHashed})
        return {}
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CHANGE_PASSWORD_FALSE
        return throwError(error)
    }
}

module.exports.ChangeInfo = async (userId, info) => {
    try {
        const user = await userModel.findById(userId)

        if (!user) return throwError({
            errorCode: Code.USER_NOT_EXIST,
            message: 'Người dùng không tồn tại !'
        })

        await user.updateOne({
            fullName: info.fullName ? info.fullName : user.fullName,
            address: info.address ? info.address : user.address,
            phoneNumber: info.phoneNumber ? info.phoneNumber : user.phoneNumber
        })

        return user
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CHANGE_PASSWORD_FALSE
        return throwError(error)
    }
}

module.exports.GetUserById = async userId => {
    try {
        const user = await userModel.findById(userId)

        if (!user) return throwError({
            errorCode: Code.USER_NOT_EXIST,
            message: 'Người dùng không tồn tại !'
        })

        return user
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.GET_USER_FAILED
        return throwError(error)
    }
}

module.exports.CustomerLogin = async (payload) => {
    try {
        const user = await userModel.findOne({ email: payload.email, role: 'customer' })

        if (!user) return throwError({
            errorCode: Code.EMAIL_IS_EXIST,
            message: 'Email không tồn tại !'
        })

        if (!payload.password) {
            if (!user.password) {

                const newPassword = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString()
                await mailHelper.sendMail(
                '"KhuTro.Com" <khutro247@gmail.com>',
                `${payload.email}`,
                "Xác thực tài khoản",
                "Nhấp vào link dưới đây để xác thực tài khoản",
                `
                    <span>Mật khẩu đăng nhập <b>KhuTro.Com</b> của bạn là: <b>${newPassword}</b></span> <br/>
                `
                )

                await user.updateOne({
                    password: await passwordHelper.HashPassword(newPassword),
                    confirmed: true
                })
                await user.save()

                return throwError({
                    errorCode: Code.GET_PASSWORD_IN_MAIL,
                    message: 'Vào mail để nhận password mới !'
                })
            }

                return throwError({
                    errorCode: Code.LOGIN_FAILED,
                    message: 'Đăng nhập thất bại !'
                })
        }

        const roleAndToken = await Login(payload.email, payload.password)
        return roleAndToken
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.LOGIN_FAILED
        return throwError(error)
    }
}
