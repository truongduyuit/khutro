const express = require('express')
const router = express.Router()

const blockController = require('./block.controller')

const {AuthenticateRoleJWT} = require('../../middlewares/authenticateRoleJWT')
const idValidator = require('../../helpers/idValidator.helper')
const {ValidateBody, ValidateQueryParam} = require('../../middlewares/validation')
const {BlockValidator, BlockDeleteManyValidator} = require('./block.validator')


router.get('/owner-blocks', AuthenticateRoleJWT('owner'), blockController.GetBlocksOwner)
    .post('/create', AuthenticateRoleJWT('owner'), ValidateBody(BlockValidator), blockController.CreateBlock)
    .put('/update', AuthenticateRoleJWT('owner'),ValidateQueryParam(idValidator) ,ValidateBody(BlockValidator), blockController.UpdateBlock)
    .delete('/delete', AuthenticateRoleJWT('owner'),ValidateQueryParam(idValidator), ValidateBody(idValidator), blockController.DeleteBlock)
    .delete('/delete-many', AuthenticateRoleJWT('owner'), ValidateBody(BlockDeleteManyValidator), blockController.DeleteBlocks)

module.exports = router