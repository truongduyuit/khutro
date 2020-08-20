const mongoose = require('mongoose')
const {responseToClient} = require('../../helpers/responseToClient.helper')
const logger = require('../../helpers/logger')
const billService = require('./bill.service')

module.exports.CreateBill = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {user} = req
        const bill = req.body
        const newBill = await billService.CreateBill(user, bill, session)

        logger.log('info', req.originalUrl)
        await session.commitTransaction()
        return responseToClient(res, {data: newBill})
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
    }
}

module.exports.GetBillByOwner = async (req, res, next) => {
    try {
        const {user} = req
        const bills = await billService.GetBillByOwner(user)

        logger.log('info', req.originalUrl)
        return responseToClient(res, {data: bills})
    } catch (error) {
        return next(error)
    }
}

module.exports.GetBillByCustomer = async (req, res, next) => {
    try {
        const {user} = req
        const bills = await billService.GetBillByCustomer(user)

        logger.log('info', req.originalUrl)
        return responseToClient(res, {data: bills})
    } catch (error) {
        return next(error)
    }
}
module.exports.GetBillByRoom = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query
        const bills = await billService.GetBillByRoom(user, _id)

        logger.log('info', req.originalUrl)
        return responseToClient(res, {data: bills})
    } catch (error) {
        return next(error)
    }
}

module.exports.GetBillById = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query
        const bill = await billService.GetBillById(user, _id)

        logger.log('info', req.originalUrl)
        return responseToClient(res, {data: bill})
    } catch (error) {
        return next(error)
    }
}

module.exports.UpdateBill = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {user} = req
        const newBill = req.body
        await billService.UpdateBill(user, newBill, session)

        logger.log('info', req.originalUrl)
        await session.commitTransaction()
        return responseToClient(res, {data: newBill})
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
    }
}

module.exports.DeleteBill = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {user} = req
        const {_id} = req.query
        const bill = await billService.DeleteBill(user, _id, session)

        logger.log('info', req.originalUrl)
        await session.commitTransaction()
        return responseToClient(res, {data: bill})
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
    }
}