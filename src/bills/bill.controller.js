const billService = require('./bill.service')

const CreateBill = async (req, res, next) => {
    try {
        const {user} = req
        const bill = req.body

        const _result = await billService.CreateBill(user, bill)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(201).json({
            message: 'Tạo hóa đơn thành công !',
            bill: _result
        })
    } catch (error) {
        return next(error)
    }
}

const GetBillByOwner = async (req, res, next) => {
    try {
        const {user} = req

        const _result = await billService.GetBillByOwner(user)
        if (_result.error) return res.status(500).json({
            error: {
                message : _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy danh sách hóa đơn thành công !',
            bills: _result
        })
    } catch (error) {
        return next(error)
    }
}

const GetBillByRoom = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const _result = await billService.GetBillByRoom(user, _id)
        if(_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy danh sách hóa đơn thành công !',
            bills: _result
        })
    } catch (error) {
        return next(error)
    }
}

const GetBillById = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const _result = await billService.GetBillById(user, _id)
        if (_result.error) return res.status(500).json({
            error : {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy thông tin hóa đơn thành công !',
            bill: _result
        })
    } catch (error) {
        return next(error)
    }
}

const UpdateBill = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query
        const bill = req.body

        if (_id !== bill._id) return res.status(500).json({
            error: {
                message: 'Mã hóa đơn không trùng khớp !'
            }
        })

        const _result = await billService.UpdateBill(user, bill)
        if(_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Cập nhật hóa đơn thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteBill = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const _result = await billService.DeleteBill(user, _id)
        if (_result.error) return res.status(500).json({
            error: {
                message : _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Xóa hóa đơn thành công !'
        })
    } catch (error) {
        return next(error)
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