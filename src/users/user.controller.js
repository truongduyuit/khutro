const {responseToClient} = require('../../helpers/responseToClient.helper')
const userService = require('./user.service')

module.exports.Register = async (req, res, next) => {
  try {
    const {email, password} = req.body
    const user = await userService.Register(email, password)

    return responseToClient(res, {statusCode: 201, data: user})
  } catch (error) {
    return next(error)
  }
}

module.exports.Login = async (req, res, next) => {
  try {
    const {email, password} = req.body
    const roleAndToken = await userService.Login(email, password)

    return responseToClient(res, {data: roleAndToken})
  } catch (error) {
    return next(error)
  }
}

module.exports.ConfirmUser = async (req, res, next) => {
  try {
    const {confirmToken} = req.params
    const token = await userService.ConfirmUser(confirmToken)

    return responseToClient(res, {data: token})
  } catch (error) {
    return next(error)
  }
}

module.exports.ChangePassword = async (req, res, next) => {
    try {
        const {userId} = req
        const {oldPassword, newPassword} = req.body
        if (oldPassword !== newPassword) await userService.ChangePassword(userId, oldPassword, newPassword)
        
        return responseToClient(res)
    } catch (error) {
        return next(error)
    }
}

module.exports.ChangeInfo = async (req, res, next) => {
    try {
        const {userId} = req
        const user = await userService.ChangeInfo(userId, req.body)

        return responseToClient(res, {data: user})
    } catch (error) {
        return next(error)
    }
}

module.exports.CustomerLogin = async (req, res, next) => {
    try {
        const payload = req.body
        const roleAndToken = await userService.CustomerLogin(payload)

        return responseToClient(res, {data: roleAndToken})
    } catch (error) {
        return next(error)
    }
}