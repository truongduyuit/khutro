const roomModel = require('../rooms/room.model')
const roomService = require('../rooms/room.service')
const userModel = require('../users/user.model')
const _ = require('lodash')

const {USER_ROLE_ENUM} = require('../../configs/app.config')

const CreateCustomer = async (user, customer) => {
    try {
            if (customer.email) {
                let email = customer.email
                let user = await userModel.findOne({email})
                if (user) {
                    return {
                        error: {
                            message: 'Email đã được sử dụng !'
                        }
                    }
                }
            }

            const _userBlocks = user.blocks
            const _roomsOwner = await roomModel.find({
                block: {$in: _userBlocks}
            })


            for (let i =0; i < _roomsOwner.length; ++i){
                if (_roomsOwner[i]._id.toString() === customer.room){
                    const newCustomer = new userModel({
                        email: customer.email ? customer.email : '',
                        role: USER_ROLE_ENUM.CUSTOMER,
                        fullName: customer.fullName,
                        address: customer.address,
                        phoneNumber: customer.phoneNumber,
                        room: customer.room
                    })
                    await newCustomer.save()

                    _roomsOwner[i].customers.push(newCustomer._id)
                    await _roomsOwner[i].save()

                    return newCustomer
                }
            }
        return {
            error: {
                message: 'Phòng trọ không tồn tại !'
            }
        }
    } catch (error) {
        return new Error(error)
    }
}

const GetCustomersByOwner = async (user) => {
    try {
        const _userBlocks = user.blocks
        const _customersRoom = await roomModel.find({
            block: {$in: _userBlocks},
            isDeleted: false
        }).populate('user')

        if (_.isEmpty(_customersRoom)) return {
            error: {
                message: 'Bạn chưa có khách hàng nào !'
            }
        }

        let _customerIds = []
        for (let i =0; i < _customersRoom.length; i++){
            _customerIds = _.concat(_customerIds, _customersRoom[i].customers)
        }

        const _customers = await userModel.find({
            _id: {$in : _customerIds},
            isDeleted: false,
            role: USER_ROLE_ENUM.CUSTOMER,
        }, {email: 1, fullName: 1, address: 1, phoneNumber: 1}).populate('room', 'nameRoom')
        return _customers
    } catch (error) {
        return new Error(error)
    }
}

const GetCustomerById = async (user, customerId) => {
    try {
        const _customers = await GetCustomersByOwner(user)
        if (_customers.error) return {
            error: {
                message: _customers.error.message
            }
        }

        for (let i = 0; i< _customers.length; i++){
            if (_customers[i]._id.toString() === customerId){
                return _customers[i]
            }
        }

        return {
            error: {
                message: 'Không tìm thấy khách hàng !'
            }
        }
    } catch (error) {
        return new Error(error)
    }
}

const UpdateCustomer = async (user, customer) => {
    try {
            const _customer = await userModel.findOne({
                role: USER_ROLE_ENUM.CUSTOMER,
                isDeleted: false,
                _id: customer._id
            })

            if (!_customer) return {
                error: {
                    message: 'Khách hàng không tồn tại !'
                }
            }

            const _room = await roomService.GetRoomById(user._id.toString(), _customer.room)
            if(_room.error) return {
                error: {
                    message: 'Phòng của khách hàng không phải của bạn !'
                }
            }

            if (customer.email) {
                let _user = await userModel.findOne({email : customer.email, _id : {$ne: customer._id}})
                if (_user) {
                    return {
                        error: {
                            message: 'Email đã được sử dụng !'
                        }
                    }
                }
            }

            if (_customer.room._id.toString() !== customer.room){
                const _oldRoom = await roomModel.findById(_customer.room._id)
                const _newRoom = await roomModel.findById(customer.room)
                if (!_newRoom) return {
                    error: {
                        message: 'Phòng trọ không tồn tại !'
                    }
                }

                await _customer.updateOne({
                    email: customer.email ? customer.email : _customer.email,
                    fullName: customer.fullName ? customer.fullName : _customer.fullName,
                    address: customer.address ? customer.address : _customer.address,
                    phoneNumber: customer.phoneNumber ? customer.phoneNumber : _customer.phoneNumber,
                    room: customer.room
                })
                await _customer.save()

                _oldRoom.customers.remove(_customer._id)
                await _oldRoom.save()

                _newRoom.customers.push(_customer._id)
                await _newRoom.save()

                return {}
            }

            await _customer.updateOne({
                email: customer.email ? customer.email : _customer.email,
                fullName: customer.fullName ? customer.fullName : _customer.fullName,
                address: customer.address ? customer.address : _customer.address,
                phoneNumber: customer.phoneNumber ? customer.phoneNumber : _customer.phoneNumber
            })
            await _customer.save()

            return {}
    } catch (error) {
        return new Error(error)
    }
}

const DeleteCustomer = async (user, customerId) => {
    try {
        const _customer = await GetCustomerById(user, customerId)
        if (_customer.error) return {
            error: {
                message: _customer.error.message
            }
        }

        await _customer.updateOne({
            isDeleted: true
        })
        await _customer.save()
        return {}
    } catch (error) {
        return new Error(error)
    }
}

const DeleteCustomers = async (user, customerIds) => {
    try {
        let error = null
        for (let i =0; i < customerIds.length; i++){
            let _result = await DeleteCustomer(user, customerIds[i].toString())
            if (_result.error){
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
    CreateCustomer,
    GetCustomersByOwner,
    GetCustomerById,
    UpdateCustomer,
    DeleteCustomer,
    DeleteCustomers
}