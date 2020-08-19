const mongoose = require('mongoose')

const {responseToClient} = require('../../helpers/responseToClient.helper')
const logger = require('../../helpers/logger')
const blockService = require('./block.service')

const CreateBlock = async (req, res, next) => {
    try {
        const {user} = req
        const block = req.body

        const newBlock = await blockService.CreateBlock(user, block)
        logger.log('info', req.originalUrl)
        return responseToClient(res, {
            statusCode: 201,
            data: newBlock,
        })
    } catch (error) {
        return next(error)
    }
}
const GetBlocksOwner = async (req, res, next) => {
    try {
        const {user} = req
        const blocks = await blockService.GetBlocksOwner(user)

        logger.log('info', req.originalUrl)
        return responseToClient(res, {
            data: blocks
        })
    } catch (error) {
        return next(error)
    }
}

const GetBlockById = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const block = await blockService.GetBlockById(user, _id)

        logger.log('info', req.originalUrl)
        return responseToClient(res, {
            data: block
        })
    } catch (error) {
        return next(error)
    }
}

const UpdateBlock = async (req, res, next) => {
    try {
        const {user} = req
        const newBlock = req.body

        await blockService.UpdateBlock(user, newBlock)
        logger.log('info', req.originalUrl)
        return responseToClient(res, {
            data: newBlock
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteBlock = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {user} = req
        const {_id} = req.query

        const block = await blockService.DeleteBlock(user, _id, session)

        logger.log('info', req.originalUrl)
        await session.commitTransaction()
        return responseToClient(res, {
            data: block
        })
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
    }
}

const DeleteBlocks = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {user} = req
        const {_ids} = req.body

        const blocks = await blockService.DeleteBlocks(user, _ids, session)
        logger.log('info', req.originalUrl)
        await session.commitTransaction()
        return responseToClient(res, {
            data: blocks
        })
    }  catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
    }
}

module.exports = {
    GetBlocksOwner,
    GetBlockById,
    CreateBlock,
    UpdateBlock,
    DeleteBlock,
    DeleteBlocks
}