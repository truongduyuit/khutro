const express = require('express')
const router = express.Router()

const {USER_ROLE_ENUM} = require('../../configs/app.config')

// const PassportRoleJWT = require('../../middlewares/passport')
const {AuthenticateRoleJWT} = require('../../middlewares/authenticateRoleJWT')
const idValidator = require('../../helpers/idValidator.helper')
const {ValidateBody, ValidateQueryParam} = require('../../middlewares/validation')
const {billValidator } = require('./bill.validator')

const billController = require('./bill.controller')
router.get('', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), billController.GetBillById)
    .get('/room-bills', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), billController.GetBillByRoom)
    .get('/owner-bills', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), billController.GetBillByOwner)
    .get('/customer-bills', AuthenticateRoleJWT([USER_ROLE_ENUM.CUSTOMER]), billController.GetBillByCustomer)
    .post('/create', AuthenticateRoleJWT(USER_ROLE_ENUM.OWNER), ValidateBody(billValidator), billController.CreateBill)
    .put('/update', AuthenticateRoleJWT(USER_ROLE_ENUM.OWNER), ValidateQueryParam(idValidator), ValidateBody(billValidator), billController.UpdateBill)
    .delete('/delete', AuthenticateRoleJWT(USER_ROLE_ENUM.OWNER), ValidateQueryParam(idValidator), billController.DeleteBill)

module.exports = router