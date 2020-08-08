const roomService = require('./room.service')

const CreateRoom = async (req, res, next) => {
    try {
        const {userId} = req
        const room = req.body

        const _result = await roomService.CreateRoom(userId, room)

        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(201).json({
            message: 'Thêm phòng mới thành công !'
        })
    } catch (error) {
        return next(error)
    }
}
const GetBlockRooms = async (req, res, next) =>{
    try {
        const {_id} = req.query
        const {userId} = req

        const _result = await roomService.GetBlockRooms(userId, _id)

        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy danh sách phòng thành công !',
            rooms: _result
        })
    } catch (error) {
        return next(error)
    }
}

const GetRoomById = async (req, res, next) =>{
    try {
        const {userId} = req
        const {_id} = req.query

        const _result = await roomService.GetRoomById(userId, _id)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy thông phòng thành công !',
            room: _result
        })
    } catch (error) {
        return next(error)
    }
}

const UpdateRoom = async (req, res, next) => {
    try {
        const {userId} = req
        const {_id} = req.query
        const _room = req.body

        if (_id !== _room._id) return res.status(500).json({
            error: {
                message: 'Mã phòng không trùng khớp'
            }
        })

        const _result = await roomService.UpdateRoom(userId, _room)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Cập nhật thông tin phòng thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteRoom = async (req, res, next) => {
    try {
        const {userId} = req
        const {_id} = req.query

        const result = await roomService.DeleteRoom(userId, _id)
        if (result.error) return res.status(500).json({
            error: {
                message: result.error.message
            }
        })

        return res.status(200).json({
            message: 'Xóa phòng thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteRooms = async (req, res, next) => {
    try {
        const {userId} = req
        const {_ids} = req.body

        const result = await roomService.DeleteRooms(userId, _ids)
        if (result.error) return res.status(500).json({
            error: {
                message: result.error.message
            }
        })

        return res.status(200).json({
            message: 'Xóa phòng thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    CreateRoom,
    GetBlockRooms,
    GetRoomById,
    UpdateRoom,
    DeleteRoom,
    DeleteRooms
}