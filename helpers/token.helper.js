const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const configs = require('../configs/app.config')

const GenerateToken = async payload => {
  try {
    const token = jwt.sign(
      {payload},
      configs.SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: configs.TOKEN_LIFE,
      }
    )
    return token
  } catch (error) {
    return new Error(error)
  }
}

const DecodePayload = async token => {
    try {
        return await jwt_decode(token)
    } catch (error) {
        return new Error(error)
    }
}

module.exports = {
  GenerateToken,
  DecodePayload
}