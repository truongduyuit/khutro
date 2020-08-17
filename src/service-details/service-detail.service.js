const _ = require('lodash')

const {throwError} = require('../../helpers/responseToClient.helper')
const Code = require('./service-detail.code')

const {USER_ROLE_ENUM} = require('../../configs/app.config')
const serviceDetailModel = require('./service-detail.model')
const userModel = require('../users/user.model')
const blockModel = require('../blocks/block.model')


const CreateServiceDetail = async (user, serviceDetail) => {
    try {
        const block = await blockModel.findOne({
            rooms: {$elemMatch: {$eq: serviceDetail.room}},
            services: {$elemMatch: {$eq: serviceDetail.service}}
        })
        if (!block) return throwError({
            errorCode: Code.SERVICE_NOT_OF_ROOM,
            message: 'Dịch vụ không phải của phòng !'
        })

        const newServiceDetail = new serviceDetailModel(serviceDetail)
        newServiceDetail.owner = user._id
        await newServiceDetail.save()
        return newServiceDetail
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CREATE_SERVICE_DETAIL_FAILED
        return throwError(error)
    }
}

const GetServiceDetailByRoomAndMonth = async (user, roomId, month, year) => {
    try {
        if (user.role === USER_ROLE_ENUM.CUSTOMER){
            const _customers = await userModel.find({email: user.email, room: roomId})

            let _rooms = []
            for (let i =0 ; i < _customers.length; ++i){
                if (_.indexOf(_rooms, _customers[i].room._id) === -1) {
                    _rooms.push(_customers[i].room._id)
                }
            }

            let serviceDetails = await serviceDetailModel.find({
                room: {$in : _rooms}
            }).populate('room').populate('service')

            return serviceDetails
        }

        let serviceDetails  = await serviceDetailModel.find({
            owner: user._id,
            ofMonth: {$lt : new Date(year, month, 1), $gte : new Date(year, month - 1 , 1)},
            room: roomId || {$exists: true}
        }).populate('room').populate('service')

        return serviceDetails
    } catch (error) {
        return throwError({
            errorCode : Code.GET_SERVICE_DETAILS_MONTH_FAILED,
            message: 'Lấy danh sách chi tiết dịch vụ thất bại !'
        })
    }
}

const GetServiceDetailsByOwner = async (user) => {
    try {
        const serviceDetails  = await serviceDetailModel.find({
            owner: user._id
        }).populate('room').populate('service')

        return serviceDetails
    } catch (error) {
        return throwError({
            errorCode : Code.GET_SERVICE_DETAILS_FAILED,
            message: 'Lấy danh sách chi tiết dịch vụ thất bại !'
        })
    }
}

const GetServiceDetailById = async (user, serviceDetailId) => {
    try {
        const serviceDetail  = await serviceDetailModel.findOne({
            _id: serviceDetailId,
            owner: user._id.toString(),
            isDeleted: false
        }).populate('room').populate('service')

        return serviceDetail
    } catch (error) {
        return throwError({
            errorCode : Code.GET_SERVICE_DETAIL_BY_ID_FAILED,
            message: 'Lấy thông tin chi tiết dịch vụ thất bại !'
        })
    }
}

const UpdateServiceDetail = async (user, newServiceDetail) => {
    try {
        const block = await blockModel.findOne({
            rooms: {$elemMatch: {$eq: newServiceDetail.room}},
            services: {$elemMatch: {$eq: newServiceDetail.service}}
        })

        if (!block) return throwError({
            errorCode: Code.SERVICE_NOT_OF_ROOM,
            message: 'Dịch vụ không phải của phòng !'
        })

        const serviceDetail = await GetServiceDetailById(user, newServiceDetail._id)
        await serviceDetail.updateOne({...newServiceDetail})
        return {}
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.UPDATE_SERVICE_DETAIL_FAILED
        return throwError(error)
    }
}

const DeleteServiceDetail = async (user, serviceDetailId) => {
    try {
        const serviceDetail = await GetServiceDetailById(user, serviceDetailId)

        await serviceDetail.updateOne({
            isDeleted: true
        })
        return serviceDetail
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.DELETE_SERVICE_DETAIL_FAILED
        return throwError(error)
    }
}

module.exports = {
    CreateServiceDetail,
    GetServiceDetailByRoomAndMonth,
    GetServiceDetailsByOwner,
    GetServiceDetailById,
    UpdateServiceDetail,
    DeleteServiceDetail
}