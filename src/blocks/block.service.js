const {throwError} = require('../../helpers/responseToClient.helper')
const Code = require('./block.code')

const blockModel = require('./block.model')
const roomService = require('../rooms/room.service')
const serviceService = require('../services/service.service')

module.exports.CreateBlock = async (user, block) =>{
    try {
        const blockSameName = await blockModel.findOne({nameBlock: block.nameBlock, owner: user._id})
        if (blockSameName) {
            return throwError({
                statusCode: 500,
                errorCode: Code.NAME_BLOCK_EXIST,
                message: 'Tên khu trọ đã tồn tại !'
            })
        }

        const newBlock = new blockModel(block)
        newBlock.owner = user._id
        await newBlock.save()

        user.blocks.push(newBlock._id)
        await user.save()

        return newBlock
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CREATE_BLOCK_FAILED
        return throwError(error)
    }
}
module.exports.GetBlocksOwner = async (user) => {
    try {
        const blocks = await blockModel.find({owner: user._id})
        return blocks
    } catch (error) {
        return throwError({
            statusCode: 500,
            errorCode: Code.GET_BLOCKS_BY_OWNER_FAILED,
            message: 'Lấy danh sách khu trọ thất bại !'
        })
    }
}

module.exports.GetBlockById = async (user, blockId) => {
    try {
        const block = await blockModel.findOne({
            _id: blockId,
            owner: user._id
        })
        if (!block ) return throwError({
            statusCode: 500,
            errorCode: Code.GET_BLOCKS_BY_ID_FAILED,
            message: 'Lấy thông tin khu trọ thất bại !'
        })

        return block
    } catch (error) {
        return throwError(error)
    }
}

module.exports.UpdateBlock = async (user, newBlock) =>{
    try {
        const block = await GetBlockById(user, newBlock._id)

        const newBlockSameName = await blockModel.findOne({
            _id: {$ne : newBlock._id},
            nameBlock: newBlock.nameBlock,
            owner: user._id
        })
        if (newBlockSameName) return throwError({
            statusCode: 500,
            errorCode: Code.NAME_BLOCK_EXIST,
            message: 'Tên khu trọ đã tồn tại !'
        })

        await block.updateOne({...newBlock})

        return newBlock
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.UPDATE_BLOCK_FAILED
        return throwError(error)
    }
}

module.exports.DeleteBlock = async (user, blockId, session) => {
    try {
        const block = await GetBlockById(user, blockId)

        await Promise.all([
            roomService.DeleteRooms(user, block.rooms, session),
            serviceService.DeleteServices(user, block.services, session),
            block.updateOne({
                isDeleted: true
            }, {session})
        ])

        return block
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.DELETE_BLOCK_FAILED
        return throwError(error)
    }
}

module.exports.DeleteBlocks = async (user, blockIds, session) => {
    try {
        const deleteBlockPromises = []
        for (let i =0; i < blockIds.length; ++i) {
            const deleteBlockPromise = DeleteBlock(user, blockIds[i], session)
            deleteBlockPromises.push(deleteBlockPromise)
        }
        return await Promise.all(deleteBlockPromises)
    } catch (error) {
        return throwError(error)
    }
}