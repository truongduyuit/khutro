const mongoose = require('mongoose')
const {responseToClient} = require('../../helpers/responseToClient.helper')
const serviceService = require('./service.service')

module.exports.CreateService = async (req, res, next) => {
    try {
        const {user} = req
        const service = req.body
        const newService = await serviceService.CreateService(user, service)

        return responseToClient(res, {statusCode: 201,data: newService})
    } catch (error) {
        return next(error)
    }
}

module.exports.GetBlockServices = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query
        const services = await serviceService.GetBlockServices(user, _id)

        return responseToClient(res, {data: services})
    } catch (error) {
        return next(error)
    }
}

module.exports.GetServiceById = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query
        const service = await serviceService.GetServiceById(user, _id)

        return responseToClient(res, {data: service})
    } catch (error) {
        return next(error)
    }
}

module.exports.UpdateService = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {user} = req
        const newService = req.body
        await serviceService.UpdateService(user, newService, session)

        await session.commitTransaction()
        return responseToClient(res, {data: newService})
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
    }
}

module.exports.DeleteService = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {user} = req
        const {_id} = req.query
        const service = await serviceService.DeleteService(user, _id)

        await session.commitTransaction()
        return responseToClient(res, {data: service})
    } catch (error) {
        await session.abortTransaction();
        return next(error)
    } finally {
        session.endSession()
    }
}

module.exports.DeleteServices = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {user} = req
        const {_ids} = req.body
        const services = await serviceService.DeleteServices(user, _ids, session)

        await session.commitTransaction()
        return responseToClient(res, {data: services})
    } catch (error) {
        await session.abortTransaction();
        return next(error)
    } finally {
        session.endSession()
    }
}