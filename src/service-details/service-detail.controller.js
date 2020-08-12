const serviceDetailService = require('./service-detail.service')

const CreateServiceDetail = async (req, res, next) => {
    try {
        const {user} = req
        const _serviceDetail = req.body
        const _result = await serviceDetailService.CreateServiceDetail(user, _serviceDetail)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(201).json({
            message: 'Tạo chi tiết hóa dịch vụ thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

const GetServiceDetailByRoomAndMonth = async (req, res, next) => {
    try {
        const {user} = req
        const {_id, month, year} = req.query

        const _result = await serviceDetailService.GetServiceDetailByRoomAndMonth(user, _id, month, year)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy danh sách chi tiết dịch vụ thành công !',
            serviceDetails: _result
        })
    } catch (error) {
        return next(error)
    }
}

const GetServiceDetailByOwner = async (req, res, next) => {
    try {
        const {user} = req

        const _result = await serviceDetailService.GetServiceDetailByOwner(user)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy danh sách chi tiết dịch vụ thành công !',
            serviceDetails: _result
        })
    } catch (error) {
        return next(error)
    }
}

const GetServiceDetailById = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const _result = await serviceDetailService.GetServiceDetailById(user, _id)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy thông tin chi tiết dịch vụ thành công !',
            serviceDetail: _result
        })
    } catch (error) {
        return next(error)
    }
}
const UpdateServiceDetail = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query
        const _serviceDetail = req.body

        if (_id !== _serviceDetail._id) return res.status(500).json({
            error: {
                message: 'Mã chi tiết dịch vụ không trùng khớp !'
            }
        })

        const _result = await serviceDetailService.UpdateServiceDetail(user, _serviceDetail)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Cập nhật chi tiết dịch vụ thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteServiceDetail = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const _result = await serviceDetailService.DeleteServiceDetail(user, _id)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Xóa chi tiết dịch vụ thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    CreateServiceDetail,
    GetServiceDetailByRoomAndMonth,
    GetServiceDetailByOwner,
    GetServiceDetailById,
    UpdateServiceDetail,
    DeleteServiceDetail
}