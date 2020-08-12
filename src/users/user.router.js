const express = require('express')
const router = express.Router()

const {USER_ROLE_ENUM} = require('../../configs/app.config')

// const PassportRoleJWT = require('../../middlewares/passport')
const {AuthenticateRoleJWT} = require('../../middlewares/authenticateRoleJWT')
const {ValidateBody} = require('../../middlewares/validation')
const {UserValidator, UserChangPasswordValidator, UserChangInfoValidator, CustomerLogin} = require('./user.validator')

const userController = require('./user.controller')
router.post('/register', ValidateBody(UserValidator), userController.Register)
      .post('/login', ValidateBody(UserValidator), userController.Login)
      .post('/customer-login', ValidateBody(CustomerLogin), userController.CustomerLogin)
      .get('/confirm/:confirmToken', userController.ConfirmUser)
      .put('/change-password', AuthenticateRoleJWT([USER_ROLE_ENUM.ALL]), ValidateBody(UserChangPasswordValidator), userController.ChangePassword)
      .put('/change-info', AuthenticateRoleJWT([USER_ROLE_ENUM.ALL]), ValidateBody(UserChangInfoValidator), userController.ChangeInfo)

module.exports = router