const express = require('express')
const router = express.Router()

const {USER_ROLE_ENUM} = require('../../configs/app.config')

// const PassportRoleJWT = require('../../middlewares/passport')
const {AuthenticateRoleJWT} = require('../../middlewares/authenticateRoleJWT')
const idValidator = require('../../helpers/idValidator.helper')
const {ValidateBody, ValidateQueryParam} = require('../../middlewares/validation')
const {CustomerValidator, CustomerChangInfoValidator, CustomerDeleteManyValidator} = require('./customer.validator')

const customerController = require('./customer.controller')
router.get('', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), customerController.GetCustomerById)
    .get('/owner-customers', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), customerController.GetCustomerByOwner)
    .post('/create', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateBody(CustomerValidator), customerController.CreateCustomer)
    .put('/update', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), ValidateBody(CustomerChangInfoValidator), customerController.UpdateCustomer)
    .delete('/delete', AuthenticateRoleJWT(USER_ROLE_ENUM.OWNER), ValidateQueryParam(idValidator), customerController.DeleteCustomer)
    .delete('/delete-many', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateBody(CustomerDeleteManyValidator), customerController.DeleteCustomers)


module.exports = router