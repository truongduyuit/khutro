const _ = require('lodash')

const roomModel = require('./room.model')
const blockModel = require('../blocks/block.model')
const customerService = require('../customers/customer.service')
const userModel = require('../users/user.model')

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
            owner: userId,
            isDeleted: false
        })
        console.log('_block', _block)
        if (!_block) return {
            error:{
                message: 'Khu trọ không tồn tại !'
            }
        }

        if (_block.error) return {
            error:{
                message: _block.error.message
            }
        }
        const _rooms = await roomModel.find({block: blockId, isDeleted: false}).populate('block')


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
        const _room = await roomModel.findOne({_id: roomId, isDeleted: false}).populate('block')
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

const GetRoomByCustomer = async (user) => {
    try {
        const _rooms = await roomModel.find({
            customers: {$elemMatch: {$eq: user._id}},
            isDeleted: false
        }).populate('customers')

        if (!_rooms) return {
            error: {
                message: 'Lấy danh sách phòng thất bại !'
            }
        }

        return _rooms
    } catch (error) {
        return new Error(error)
    }
}
const UpdateRoom = async (userId, room) => {
    try {
        const _rooms = await GetBlockRooms(userId, room.block)
        if (_rooms.error) return {
            error:{
                message: _rooms.error.message
            }
        }

        let _error = false
        _rooms.forEach(_room => {
            if (_room.nameRoom === room.nameRoom && _room._id.toString() !== room._id) {
                _error = true
                return
            }
        })
        if (_error) return {
            error: {
                message: 'Tên phòng đã tồn tại !'
            }
        }


        const _room = await GetRoomById(userId, room._id)
        if (_room.error) return {
            error:{
                message: _room.error.message
            }
        }

        // thay đổi khu trọ
        if (_room.block._id.toString() !== room.block) {
            const _oldBlock = await blockModel.findOne({
                _id: _room.block._id,
                owner: userId
            })
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

            const oldRooms = _.remove(_oldBlock.rooms, id => id === _room.id)
            await _oldBlock.updateOne({rooms: oldRooms})
            await _oldBlock.save()

            const _newBlock = await blockModel.findOne({
                _id: room.block,
                owner: userId
            })
            await _newBlock.rooms.push(_room._id)
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
        const _user = await userModel.findById(userId)
        const _room = await GetRoomById(userId, roomId)
        if (_room.error) return {
            error:{
                message: _room.error.message
            }
        }

        const _result = await customerService.DeleteCustomers(_user, _room.customers)
        if (_result.error) return {
            error: {
                message: _result.error.message
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
        let error = null
        for (let i =0; i < roomIds.length; i++){
            const _result = await DeleteRoom(userId, roomIds[i].toString())
            if(_result.error) {
                error = _result.error
                break
            }
        }
        return {error}
    } catch (error) {
        return new Error(error)
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