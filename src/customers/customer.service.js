const _ = require('lodash')

const {throwError} = require('../../helpers/responseToClient.helper')
const Code = require('./customer.code')

const {USER_ROLE_ENUM} = require('../../configs/app.config')
const roomModel = require('../rooms/room.model')
const userModel = require('../users/user.model')
const blockModel = require('../blocks/block.model')

module.exports.CreateCustomer = async (user, customer) => {
    try {
        if (customer.email) {
            let user = await userModel.findOne({email: customer.email, role: USER_ROLE_ENUM.OWNER})
            if (user) return throwError({
                errorCode: Code.EMAIL_IS_EXIST,
                message: 'Email đã được sử dụng !'
            })
        }

        const block = await blockModel.findOne({
            rooms: {$elemMatch: {$eq: customer.room}},
            owner: user._id
        })
        if (!block) return throwError({
            errorCode: Code.ROOM_NOT_EXIST,
            message: 'Phòng trọ không tồn tại !'
        })

        const room = await roomModel.findById(customer.room)
        const currentNumberPeople = await userModel.find({room: customer.room, isDeleted: false})
        if (room.maxPeople === currentNumberPeople.length) {
            return throwError({
                errorCode: Code.ROOM_IS_FULL,
                message: 'Phòng đã đủ người !'
            })
        }

        const newCustomer = new userModel({...customer, role: USER_ROLE_ENUM.CUSTOMER})
        room.customers.push(newCustomer._id)

        await room.save()
        await newCustomer.save()
        return newCustomer
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CREATE_CUSTOMER_FAILED
        return throwError(error)
    }
}

module.exports.GetCustomersByOwner = async (user) => {
    try {
        const userRooms = await roomModel.find({
            block: {$in: user.blocks}
        })

        let customerIds = []
        for (let i =0; i < userRooms.length; i++){
            customerIds = _.concat(customerIds, userRooms[i].customers)
        }

        const customers = await userModel.find({
            _id: {$in : customerIds},
            role: USER_ROLE_ENUM.CUSTOMER,
        }, {email: 1, fullName: 1, address: 1, phoneNumber: 1, isDeleted: 1}).populate('room')
        return customers
    } catch (error) {
        return throwError({
            errorCode: Code.GET_CUSTOMER_BY_OWNER_FAILED,
            message: 'Lấy danh sách khành hàng thất bại !'
        })
    }
}

module.exports.GetCustomerById = async (user, customerId) => {
    try {
        const customers = await GetCustomersByOwner(user)

        for (let i = 0; i < customers.length; i++){
            if (customers[i]._id.toString() === customerId.toString()){
                return customers[i]
            }
        }

        return throwError({
            errorCode: Code.GET_CUSTOMER_BY_ID_FAILED,
            message: 'Lấy thông tin khành hàng thất bại !'
        })
    } catch (error) {
        return throwError(error)
    }
}

module.exports.UpdateCustomer = async (user, newCustomer, session) => {
    try {
        const customer = await GetCustomerById(user, newCustomer._id)

        if (newCustomer.email) {
            let user = await userModel.findOne({email : newCustomer.email, _id : {$ne: newCustomer._id}, role: USER_ROLE_ENUM.OWNER})
            if (user) {
                return throwError({
                    errorCode: Code.EMAIL_IS_EXIST,
                    message: 'Email đã được sử dụng !'
                })
            }
        }

        if (customer.room._id.toString() !== newCustomer.room){
            const oldRoom = await roomModel.findById(customer.room)
            const newRoom = await roomModel.findOne({
                _id: newCustomer.room,
                block: {$in: user.blocks}
            })

            if (!newRoom) {
                return throwError({
                    errorCode: Code.ROOM_NOT_EXIST,
                    message: 'Lấy thông tin phòng thất bại !'
                })
            }

            oldRoom.customers.remove(customer._id)
            newRoom.customers.push(customer._id)

            await oldRoom.save({session})
            await newRoom.save({session})
        }

        await customer.updateOne({...newCustomer}, {session})
        return newCustomer
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.UPDATE_CUSTOMER_FAILED
        return throwError(error)
    }
}

module.exports.DeleteCustomer = async (user, customerId, session) => {
    try {
        const customer = await GetCustomerById(user, customerId)

        await customer.updateOne({
            isDeleted: true
        }, {session})

        return customer
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.DELETE_CUSTOMER_FAILED
        return throwError(error)
    }
}

module.exports.DeleteCustomers = async (user, customerIds, session) => {
    try {
        const deleteCustomerPromises = []
        for (let i =0; i < customerIds.length; i++){
            const deleteCustomerPromise = DeleteCustomer(user, customerIds[i], session)
            deleteCustomerPromises.push(deleteCustomerPromise)
        }
        return await Promise.all(deleteCustomerPromises)
    } catch (error) {
        return throwError(error)
    }
}