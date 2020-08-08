const serviceService = require('./service.service')

const CreateService = async (req, res, next) => {
    const {userId} = req
    const _service = req.body

    const _result = await serviceService.CreateService(userId, _service)
    if (_result.error) return res.status(500).json({
        error: {
            message: _result.error.message
        }
    })

    return res.status(201).json({
        message: 'Thêm dịch vụ thành công !'
    })
}

const GetBlockServices = async (req, res, next) => {
    try {
        const {userId} = req
        const {_id} = req.query

        const _services = await serviceService.GetBlockServices(userId, _id)
        if (_services.error) return res.status(500).json({
            error: {
                message: _services.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy danh sách dịch vụ thành công !',
            services : _services
        })
    } catch (error) {
        return next(error)
    }
}

const GetServiceById = async (req, res, next) => {
    try {
        const {userId} = req
        const {_id} = req.query

        const _service = await serviceService.GetServiceById(userId, _id)
        if (_service.error) return res.status(500).json({
            error: {
                message: _service.error.message
            }
        })

        return res.status(200).json({
            message: 'Lấy thông tin dịch vụ thành công !',
            service : _service
        })
    } catch (error) {
        return next(error)
    }
}

const UpdateService = async (req, res, next) => {
    try {
        const {userId} = req
        const {_id} = req.query
        const _service = req.body

        if (_id !== _service._id) return res.status(500).json({
            error: {
                message: 'Mã dịch vụ không trùng khớp'
            }
        })

        const _services = await serviceService.UpdateService(userId, _service)
        if (_services.error) return res.status(500).json({
            error: {
                message: _services.error.message
            }
        })

        return res.status(200).json({
            message: 'Cập nhật dịch vụ thành công !',
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteService = async (req, res, next) => {
    try {
        const {userId} = req
        const {_id} = req.query

        const _result = await serviceService.DeleteService(userId, _id)
        if (_result.error) return res.status(500).json({
            error: {
                message: _result.error.message
            }
        })

        return res.status(200).json({
            message: 'Xóa dịch vụ thành công !'
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteServices = async (req, res, next) => {
    try {
        const {userId} = req
        const {_ids} = req.body

        const result = await serviceService.DeleteServices(userId, _ids)
        if (result.error) return res.status(500).json({
            error: {
                message: result.error.message
            }
        })

        return res.status(200).json({
            message: 'Xóa dịch vụ thành công !'
        })
    } catch (error) {
        return next(error)
    }
}
module.exports = {
    CreateService,
    GetBlockServices,
    GetServiceById,
    UpdateService,
    DeleteService,
    DeleteServices
}