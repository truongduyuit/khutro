const UserModel = require('./user.model')
const passwordHelper = require('../../helpers/password.helper')
const mailHelper = require('../../helpers/mail.helper')
const tokenHelper = require('../../helpers/token.helper')
const userModel = require('./user.model')
const Register = async (Email, Password) => {
  try {
    if (Password.length < 6)
        return {
            error: {
                message : 'Mật khẩu phải tối thiếu 6 ký tự'
            }
        }
    if (Password.length >= 32)
        return {
            error: {
                message : 'Mật khẩu tối đa 32 ký tự'
            }
        }

    let user = await UserModel.findOne({Email})
    if (user) {
        return {
            error: {
                message: 'Tài khoản đã tồn tại'
            }
        }
    }

    const newUser = new UserModel({
      Email,
      Password
    })

    const newPassword = await passwordHelper.HashPassword(Password)
    newUser.Password = newPassword

    await newUser.save()
    user = await UserModel.findOne({Email})
    return user
  } catch (error) {
    return new Error(error)
  }
}

const Login = async (Email, Password) => {
  try {
    const user = await UserModel.findOne({Email})
    if (!user){
      return {
        error: 'Email không tồn tại !',
        status: false
      }
    }

    const result = await passwordHelper.ComparePassword(Password, user.Password)
    if (result) {
        if (!user.Confirmed){

        const newToken = await tokenHelper.GenerateToken(user)

        await mailHelper.sendMail(
          '"KhuTro.Com" <khutro247@gmail.com>',
          user.Email,
          "Xác thực tài khoản",
          "Nhấp vào link dưới đây để xác thực tài khoản",
          `
            <b>Nhấp vào link dưới đây để xác thực tài khoản</b> <br/>
            <a href= "http://localhost:3001/api/user/confirm/${newToken}"> http://localhost:3001/api/user/confirm/${newToken} </a>
          `
        )

        return {
          error: 'Hãy vào gmail để xác thực tài khoản',
          link: `http://localhost:3001/api/user/confirm/${newToken}`
        }
        }

        const token = await tokenHelper.GenerateToken(user._id)
        return {
            role : user.Role,
            token
        }
    }

    return {
        error: {
            message: 'Tài khoản hoặc mật khẩu không chính xác !'
        }
    }
  } catch (error) {
    return new Error(error)
  }
}

const ConfirmUser = async token => {
    try {
        const {payload} = await tokenHelper.DecodePayload(token)
        const user = await UserModel.findOne({Email: payload.Email})

        if (user.Confirmed) return {
            error: {
                message: 'Email đã được xác thực'
            }
        }

        await UserModel.findByIdAndUpdate(payload._id, {Confirmed: true})
        return {
            token
        }
    } catch (error) {
        return new Error(error)
    }
}

const ChangePassword = async (userId, Password, newPassword) => {
    try {
        const user = await userModel.findById(userId)
        if (!user) return {
            error: {
                message: 'Người dùng không tồn tại !'
            }
        }

        const result = await passwordHelper.ComparePassword(Password, user.Password)
        if (!result) return {
                error: {
                    message: 'Mật khẩu hiện tại không chính xác !'
                }
            }
        const newPasswordHashed = await passwordHelper.HashPassword(newPassword)
        await user.updateOne({Password: newPasswordHashed})
        return {
            message: "Cập nhật mật khẩu thành công !"
        }
    } catch (error) {
        return new Error(error)
    }
}

const ChangeInfo = async (userId, info) => {
    try {
        const _user =await UserModel.findById(userId)

        if (!_user) return {
            error: {
                message: 'Người dùng không tồn tại !'
            }
        }

        await _user.updateOne({
            FullName: info.FullName ? info.FullName : _user.FullName,
            Address: info.Address ? info.Address : _user.Address,
            PhoneNumber: info.PhoneNumber ? info.PhoneNumber : _user.PhoneNumber
        })

        return _user
    } catch (error) {
        return {
            error: {
                message: 'Cập nhật thông tin thất bại !'
            }
        }
    }
}

const GetUserById = async userId => {
    try {
        const user = await UserModel.findById(userId)

        if (!user) return {
            error: {
                message: 'Người dùng không tồn tại'
            }
        }

        return user
    } catch (error) {
        return new Error(error)
    }
}

module.exports = {
  Register,
  Login,
  ConfirmUser,
  ChangePassword,
  ChangeInfo,
  GetUserById
}