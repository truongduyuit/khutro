const userService = require('./user.service')

const Register = async (req, res, next) => {
  try {
    const {email, password} = req.body
    const user = await userService.Register(email, password)

    if (user.error) return res.status(500).json({
      error: user.error
    })

    return res.status(201).json({
      message: "Đăng ký tài khoản thành công !",
      user
    })
  } catch (error) {
    return next(error)
  }
}

const Login = async (req, res, next) => {
  try {
    const {email, password} = req.body
    const result = await userService.Login(email, password)

    if (result.error){
      return res.status(500).json({
        error : {
            message: result.error,
        },
        link : result.link
      })
    }

    return res.status(200).json({
      message: "Đăng nhập thành công",
      result
    })
  } catch (error) {
    return next(error)
  }
}

const ConfirmUser = async (req, res, next) => {
  try {
    const {confirmToken} = req.params
    const result = await userService.ConfirmUser(confirmToken)

    if (result.error) return res.status(500).json({
      error: {
        message: result.error.message
      }
    })

    return res.status(200).json({
      message: "Xác thực email thành công!",
      token: result.token
    })
  } catch (error) {
    return next(error)
  }
}

const ChangePassword = async (req, res, next) => {
    try {
        const {userId} = req
        const {oldPassword, newPassword} = req.body

        if (oldPassword !== newPassword){
            const result = await userService.ChangePassword(userId, oldPassword, newPassword)
            if (result.error) return res.status(200).json({
                error: {
                        message: result.error.message
                }
            })
        }
        return res.status(200).json({
            message: 'Cập nhật mật khẩu thành công !',
        })
    } catch (error) {
        return next(error)
    }
}

const ChangeInfo = async (req, res, next) => {
    try {
        const {userId} = req
        const result = await userService.ChangeInfo(userId, req.body)

        if (result.error) return res.status(400).json({
            error: {
                message: result.error
            }
        })

        return res.status(200).json({
            message: 'Cập nhật thông tin thành công'
        })
    } catch (error) {
        return next(error)
    }
}

const CustomerLogin = async (req, res, next) => {
    try {
        const payload = req.body

        const _result = await userService.CustomerLogin(payload)
        console.log('_result', _result)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Đăng nhập thành công !',
            _result
        })
    } catch (error) {
        return next(error)
    }
}

module.exports = {
  Register,
  Login,
  ConfirmUser,
  ChangePassword,
  ChangeInfo,
  CustomerLogin
}