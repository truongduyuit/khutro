const mongoose = require('mongoose')
const blockModel = require('./block.model')
const userModel = require('../users/user.model')
const roomService = require('../rooms/room.service')
const serviceService = require('../services/service.service')
const userService = require('../users/user.service')
const _ = require('lodash');

const CreateBlock = async (userId, block) =>{
    try {
        const blocks = await blockModel.findOne({nameBlock: block.nameBlock})
        if (blocks) return {
            error: {
                message: 'Tên khu trọ đã tổn tại !'
            }
        }

        const newBlock = new blockModel(block)
        newBlock.owner = userId

        const result = await newBlock.save()
        if (!result) return {
            error: result.error
        }

        const _user = await userModel.findById(userId)
        _user.blocks.push(newBlock._id)
        await _user.save()

        return newBlock
    } catch (error) {
        return new Error(error)
    }
}
const GetBlocksOwner = async (userId) => {
    try {
        const user = await userService.GetUserById(userId)
        if (!user) return {
            error: {
                message: 'Người dùng không chính xác !'
            }
        }

        const blocks = await blockModel.find({owner: userId, isDeleted: false}).populate('rooms')
        return blocks
    } catch (error) {
        return new Error(error)
    }
}

const GetBlockById = async (userId, blockId) => {
    try {
        const _blocks = await GetBlocksOwner(userId)

        let result = null
        _blocks.forEach(block => {
            if (block._id.toString() === blockId && block.isDeleted === false){
                result = block
                return
            }
        })

        if (!result) return {
            error: {
                message: 'Không tìm thấy khu trọ !'
            }
        }

        return result
    } catch (error) {
        return new Error(error)
    }
}

const UpdateBlock = async (userId, block) =>{
    try {
        const _block = await GetBlockById(userId, block._id)
        if (_block.error) return {
            error: {
                message: _block.error.message
            }
        }

        const _blocks = await GetBlocksOwner(userId)
        _blocks.forEach(item => {
            if (item._id.toString() !== block._id && item.nameBlock.toString() === block.nameBlock) return {
                error: {
                    message: 'Tên khu trọ đã tổn tại !'
                }
            }
        })


        await _block.updateOne({
            nameBlock : block.nameBlock ? block.nameBlock : _block.nameBlock,
            address : block.address ? block.address : _block.address,
            description : block.description ? block.description : _block.description,
            images : block.images ? block.images : _block.images,
            priceFrom : block.priceFrom ? block.priceFrom : _block.priceFrom,
            priceTo : block.priceTo ? block.priceTo : _block.priceTo,
        })
        await _block.save()
        return _block
    } catch (error) {
        return new Error(error)
    }
}

const DeleteBlock = async (userId, blockId) => {
    try {
        const _block = await blockModel.findById(blockId)
        if (!_block) return {
            error: {
                message: 'Khu trọ không tồn tại !'
            }
        }

        if (userId !== _block.owner.toString()) return {
            error: {
                message: 'Khu trọ không phải của bạn !'
            }
        }

        await roomService.DeleteRooms(userId, _block.rooms)
        await serviceService.DeleteServices(userId, _block.services)
        await _block.updateOne({
            isDeleted: true
        })
        await _block.save()

        return "ok"
    } catch (error) {
        return new Error(error)
    }
}

const DeleteBlocks = async (userId, blockIds) => {
    try {
        const _blocks = await blockModel.find({owner: userId})
        if (_.isEmpty(_blocks)) return {
            error: {
                message: 'Khu trọ không tồn tại !'
            }
        }
        let _error = true
        _blocks.forEach(block => {
            if (_.indexOf(blockIds, block._id.toString()) === -1){
                _error = false
                return
            }
        })

        if (_error) return {
            error: {
                message: 'Danh sách mã khu trọ không đúng !'
            }
        }

        blockIds.forEach(blockId => {
            return DeleteBlock(userId, blockId)
        })

        return "ok"
    } catch (error) {
        return new Error(error)
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