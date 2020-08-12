const express = require('express')
const router = express.Router()

const {USER_ROLE_ENUM} = require('../../configs/app.config')
const {AuthenticateRoleJWT} = require('../../middlewares/authenticateRoleJWT')
const idValidator = require('../../helpers/idValidator.helper')
const {ValidateBody, ValidateQueryParam} = require('../../middlewares/validation')

const roomController = require('./room.controller');
const {roomValidator, RoomDeleteManyValidator} = require('./room.validator')

router.get('', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), roomController.GetRoomById)
    .get('/owner-block-rooms', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), roomController.GetBlockRooms)
    .get('/customer-rooms', AuthenticateRoleJWT([USER_ROLE_ENUM.CUSTOMER]), roomController.GetRoomByCustomer)
    .post('/create', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateBody(roomValidator), roomController.CreateRoom)
    .put('/update', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), ValidateBody(roomValidator), roomController.UpdateRoom)
    .delete('/delete', AuthenticateRoleJWT(USER_ROLE_ENUM.OWNER), ValidateQueryParam(idValidator), roomController.DeleteRoom)
    .delete('/delete-many', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateBody(RoomDeleteManyValidator), roomController.DeleteRooms)
module.exports = router