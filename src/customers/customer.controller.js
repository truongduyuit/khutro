const CustomerService = require('./customer.service')
const customerService = require('./customer.service')

const CreateCustomer = async (req, res, next) => {
    try {
        const {user} = req
        const customer = req.body 

        const _result = await customerService.CreateCustomer(user, customer)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(201).json({
            message: 'Thêm khách hàng thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

const GetCustomersByOwner = async (req, res, next) => {
    try {
        const {user} = req
        const customer = req.body

        const _result = await customerService.GetCustomersByOwner(user, customer)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy danh sách khách hàng thành công !',
            customers: _result
        })
    } catch (error) {
        return next(error)
    }
}

const GetCustomerById = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const _result = await customerService.GetCustomerById(user, _id)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy thông tin khách hàng thành công !',
            customer: _result
        })
    } catch (error) {
        return next(error)
    }
}

const UpdateCustomer = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query
        const _customer = req.body

        if (_id !== _customer._id) return res.status(500).json({
            error: {
                message: 'Mã khách hàng không trùng khớp !'
            }
        })

        const _result = await customerService.UpdateCustomer(user, _customer)
        if (_result.error) return res.status(500).json({
            message: _result.error.message
        })

        return res.status(200).json({
            message: 'Cập nhật khách hàng thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteCustomer = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const _result = await customerService.DeleteCustomer(user, _id)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Xóa khách hàng thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteCustomers = async (req, res, next) => {
    try {
        const {user} = req
        const {_ids} = req.body

        const _result = await customerService.DeleteCustomers(user, _ids)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Xóa khách hàng thành công !'
        })
    } catch (error) {
        return next(error)
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