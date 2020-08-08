const express = require('express')
const router = express.Router()

const {USER_ROLE_ENUM} = require('../../configs/app.config')
const {AuthenticateRoleJWT} = require('../../middlewares/authenticateRoleJWT')
const idValidator = require('../../helpers/idValidator.helper')
const {ValidateBody, ValidateQueryParam} = require('../../middlewares/validation')

const serviceController = require('./service.controller')
const {serviceValidator, ServiceDeleteManyValidator} = require('./service.validator')


router.get('/', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), serviceController.GetServiceById)
    .get('/owner-block-services', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), serviceController.GetBlockServices)
    .post('/create', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateBody(serviceValidator), serviceController.CreateService)
    .put('/update', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), ValidateBody(serviceValidator), serviceController.UpdateService)
    .delete('/delete', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), serviceController.DeleteService)
    .delete('/delete-many', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateBody(ServiceDeleteManyValidator) , serviceController.DeleteServices)

module.exports = router