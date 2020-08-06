const express = require('express')
const router = express.Router()

const {AuthenticateRoleJWT} = require('../../middlewares/authenticateRoleJWT')


const {ValidateBody} = require('../../middlewares/validation')
const {UserValidator, UserChangPasswordValidator, UserChangInfoValidator} = require('./user.validator')
const userFunction = require('./user.controller')

router.post('/register', ValidateBody(UserValidator), userFunction.Register)
      .post('/login', ValidateBody(UserValidator), userFunction.Login)
      .get('/confirm/:confirmToken', userFunction.ConfirmUser)
      .put('/change-password', AuthenticateRoleJWT('all'), ValidateBody(UserChangPasswordValidator), userFunction.ChangePassword)
      .put('/change-info', AuthenticateRoleJWT('all'), ValidateBody(UserChangInfoValidator), userFunction.ChangeInfo)

module.exports = router