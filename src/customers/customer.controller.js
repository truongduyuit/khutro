const mongoose = require('mongoose')

const {responseToClient} = require('../../helpers/responseToClient.helper')
const logger = require('../../helpers/logger')
const customerService = require('./customer.service')

const CreateCustomer = async (req, res, next) => {
    try {
        const {user} = req
        const customer = req.body

        const newCustomer = await customerService.CreateCustomer(user, customer)
        logger.log('info', req.originalUrl)
        return responseToClient(res, {
            data: newCustomer
        })
    } catch (error) {
        return next(error)
    }
}

const GetCustomersByOwner = async (req, res, next) => {
    try {
        const {user} = req
        const customer = req.body

        const customers = await customerService.GetCustomersByOwner(user, customer)
        logger.log('info', req.originalUrl)
        return responseToClient(res, {
            data: customers
        })
    } catch (error) {
        return next(error)
    }
}

const GetCustomerById = async (req, res, next) => {
    try {
        const {user} = req
        const {_id} = req.query

        const customer = await customerService.GetCustomerById(user, _id)
        logger.log('info', req.originalUrl)
        return responseToClient(res, {
            data: customer
        })
    } catch (error) {
        return next(error)
    }
}

const UpdateCustomer = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {user} = req
        const newCustomer = req.body

        await customerService.UpdateCustomer(user, newCustomer,session)

        logger.log('info', req.originalUrl)
        await session.commitTransaction()
        return responseToClient(res, {
            data: newCustomer
        })
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
    }
}

const DeleteCustomer = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {user} = req
        const {_id} = req.query

        const customer = await customerService.DeleteCustomer(user, _id, session)
        logger.log('info', req.originalUrl)
        await session.commitTransaction()
        return responseToClient(res, {
            data: customer
        })
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
    }
}

const DeleteCustomers = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {user} = req
        const {_ids} = req.body

        const customers = await customerService.DeleteCustomers(user, _ids, session)
        logger.log('info', req.originalUrl)
        await session.commitTransaction()
        return responseToClient(res, {
            data: customers
        })
    } catch (error) {
        await session.abortTransaction()
        return next(error)
    } finally {
        session.endSession()
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