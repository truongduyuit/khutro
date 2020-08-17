const _ = require('lodash')

const {throwError} = require('../../helpers/responseToClient.helper')
const Code = require('./bill.code')

const billModel = require('./bill.model')
const userModel = require('../users/user.model')
const serviceDetailModel = require('../service-details/service-detail.model')

const CreateBill = async (user, bill, session) => {
    try {
        if (_.isEmpty(bill.customers)) {
            return throwError({
                statusCode: 500,
                errorCode: Code.BILL_MUST_LEAST_1_CUSTOMER,
                message: 'Hóa đơn phải tạo cho ít nhất 1 khách hàng nào đó !'
            })
        }
        for (let i =0; i < bill.customers.length; ++i) {
            let user = await userModel.findOne({
                _id: bill.customers[i],
                room: bill.room
            })

            if (!user) return throwError({
                statusCode: 500,
                errorCode: Code.CUSTOMER_NOT_IN_ROOM,
                message: 'Khách hàng không đúng !'
            })
        }
        for (let i =0; i < bill.services.length; ++i) {
            let service = await serviceDetailModel.findOne({
                _id: bill.services[i],
                room: bill.room
            })

            if (!service) return throwError({
                statusCode: 500,
                errorCode: Code.SERVICE_DETAIL_NOT_OF_ROOM,
                message: 'Chi tiêt dịch vụ không đúng !'
            })
        }

        const newBill = new billModel(bill)
        if (bill.isPay === true) {
            newBill.dateCheckout = Date.now()
            if (bill.roomTotalAmount !== 0){
                if (bill.roomTotalAmount % bill.roomPrice !== 0) return throwError({
                    statusCode: 500,
                    errorCode: Code.ROOM_TOTAL_AMOUNT_FALSE,
                    message: 'Tổng tiền phòng phải là bội số của giá phòng'
                })

                const quantityCustomers = bill.customers.length
                const quantityMonths = bill.roomTotalAmount / bill.roomPrice / quantityCustomers

                for (let i = 0; i < bill.customers.length; ++i){
                    const customer = await userModel.findById(bill.customers[i])

                    const newMonth = customer.outOfDay.getMonth() + quantityMonths
                    const newOutOfDay = new Date(customer.outOfDay.setMonth(newMonth))
                    await customer.updateOne({
                        outOfDay: newOutOfDay
                    }, {session})
                }
            }

            for (let i =0 ; i < bill.services.length; ++i){
                await serviceDetailModel.findByIdAndUpdate(bill.services[i], {isPay: true}, {session})
            }
        }

        newBill.owner = user._id
        await newBill.save({session})
        return newBill
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CREATE_BILL_FAILED
        return throwError(error)
    }
}

const GetBillByOwner = async (user) => {
    try {
        const bills = await billModel.find({owner: user._id}).populate('room')
        return bills
    } catch (error) {
        return throwError({
            statusCode: 500,
            errorCode: Code.GET_BILLS_BY_OWNER_FAILED,
            message: 'Lấy danh sách hóa đơn thất bại'
        })
    }
}

const GetBillByCustomer = async (user) => {
    try {
        const bills = await billModel.find({customers: {$elemMatch: {$eq: user._id}}}).populate('room')
        return bills
    } catch (error) {
        return throwError({
            statusCode: 500,
            errorCode: Code.GET_BILLS_BY_CUSTOMER_FAILED,
            message: 'Lấy danh sách hóa đơn thất bại'
        })
    }
}

const GetBillByRoom = async (user, roomId) => {
    try {
        const bills = await billModel.find({
            owner: user._id,
            room: roomId
        }).populate('room')

        return bills
    } catch (error) {
        return throwError({
            statusCode: 500,
            errorCode: Code.GET_BILLS_BY_ROOM_FAILED,
            message: 'Lấy danh sách hóa đơn thất bại'
        })
    }
}

const GetBillById = async (user, billId) => {
    try {
        const bill = await billModel.findOne({
            _id: billId,
            owner: user._id
        }).populate('customers').populate('room').populate('service-detail')

        return bill
    } catch (error) {
        return throwError({
            statusCode: 500,
            errorCode: Code.GET_BILLS_BY_ID_FAILED,
            message: 'Lấy thông tin hóa đơn thất bại'
        })
    }
}

const UpdateBill = async (user, newBill, session) => {
    try {
        if (newBill.isPay === false) return {}

        const bill = await GetBillById(user, newBill._id)
        if (bill.isPay === true) return throwError({
            statusCode: 500,
            errorCode: Code.CANNOT_EDIT_BILL_IS_PAID,
            message: 'Không được chỉnh sửa hóa đơn đã thanh toán !'
        })


        if (bill.roomTotalAmount !== 0){
            if (bill.roomTotalAmount % bill.roomPrice !== 0) return throwError({
                    statusCode: 500,
                    errorCode: Code.ROOM_TOTAL_AMOUNT_FALSE,
                    message: 'Tổng tiền phòng phải là bội số của giá phòng'
                })

            const quantityCustomers = bill.customers.length
            const quantityMonths = bill.roomTotalAmount / bill.roomPrice / quantityCustomers

            for (let i = 0; i < bill.customers.length; ++i){
                const customer = await userModel.findById(bill.customers[i])

                const newMonth = customer.outOfDay.getMonth() + quantityMonths
                const newOutOfDay = new Date(customer.outOfDay.setMonth(newMonth))
                await customer.updateOne({
                    outOfDay: newOutOfDay
                }, {session})
            }
        }

        for (let i =0 ; i < bill.services.length; ++i){
            await serviceDetailModel.findByIdAndUpdate(bill.services[i], {isPay: true}, {session})
        }

        await bill.updateOne({
            isPay: true,
            dateCheckout: Date.now()
        }, {session})

        return bill
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.UPDATE_BILL_FAILED
        return throwError(error)
    }
}

const DeleteBill = async (user, billId, session) => {
    try {
        const bill = await GetBillById(user, billId)

        if (bill.isPay === true) {
            const checkOutTime = bill.dateCheckout.getTime();
            const oneDay = 24*60*60*1000;
            if (checkOutTime + oneDay < Date.now()) return throwError({
                statusCode: 500,
                errorCode: Code.CANNOT_DELETE_BILL_PAID_ONE_DAY,
                message: 'Không thể xóa hóa đơn đã thanh toán sau 1 ngày !'
            })


            if (bill.roomTotalAmount !== 0){
                const quantityCustomers = bill.customers.length
                const quantityMonths = bill.roomTotalAmount / bill.roomPrice / quantityCustomers

                for (let i = 0; i < bill.customers.length; ++i){
                    const customer = await userModel.findById(bill.customers[i])

                    const newMonth = customer.outOfDay.getMonth() - quantityMonths
                    const newOutOfDay = new Date(customer.outOfDay.setMonth(newMonth))
                    await customer.updateOne({
                        outOfDay: newOutOfDay
                    }, {session})
                }
            }

            for (let i =0 ; i < bill.services.length; ++i){
                await serviceDetailModel.findByIdAndUpdate(bill.services[i], {isPay: false}, {session})
            }
        }

        await bill.updateOne({
            isDeleted: true
        }, {session})

        return bill
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.DELETE_BILL_FAILED
        return throwError(error)
    }
}
module.exports = {
    CreateBill,
    GetBillByOwner,
    GetBillByCustomer,
    GetBillByRoom,
    GetBillById,
    UpdateBill,
    DeleteBill
}