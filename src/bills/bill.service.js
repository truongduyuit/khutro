const {isEmpty} = require('lodash')

const {throwError} = require('../../helpers/responseToClient.helper')
const Code = require('./bill.code')

const billModel = require('./bill.model')
const userModel = require('../users/user.model')
const roomModel = require('../rooms/room.model')
const serviceDetailModel = require('../service-details/service-detail.model')

module.exports.CreateBill = async (user, bill, session) => {
    try {
        if (isEmpty(bill.customers)) return throwError({
            errorCode: Code.BILL_MUST_LEAST_1_CUSTOMER,
            message: 'Hóa đơn phải tạo cho ít nhất 1 khách hàng nào đó !'
        })

        const room = await roomModel.findOne({_id: bill.room, block: {$in: user.blocks}})
        if (!room) return throwError({
            errorCode: Code.ROOM_NOT_EXIST,
            message: 'Phòng không tồn tại !'
        })
        if (room.price !== bill.roomPrice) return throwError({
            errorCode: Code.PRICE_OF_ROOM_FALSE,
            message: 'Giá phòng không chính xác !'
        })
        if (bill.roomTotalAmount % (bill.roomPrice * bill.customers.length) !== 0) return throwError({
            errorCode: Code.ROOM_TOTAL_AMOUNT_FALSE,
            message: 'Tổng tiền phòng phải là bội số của giá phòng nhân nhân số khách hàng!'
        })

        const customers = []
        for (let i =0; i < bill.customers.length; ++i) {
            let customer = await userModel.findOne({_id: bill.customers[i], room: bill.room})
            if (!customer) return throwError({
                errorCode: Code.CUSTOMER_NOT_IN_ROOM,
                message: 'Khách hàng không đúng !'
            })
            customers.push(customer)
        }

        const services = []
        let serviceTotalAmount = 0
        for (let i =0; i < bill.services.length; ++i) {
            let service = await serviceDetailModel.findOne({_id: bill.services[i], room: bill.room, isDeleted: false, isPay: false})

            if (!service) return throwError({
                errorCode: Code.SERVICE_DETAIL_NOT_OF_ROOM,
                message: 'Chi tiêt dịch vụ không đúng !'
            })
            services.push(service)
            serviceTotalAmount += service.serviceAmount
        }

        if (serviceTotalAmount !== bill.serviceTotalAmount) return throwError({
            errorCode: Code.SERVICES_TOTAL_AMOUNT_FALSE,
            message: 'Tổng giá các dịch vụ không chính xác !'
        })

        if (bill.serviceTotalAmount + bill.roomTotalAmount !== bill.totalBillAmount) return throwError({
            errorCode: Code.BILL_TOTAL_AMOUNT_FALSE,
            message: 'Tổng giá hóa đơn không chính xác !'
        })

        const allPromises = []
        const newBill = new billModel(bill)
        if (bill.isPay === true) {
            newBill.dateCheckout = Date.now()
            if (bill.roomTotalAmount !== 0){
                const quantityCustomers = bill.customers.length
                const quantityMonths = bill.roomTotalAmount / bill.roomPrice / quantityCustomers

                for (let i =0; i < customers.length; ++i) {
                    const newMonth = customers[i].outOfDay.getMonth() + quantityMonths
                    const newOutOfDay = new Date(customers[i].outOfDay.setMonth(newMonth))

                    const customerPromise = customers[i].updateOne({outOfDay: newOutOfDay}, {session})
                    allPromises.push(customerPromise)
                }
            }

            for (let i =0; i < services.length; ++i) {
                const servicePromise = services[i].updateOne({isPay: true}, {session})
                allPromises.push(servicePromise)
            }
        }

        newBill.owner = user._id
        allPromises.push(newBill.save({session}))
        await Promise.all(allPromises)

        return newBill
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CREATE_BILL_FAILED
        return throwError(error)
    }
}

module.exports.GetBillByOwner = async (user) => {
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

module.exports.GetBillByCustomer = async (user) => {
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

module.exports.GetBillByRoom = async (user, roomId) => {
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

module.exports.GetBillById = async (user, billId) => {
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

module.exports.UpdateBill = async (user, newBill, session) => {
    try {
        if (newBill.isPay === false) return {}

        const bill = await GetBillById(user, newBill._id)
        if (bill.isPay === true) return throwError({
            statusCode: 500,
            errorCode: Code.CANNOT_EDIT_BILL_IS_PAID,
            message: 'Không được chỉnh sửa hóa đơn đã thanh toán !'
        })

        let allPromises = []
        if (bill.roomTotalAmount !== 0){
            const quantityCustomers = bill.customers.length
            const quantityMonths = bill.roomTotalAmount / bill.roomPrice / quantityCustomers
            for (let i = 0; i < bill.customers.length; ++i){
                const customer = await userModel.findById(bill.customers[i])
                const newMonth = customer.outOfDay.getMonth() + quantityMonths
                const newOutOfDay = new Date(customer.outOfDay.setMonth(newMonth))

                const customerPromise =  customer.updateOne({outOfDay: newOutOfDay}, {session})
                allPromises.push(customerPromise)
            }
        }

        for (let i =0 ; i < bill.services.length; ++i){
            const serviceDetail = await serviceDetailModel.findOneAndUpdate({_id: bill.services[i], isPay: false }, {isPay: true}, {session})
            if (!serviceDetail) return throwError({
                statusCode: 500,
                errorCode: Code.SERVICE_DETAIL_NOT_OF_ROOM,
                message: 'Chi tiết dịch vụ không tồn tại !'
            })
        }
        allPromises.push(bill.updateOne({isPay: true, dateCheckout: Date.now()}, {session}))
        await Promise.all(allPromises)

        return bill
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.UPDATE_BILL_FAILED
        return throwError(error)
    }
}

module.exports.DeleteBill = async (user, billId, session) => {
    try {
        const bill = await GetBillById(user, billId)

        const allPromises = []
        if (bill.isPay === true) {
            const checkOutTime = bill.dateCheckout.getTime();
            const oneDay = 24*60*60*1000;
            if (checkOutTime + oneDay < Date.now()) return throwError({
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

                    allPromises.push(customer.updateOne({outOfDay: newOutOfDay}, {session}))
                }
            }

            for (let i =0 ; i < bill.services.length; ++i){
                const serviceDetailPromise = serviceDetailModel.findByIdAndUpdate(bill.services[i], {isPay: false}, {session})
                allPromises.push(serviceDetailPromise)
            }
        }

        allPromises.push(bill.updateOne({isDeleted: true}, {session}))
        await Promise.all(allPromises)

        return bill
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.DELETE_BILL_FAILED
        return throwError(error)
    }
}