const {throwError} = require('../../helpers/responseToClient.helper')
const Code = require('./room.code')

const roomModel = require('./room.model')
const blockModel = require('../blocks/block.model')
const customerService = require('../customers/customer.service')

const CreateRoom = async (user, room) => {
    try {
        const rooms = await GetBlockRooms(user, room.block)
        for (let i = 0; i < rooms.length; ++i){
            if (rooms[i].nameRoom === room.nameRoom) {
                return throwError({
                    errorCode: Code.NAME_ROOM_EXIST,
                    message: 'Tên phòng đã tồn tại !'
                })
            }
        }

        const newRoom = new roomModel(room)
        const block = await blockModel.findOne({_id: room.block, owner: user._id})
        block.rooms.push(newRoom._id)

        await newRoom.save()
        await block.save()
        return newRoom
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CREATE_ROOM_FAILED
        return throwError(error)
    }
}
const GetBlockRooms = async (user, blockId) => {
    try {
        const rooms = await roomModel.find({
            $and: [{
                block: {$eq: blockId}
            }, {
                block: {$in: user.blocks}
            }]
        })
        return rooms
    } catch (error) {
        return throwError({
            errorCode: Code.GET_BLOCK_ROOM_FAILED,
            message: 'Lấy danh sách phòng thất bại !'
        })
    }
}

const GetRoomById = async (user, roomId) => {
    try {
        const room = await roomModel.findOne({
            _id: roomId,
            block: {$in: user.blocks}
        })

        return room
    } catch (error) {
        return throwError({
            errorCode: Code.GET_ROOM_BY_ID_FAILED,
            message: 'Lấy thông tin phòng thất bại !'
        })
    }
}

const GetRoomByCustomer = async (user) => {
    try {
        const rooms = await roomModel.find({
            customers: {$elemMatch: {$eq: user._id}}
        })

        return rooms
    } catch (error) {
        return throwError({
            errorCode: Code.GET_ROOMS_BY_CUSTOMER_FAILED,
            message: 'Lấy danh sách phòng thất bại !'
        })
    }
}
const UpdateRoom = async (user, newRoom, session) => {
    try {
        const rooms = await GetBlockRooms(user, newRoom.block)
        for (let i = 0; i < rooms.length; ++i){
            if (rooms[i]._id.toString() !== newRoom._id.toString() && rooms[i].nameRoom === newRoom.nameRoom) {
                throwError({
                    errorCode: Code.NAME_ROOM_EXIST,
                    message: 'Tên phòng đã tồn tại !'
                })
            }
        }

        const room = await GetRoomById(user, newRoom._id)

        // thay đổi khu trọ
        if (room.block !== newRoom.block) {
            const oldBlock = await blockModel.findOne({
                _id: room.block._id,
                owner: user._id
            })
            oldBlock.rooms.remove(room._id)

            const newBlock = await blockModel.findOne({
                _id: newRoom.block,
                owner: user._id
            })
            await oldBlock.save({session})
            await newBlock.rooms.push(room._id)
            await newBlock.save({session})
        }

        await room.updateOne({...newRoom}, {session})
        return newRoom
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.UPDATE_ROOM_FAILED
        return throwError(error)
    }
}

const DeleteRoom = async (user, roomId, session) => {
    try {
        const room = await GetRoomById(user, roomId)

        await Promise.all([
            customerService.DeleteCustomers(user, room.customers, session),
            room.updateOne({
                isDeleted: true
            }, {session})
        ])

        return room
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.DELETE_ROOM_FAILED
        return throwError(error)
    }
}

const DeleteRooms = async (user, roomIds, session) => {
    try {
        const deleteRoomPromises = []
        for (let i =0; i < roomIds.length; i++){
            const deleteRoomPromise = DeleteRoom(user, roomIds[i], session)
            deleteRoomPromises.push(deleteRoomPromise)
        }

        return await Promise.all(deleteRoomPromises)
    } catch (error) {
        return throwError(error)
    }
}

module.exports = {
    CreateRoom,
    GetBlockRooms,
    GetRoomById,
    GetRoomByCustomer,
    UpdateRoom,
    DeleteRoom,
    DeleteRooms
}