const mongoose = require('mongoose')
const blockModel = require('./block.model')
const userService = require('../users/user.service')
const _ = require('lodash');

const GetBlocksOwner = async (userId) => {
    try {
        const user = await userService.GetUserById(userId)
        if (!user) return {
            error: {
                message: 'Người dùng không chính xác !'
            }
        }

        // if (user.Role !== 'owner') return {
        //     error: {
        //         message: 'Bạn không phải là quản lý khu trọ !'
        //     }
        // }

        const blocks = await blockModel.find({Owner: userId})
        return blocks
    } catch (error) {
        return new Error(error)
    }
}

const CreateBlock = async (userId, block) =>{
    try {
        const user = await userService.GetUserById(userId)
        if (!user) return {
            error: {
                message: 'Người dùng không chính xác !'
            }
        }

        const blocks = await blockModel.findOne({NameBlock: block.NameBlock})
        
        if (blocks) return {
            error: {
                message: 'Tên khu trọ đã tổn tại !'
            }
        }

        const newBlock = new blockModel(block)
        newBlock.Owner = user._id

        const result = await newBlock.save()
        if (!result) return {
            error: result.error
        }

        user.Blocks.push(newBlock._id)
        await user.save()


        return newBlock
    } catch (error) {
        return new Error(error)
    }
}

const UpdateBlock = async (userId, block) =>{
    try {
        const user = await userService.GetUserById(userId)
        if (!user) return {
            error: {
                message: 'Người dùng không chính xác !'
            }
        }

        if (user.Blocks.indexOf(block._id) === -1) return {
            error: {
                message: 'Khu trọ không phải của bạn!'
            }
        }

        const blocks = await blockModel.findOne({NameBlock: block.NameBlock, _id: !block.id})
        if (blocks) return {
            error: {
                message: 'Tên khu trọ đã tổn tại !'
            }
        }

        const newBlock = await blockModel.findByIdAndUpdate(block._id, block)
        return newBlock
    } catch (error) {
        return new Error(error)
    }
}

const DeleteBlock = async (userId, blockId) => {
    try {
        const user = await userService.GetUserById(userId)
        if (!user) return {
            error: {
                message: 'Người dùng không chính xác !'
            }
        }

        if (user.Blocks.indexOf(blockId) === -1) return {
            error: {
                message: 'Khu trọ không phải của bạn!'
            }
        }

        const newBlocks = _.remove(user.Blocks, id => id === blockId)
        await user.updateOne({Blocks: newBlocks})
        await user.save()

        const result = await blockModel.findByIdAndRemove(blockId)

        if (!result) return {
            error: {
                message: 'Khu trọ không tồn tại'
            }
        }

        return result
    } catch (error) {
        return new Error(error)
    }
}

const DeleteBlocks = async (userId, blockIds) => {
    try {
        let user = await userService.GetUserById(userId)
        if (!user) return {
            error: {
                message: 'Người dùng không chính xác !'
            }
        }

        const err = false
        let newBlocks =[...user.Blocks]
        blockIds.forEach( async blockId => {
            if (user.Blocks.indexOf(blockId) === -1) return {
                error: {
                    message: 'Khu trọ không phải của bạn!'
                }
            }

            result = await blockModel.findByIdAndRemove(blockId)
            if (!result) {
                err = true
                return
            }

            _.remove(newBlocks, id => id == blockId)

            await user.updateOne({Blocks: newBlocks})
        })

        await user.save()

        if (err) return {
            error: {
                message: 'Khu trọ không tồn tại'
            }
        }

        return {}
    } catch (error) {
        return new Error(error)
    }
}

module.exports = {
    GetBlocksOwner,
    CreateBlock,
    UpdateBlock,
    DeleteBlock,
    DeleteBlocks
}