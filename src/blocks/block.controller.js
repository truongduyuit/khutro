const blockService = require('./block.service')
const _ = require('lodash');
const {isEmpty} = require('lodash');
const configs = require('../../configs/app.config')

const GetBlocksOwner = async (req, res, next) => {
    try {
        const {userId} = req
        const result = await blockService.GetBlocksOwner(userId)

        if (result.error) return res.status(400).json({
            error: {
                message: result.error
            }
        })

        return res.status(200).json({
            message: 'Lấy danh sách khu trọ thành công !',
            blocks: result
        })
    } catch (error) {
        return next(error)
    }
}

const CreateBlock = async (req, res, next) => {
    try {
        const {userId} = req
        const block = req.body

        const result = await blockService.CreateBlock(userId, block)

        if (result.error) return res.status(500).json({
            error: {
                message: result.error.message
            }
        })

        return res.status(201).json({
            message: 'Tạo khu trọ thành công !',
            block: result
        })
    } catch (error) {
        return next(error)
    }
}

const UpdateBlock = async (req, res, next) => {
    try {
        const {userId} = req
        const block = req.body
        const {_id} = req.query

        if (block._id !== _id) return res.status(500).json({
            error: {
                message: 'Mã khu trọ không trùng khớp!',
            }
        })

        const result = await blockService.UpdateBlock(userId, block)
        if (result.error) return res.status(400).json({
            error: {
                message: result.error
            }
        })

        if (isEmpty(result)) return res.status(500).json({
            error: {
                message: 'Tên khu trọ đã tổn tại !'
            }
        })

        return res.status(201).json({
            message: 'Cập nhật thông tin trọ thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteBlock = async (req, res, next) => {
    try {
        const {userId} = req
        const idBlockQuery = req.query._id
        const blockIdBody = req.body._id

        if (idBlockQuery !== blockIdBody) return res.status(500).json({
            error: {
                message: 'Mã khu trọ không trùng khớp'
            }
        })

        const result = await blockService.DeleteBlock(userId, idBlockQuery)
        if (result.error) return res.status(500).json({
            error: {
                message: result.error.message
            }
        })

        return res.status(200).json({
            message: 'Xóa khu trọ thành công'
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteBlocks = async (req, res, next) => {
    try {
        const {userId} = req
        const idBlockQuery = req.query._id
        const blockIdBody = req.body._ids

        if (!_.isEqual(idBlockQuery, blockIdBody)) return res.status(500).json({
            error: {
                message: 'Mã khu trọ không trùng khớp'
            }
        })

        const result = await blockService.DeleteBlocks(userId, blockIdBody)
        if (result.error) return res.status(500).json({
            error: {
                message: result.error.message
            }
        })

        return res.status(200).json({
            message: 'Xóa khu trọ thành công'
        })
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    GetBlocksOwner,
    CreateBlock,
    UpdateBlock,
    DeleteBlock,
    DeleteBlocks
}