const express = require('express')
const router = express.Router()

const {USER_ROLE_ENUM} = require('../../configs/app.config')

// const PassportRoleJWT = require('../../middlewares/passport')
const {AuthenticateRoleJWT} = require('../../middlewares/authenticateRoleJWT')
const idValidator = require('../../helpers/idValidator.helper')
const {ValidateBody, ValidateQueryParam} = require('../../middlewares/validation')
const {serviceDetailValidator, ServiceDetailByRoomAndMonthValidator } = require('./service-detail.validator')

const serviceDetailController = require('./service-detail.controller')
router.get('', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator),serviceDetailController.GetServiceDetailById)
        .get('/owner-service-details', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]),serviceDetailController.GetServiceDetailByOwner)
        .get('/room-service-details', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(ServiceDetailByRoomAndMonthValidator),serviceDetailController.GetServiceDetailByRoomAndMonth)
        .post('/create', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateBody(serviceDetailValidator), serviceDetailController.CreateServiceDetail)
        .put('/update', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), ValidateBody(serviceDetailValidator), serviceDetailController.UpdateServiceDetail)
        .delete('/delete', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), serviceDetailController.DeleteServiceDetail)
module.exports = router