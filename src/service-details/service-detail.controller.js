const {responseToClient} = require('../../helpers/responseToClient.helper')
const serviceDetailService = require('./service-detail.service')

const CreateServiceDetail = async (req, res, next) => {
    try {
        const {user} = req
        const serviceDetail = req.body
        const newServiceDetail = await serviceDetailService.CreateServiceDetail(user, serviceDetail)

        return responseToClient(res, {
            data: newServiceDetail
        })
    } catch (error) {
        return next(error)
    }
}

const GetServiceDetailByRoomAndMonth = async (req, res, next) => {
    try {
        const {user} = req
        const {_id, month, year} = req.query

        const serviceDetails = await serviceDetailService.GetServiceDetailByRoomAndMonth(user, _id, month, year)

        return responseToClient(res, {
            data: serviceDetails
        })
    } catch (error) {
        return next(error)
    }
}

const GetServiceDetailByOwner = async (req, res, next) => {
    try {
        const {user} = req

        const serviceDetails = await serviceDetailService.GetServiceDetailsByOwner(user)

        return responseToClient(res, {
            data: serviceDetails
        })
    } catch (error) {
        return next(error)
    }
}

const GetServiceDetailById = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const serviceDetail = await serviceDetailService.GetServiceDetailById(user, _id)

        return responseToClient(res, {
            data: serviceDetail
        })
    } catch (error) {
        return next(error)
    }
}
const UpdateServiceDetail = async (req, res, next) => {
    try {
        const {user} = req
        const newServiceDetail = req.body

        await serviceDetailService.UpdateServiceDetail(user, newServiceDetail)

        return responseToClient(res, {
            data: newServiceDetail
        })
    } catch (error) {
        return next(error)
    }
}

const DeleteServiceDetail = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const serviceDetail = await serviceDetailService.DeleteServiceDetail(user, _id)
        return responseToClient(res, {
            data: serviceDetail
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