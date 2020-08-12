const _ = require('lodash')

const billModel = require('./bill.model')
const roomService = require('../rooms/room.service')
const customerService = require('../customers/customer.service')
const serviceDetailService = require('../service-details/service-detail.service')
const userModel = require('../users/user.model')

const CreateBill = async (user, bill) => {
    try {
        if (_.isEmpty(bill.customers)) return {
            error: {
                message: 'Hóa đơn phải tạo cho ít nhất 1 khách hàng nào đó !'
            }
        }

        let error = null
        for (let i =0; i < bill.customers.length; ++i) {
            let _customer = await customerService.GetCustomerById(user, bill.customers[i])
            if (_customer.error) {
                error = _customer.error
                return {error}
            }
        }
        for (let i =0; i < bill.services.length; ++i) {
            let _customer = await serviceDetailService.GetServiceDetailById(user._id, bill.services[i])
            if (_customer.error) {
                error = _customer.error
                return {error}
            }
        }
        if (error) return {error}

        const _newBill = new billModel(bill)
        _newBill.owner = user._id

        if (bill.isPay === true) {
            _newBill.dateCheckout = Date.now()

            if (bill.roomTotalAmount !== 0){
                const quantityCustomers = bill.customers.length
                let quantityMonths = bill.roomTotalAmount / bill.roomPrice

                if (quantityCustomers > 1) {
                    quantityMonths /= quantityCustomers
                }

                for (let i = 0; i < bill.customers.length; ++i){
                    let _customer = await userModel.findById(bill.customers[i])

                    await _customer.updateOne({
                        outOfDay: new Date( _customer.outOfDay.setMonth(_customer.outOfDay.getMonth() + quantityMonths))
                    })
                    await _customer.save()
                }
            }
        }

        await _newBill.save()
        return _newBill
    } catch (error) {
        return new Error(error)
    }
}

const GetBillByOwner = async (user) => {
    try {
        const _bills = await billModel.find({owner: user._id.toString(), isDeleted: false}).populate('customers').populate('room').populate('service-detail')
        if (!_bills) return {
            error: {
                message: 'Lấy danh sách hóa đơn thất bại !'
            }
        }

        return _bills
    } catch (error) {
        return new Error(error)
    }
}

const GetBillByRoom = async (user, roomId) => {
    try {
        const _bills = await billModel.find({
            owner: user._id,
            room: roomId,
            isDeleted: false
        }).populate('customers').populate('room').populate('service-detail')
        if (!_bills) return {
            error: {
                message: 'Lấy danh sách hóa đơn thất bại !'
            }
        }

        return _bills
    } catch (error) {
        return new Error(error)
    }
}

const GetBillById = async (user, billId) => {
    try {
        const _bill = await billModel.findOne({
            _id: billId,
            owner: user._id,
            isDeleted: false
        }).populate('customers').populate('room').populate('service-detail')
        if (!_bill) return {
            error: {
                message: 'Lấy thông hóa đơn thất bại !'
            }
        }

        return _bill
    } catch (error) {
        return new Error(error)
    }
}

const UpdateBill = async (user, bill) => {
    try {
        const _bill = await GetBillById(user, bill._id)
        if (_bill.error) return {
            error: {
                message: _bill.error.message
            }
        }

        if (_bill.isPay === true) return {
            error: {
                message: 'Không được chỉnh sửa hóa đơn đã thanh toán !'
            }
        }

        if (bill.isPay === false) return {}

        if (bill.roomTotalAmount !== 0){
            const quantityCustomers = bill.customers.length
            let quantityMonths = bill.roomTotalAmount / bill.roomPrice

            if (quantityCustomers > 1) {
                quantityMonths /= quantityCustomers
            }

            for (let i = 0; i < bill.customers.length; ++i){
                let _customer = await userModel.findById(bill.customers[i])

                await _customer.updateOne({
                    outOfDay: new Date( _customer.outOfDay.setMonth(_customer.outOfDay.getMonth() + quantityMonths))
                })
                await _customer.save()
            }
        }

        await _bill.updateOne({
            isPay: true,
            dateCheckout: Date.now()
        })
        await _bill.save()

        return {}
    } catch (error) {
        return new Error(error)
    }
}

const DeleteBill = async (user, billId) => {
    try {
        const _bill = await GetBillById(user, billId)
        if (_bill.error) return {
            error: {
                message: _bill.error.message
            }
        }

        if (_bill.isPay === true) {
            if (new Date().setDate(_bill.dateCheckout.getDate()) + 1 <  Date.now()) return {
                error: {
                    message: 'Không thể xóa hóa đơn đã thanh toán sau 1 ngày !'
                }
            }

            if (_bill.roomTotalAmount !== 0){
                const quantityCustomers = _bill.customers.length
                let quantityMonths = _bill.roomTotalAmount / _bill.roomPrice

                if (quantityCustomers > 1) {
                    quantityMonths /= quantityCustomers
                }

                for (let i = 0; i < _bill.customers.length; ++i){
                    let _customer = await userModel.findById(_bill.customers[i])

                    await _customer.updateOne({
                        outOfDay: new Date( _customer.outOfDay.setMonth(_customer.outOfDay.getMonth() - quantityMonths))
                    })
                    await _customer.save()
                }
            }
        }

        await _bill.updateOne({
            isDeleted: true
        })
        await _bill.save()

        return {}
    } catch (error) {
        return new Error(error)
    }
}
module.exports = {
    CreateBill,
    GetBillByOwner,
    GetBillByRoom,
    GetBillById,
    UpdateBill,
    DeleteBill
}