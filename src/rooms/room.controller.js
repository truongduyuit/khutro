const mongoose = require('mongoose')

const {responseToClient} = require('../../helpers/responseToClient.helper')
const roomService = require('./room.service')

const CreateRoom = async (req, res, next) => {
    try {
        const {user} = req
        const room = req.body

        const newRoom = await roomService.CreateRoom(user, room)

        return responseToClient(res, {
            data: newRoom
        })
    } catch (error) {
        return next(error)
    }
}
const GetBlockRooms = async (req, res, next) =>{
    try {
        const {user} = req
        const {_id} = req.query

        const rooms = await roomService.GetBlockRooms(user, _id)
        return responseToClient(res, {
            data: rooms
        })
    } catch (error) {
        return next(error)
    }
}

const GetRoomById = async (req, res, next) =>{
    try {
        const {user} = req
        const {_id} = req.query

        const room = await roomService.GetRoomById(user, _id)
        return responseToClient(res, {
            data: room
        })
    } catch (error) {
        return next(error)
    }
}

const GetRoomByCustomer = async (req, res, next) => {
    try {
        const {user} = req

        const rooms = await roomService.GetRoomByCustomer(user)
        return responseToClient(res, {
            data: rooms
        })
    } catch (error) {
        return next(error)
    }
}

const UpdateRoom = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {user} = req
        const newRoom = req.body

        await roomService.UpdateRoom(user, newRoom, session)

        await session.commitTransaction()
        return responseToClient(res, {
            data: newRoom
        })
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
    }
}

const DeleteRoom = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {user} = req
        const {_id} = req.query

        const room = await roomService.DeleteRoom(user, _id, session)
        await session.commitTransaction()
        return responseToClient(res, {
            data: room
        })
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
    }
}

const DeleteRooms = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {user} = req
        const {_ids} = req.body

        const rooms = await roomService.DeleteRooms(user, _ids, session)

        await session.commitTransaction()
        return responseToClient(res, {
            data: rooms
        })
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
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