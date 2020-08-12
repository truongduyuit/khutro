const serviceDetailModel = require('./service-detail.model')
const roomService = require('../rooms/room.service')
const serviceService = require('../services/service.service')
const CreateServiceDetail = async (user, serviceDetail) => {
    try {
        const _room = await roomService.GetRoomById(user._id.toString(), serviceDetail.room)
        if (_room.error) return {
            error: {
                message: _room.error.message
            }
        }

        const _service = await serviceService.GetServiceById(user._id, serviceDetail.service)
        if (_service.error) return {
            error: {
                message: _service.error.message
            }
        }

        const _newServiceDetail = new serviceDetailModel(serviceDetail)
        _newServiceDetail.owner = user._id
        await _newServiceDetail.save()
        return {}
    } catch (error) {
        return new Error(error)
    }
}

const GetServiceDetailByRoomAndMonth = async (user, roomId, month, year) => {
    try {
        if (roomId) {
            const _serviceDetails  = await serviceDetailModel.find({
                                        owner: user._id.toString(),
                                        ofMonth: {$lt : new Date(year, month, 1), $gte : new Date(year, month - 1 , 1)},
                                        room: roomId,
                                        isDeleted: false
                                    }).populate('room').populate('service')

            if (!_serviceDetails) return {
                error: {
                    message : 'Không tìm thấy danh sách chi tiết dịch vụ !'
                }
            }
            return _serviceDetails
        }

        const _serviceDetails  = await serviceDetailModel.find({
                                    owner: user._id.toString(),
                                    ofMonth: {$lt : new Date(year, month, 1), $gte : new Date(year, month - 1 , 1)},
                                    isDeleted: false
                                }).populate('room').populate('service')

        if (!_serviceDetails) return {
            error: {
                message : 'Không tìm thấy danh sách chi tiết dịch vụ !'
            }
        }
        return _serviceDetails
    } catch (error) {
        return new Error(error)
    }
}

const GetServiceDetailByOwner = async (user) => {
    try {
        const _serviceDetails  = await serviceDetailModel.find({
                                        owner: user._id.toString(),
                                        isDeleted: false
                                    }).populate('room').populate('service')

        if (!_serviceDetails) return {
            error: {
                message : 'Không tìm thấy danh sách chi tiết dịch vụ !'
            }
        }
        return _serviceDetails
    } catch (error) {
        return new Error(error)
    }
}

const GetServiceDetailById = async (user, serviceDetailId) => {
    try {
        const _serviceDetails  = await serviceDetailModel.findOne({
                                        _id: serviceDetailId,
                                        owner: user._id.toString(),
                                        isDeleted: false
                                    }).populate('room').populate('service')

        if (!_serviceDetails) return {
            error: {
                message : 'Không tìm thấy danh sách chi tiết dịch vụ !'
            }
        }
        return _serviceDetails
    } catch (error) {
        return new Error(error)
    }
}

const UpdateServiceDetail = async (user, serviceDetail) => {
    try {
        const _serviceDetail = await serviceDetailModel.findOne({
            _id: serviceDetail._id,
            owner: user._id
        })
        if (!_serviceDetail) return {
            error: {
                message: 'Không thể cập nhật chi tiết dịch vụ !'
            }
        }

        const _room = await roomService.GetRoomById(user._id.toString(), serviceDetail.room)
        if (_room.error) return {
            error: {
                message: _room.error.message
            }
        }

        const _service = await serviceService.GetServiceById(user._id, serviceDetail.service)
        if (_service.error) return {
            error: {
                message: _service.error.message
            }
        }

        await _serviceDetail.updateOne({
            room: serviceDetail.room,
            service: serviceDetail.service,
            quantity: serviceDetail.quantity,
            serviceAmount: serviceDetail.serviceAmount,
            ofMonth: serviceDetail.ofMonth
        })
        await _serviceDetail.save()

        return {}
    } catch (error) {
        return new Error(error)
    }
}

const DeleteServiceDetail = async (user, serviceDetailId) => {
    try {
        const _serviceDetail = await serviceDetailModel.findOne({
            _id: serviceDetailId,
            owner: user._id
        })

        if (!_serviceDetail) return {
            error: {
                message: 'Không thể xóa chi tiết dịch vụ !'
            }
        }

        await _serviceDetail.updateOne({
            isDeleted: true
        })
        await _serviceDetail.save()

        return {}
    } catch (error) {
        return new Error(error)
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