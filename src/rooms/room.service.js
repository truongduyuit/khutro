const mongoose = require('mongoose')
const _ = require('lodash')

const roomModel = require('./room.model')
const blockModel = require('../blocks/block.model')

const CreateRoom = async (userId, room) => {
    try {
        const _rooms = await GetBlockRooms(userId, room.block)
        if (_rooms.error) return {
            error:{
                message: _rooms.error.message
            }
        }

        let _error= false
        _rooms.forEach(_room =>{
            if (_room.nameRoom === room.nameRoom) {
                _error = true
                return _error
            }
        })
        if (_error)  return {
            error:{
                message: 'Tên phòng đã tồn tại !'
            }
        }

        const _newRoom = new roomModel(room)
        await _newRoom.save()

        const _block = await blockModel.findById(room.block)
        _block.rooms.push(_newRoom._id)
        await _block.save()

        return "ok"
    } catch (error) {
        return new Error(error)
    }
}
const GetBlockRooms = async (userId, blockId) => {
    try {
        const _block = await blockModel.findOne({
            _id: blockId,
            owner: userId
        })

        if (_block.error) return {
            error:{
                message: _block.error.message
            }
        }
        const _rooms = await roomModel.find({block: blockId}).populate('block')


        if (_rooms.error) return {
            error:{
                message: 'Lấy danh sách phòng thất bại !'
            }
        }

        return _rooms
    } catch (error) {
        return new Error(error)
    }
}

const GetRoomById = async (userId, roomId) => {
    try {
        const _room = await roomModel.findOne({_id: roomId}).populate('block')

        if (!_room) return {
            error:{
                message: 'Phòng không tồn tại !'
            }
        }

        if (userId !== _room.block.owner.toString())  return {
            error:{
                message: 'Không tìm thấy thông tin phòng !'
            }
        }

        return _room
    } catch (error) {
        return new Error(error)
    }
}

const UpdateRoom = async (userId, room) => {
    try {
        const _room = await GetRoomById(userId, room._id)
        if (_room.error) return {
            error:{
                message: _room.error.message
            }
        }

        // thay đổi khu trọ
        if (_room.block._id.toString() !== room.block) {

            const _oldBlock = await GetBlockById(userId, _room.block._id.toString())
            if (_oldBlock.error) return {
                error: {
                    message: _oldBlock.error.message
                }
            }

            await _room.updateOne({
                nameRoom: room.nameRoom ? room.nameRoom : _room.nameRoom,
                floor: room.floor ? room.floor : _room.floor,
                square: room.square ? room.square : _room.square,
                description: room.description ? room.description : _room.description,
                maxPeople: room.maxPeople ? room.maxPeople : _room.maxPeople,
                block: room.block ? room.block : _room.block
            })
            await _room.save()

            const oldRooms = _.remove(_oldBlock.Rooms, id => id === _room.id)
            await _oldBlock.updateOne({Rooms: oldRooms})
            await _oldBlock.save()

            const _newBlock = await GetBlockById(userId, room.block)
            await _newBlock.Rooms.push(_room._id)
            await _newBlock.save()

            return "okk"
        }

        await _room.updateOne({
            nameRoom: room.nameRoom ? room.nameRoom : _room.nameRoom,
            floor: room.floor ? room.floor : _room.floor,
            square: room.square ? room.square : _room.square,
            description: room.description ? room.description : _room.description,
            maxPeople: room.maxPeople ? room.maxPeople : _room.maxPeople
        })
        await _room.save()

        return "ok"
    } catch (error) {
        return new Error(error)
    }
}

const DeleteRoom = async (userId, roomId) => {
    try {
        const _room = await GetRoomById(userId, roomId)
        if (_room.error) return {
            error:{
                message: _room.error.message
            }
        }

        if (userId !== _room.block.Owner.toString()) return {
            error:{
                message: 'Phòng không phải của bạn'
            }
        }

        await _room.updateOne({
            isDeleted: true
        })
        await _room.save()

        return "ok"
    } catch (error) {
        return new Error(error)
    }
}

const DeleteRooms = async (userId, roomIds) => {
    try {
        roomIds.forEach(async roomId => {
            let _room = await GetRoomById(userId, roomId)
            if (_room.error) return {
                error:{
                    message: _room.error.message
                }
            }

            if (userId !== _room.block.owner.toString()) return {
                error:{
                    message: 'Phòng không phải của bạn'
                }
            }

            await _room.updateOne({
                isDeleted: true
            })
            await _room.save()
        })

        return "ok"
    } catch (error) {
        return new Error(error)
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