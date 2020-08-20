const {throwError} = require('../../helpers/responseToClient.helper')
const Code = require('./service.code')

const blockModel = require('../blocks/block.model')
const serviceModel = require('./service.model')

module.exports.CreateService = async (user , service) => {
    try {
        const services = await GetBlockServices(user, service.block)
        for (let i = 0; i < services.length; ++i) {
            if (services[i].nameService === service.nameService){
                return throwError({
                    errorCode: Code.NAME_SERVICE_EXIST,
                    message: 'Tên dịch vụ đã tồn tại !'
                })
            }
        }

        const newService = new serviceModel(service)
        await newService.save()

        const block = await blockModel.findById(service.block)
        block.services.push(newService._id)
        await block.save()

        return newService
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.CREATE_SERVICE_FAILED
        return throwError(error)
    }
}

module.exports.GetBlockServices = async (user, blockId) => {
    try {
        const services = await serviceModel.find({
            $and: [{
                block: blockId
            }, {
                block: {$in: user.blocks}
            }]
        })
        return services
    } catch (error) {
        return throwError({
            statusCode: 500,
            errorCode: Code.GET_SERVICES_BY_BLOCK_FAILED,
            message: 'Lấy danh sách dịch vụ thất bại !'
        })
    }
}

module.exports.GetServiceById = async (user, serviceId) => {
    try {
        const service = await serviceModel.findOne({
            _id: serviceId,
            block : {$in: user.blocks}
        })

        return service
    } catch (error) {
        return throwError({
            statusCode: 500,
            errorCode: Code.GET_SERVICE_BY_ID_FAILED,
            message: 'Lấy thông tin dịch vụ thất bại !'
        })
    }
}

module.exports.UpdateService = async (user, newService, session) => {
    try {
        const services = await GetBlockServices(user, newService.block)
        for (let i = 0; i < services.length; ++i) {
            if (services[i]._id.toString() !== newService._id && services[i].nameService === newService.nameService){
                return throwError({
                    errorCode: Code.NAME_SERVICE_EXIST,
                    message: 'Tên dịch vụ đã tồn tại !'
                })
            }
        }

        const service = await GetServiceById(user, newService._id)

        if (service.block !== newService.block){
            const oldBlock = await blockModel.findOne({
                _id: service.block,
                isDeleted: false,
                owner: user._id
            })

            oldBlock.services.remove(service._id)
            await oldBlock.save({session})

            const newBlock = await blockModel.findOne({
                _id: newService.block,
                isDeleted: false,
                owner: user._id
            })
            newBlock.services.push(service.id)
            await newBlock.save({session})
        }

        await service.updateOne({...newService}, {session})
        return newService
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.UPDATE_SERVICE_FAILED
        return throwError(error)
    }
}

module.exports.DeleteService = async (user, serviceId, session) => {
    try {
        const service = await GetServiceById(user, serviceId)

        await service.updateOne({
            isDeleted: true
        }, {session})

        return service
    } catch (error) {
        if (!error.errorCode) error.errorCode = Code.DELETE_SERVICE_FAILED
        return throwError(error)
    }
}

module.exports.DeleteServices = async (user, serviceIds, session) => {
    try {
        const deleteServicePromises = []
        for (let i =0; i < serviceIds.length; i++){
            const deleteServicePromise = DeleteService(user, serviceIds[i], session)
            deleteServicePromises.push(deleteServicePromise)
        }
        return await Promise.all(deleteServicePromises)
    } catch (error) {
        return throwError(error)
    }
}