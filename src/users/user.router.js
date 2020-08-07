const express = require('express')
const router = express.Router()

const {USER_ROLE_ENUM} = require('../../configs/app.config')

// const PassportRoleJWT = require('../../middlewares/passport')
const {AuthenticateRoleJWT} = require('../../middlewares/authenticateRoleJWT')
const {ValidateBody} = require('../../middlewares/validation')
const {UserValidator, UserChangPasswordValidator, UserChangInfoValidator} = require('./user.validator')

const userFunction = require('./user.controller')
router.post('/register', ValidateBody(UserValidator), userFunction.Register)
      .post('/login', ValidateBody(UserValidator), userFunction.Login)
      .get('/confirm/:confirmToken', userFunction.ConfirmUser)
      .put('/change-password', AuthenticateRoleJWT([USER_ROLE_ENUM.ALL]), ValidateBody(UserChangPasswordValidator), userFunction.ChangePassword)
      .put('/change-info', AuthenticateRoleJWT([USER_ROLE_ENUM.ALL]), ValidateBody(UserChangInfoValidator), userFunction.ChangeInfo)

module.exports = router