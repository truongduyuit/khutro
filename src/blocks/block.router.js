const express = require('express')
const router = express.Router()

const {USER_ROLE_ENUM} = require('../../configs/app.config')

const {AuthenticateRoleJWT} = require('../../middlewares/authenticateRoleJWT')
const idValidator = require('../../helpers/idValidator.helper')
const {ValidateBody, ValidateQueryParam} = require('../../middlewares/validation')
const {BlockValidator, BlockDeleteManyValidator} = require('./block.validator')

const blockController = require('./block.controller')
router.get('/', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateQueryParam(idValidator), blockController.GetBlockById)
    .get('/owner-blocks', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), blockController.GetBlocksOwner)
    .post('/create', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateBody(BlockValidator), blockController.CreateBlock)
    .put('/update', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateBody(BlockValidator), blockController.UpdateBlock)
    .delete('/delete', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]),ValidateQueryParam(idValidator), blockController.DeleteBlock)
    .delete('/delete-many', AuthenticateRoleJWT([USER_ROLE_ENUM.OWNER]), ValidateBody(BlockDeleteManyValidator), blockController.DeleteBlocks)

module.exports = router