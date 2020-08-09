const serviceModel = require('./service.model')
const blockModel = require('../blocks/block.model')
const _ = require('lodash')

const CreateService = async (userId , service) => {
    try {
        const _services = await GetBlockServices(userId, service.block)
        if (_services.error) return {
            error: {
                message: _services.error.message
            }
        }

        let _error = false
        _services.forEach(_service => {
            if (_service.nameService === service.nameService) {
                _error = true
                return
            }
        })
        if (_error) return {
            error: {
                message: 'Tên dịch vụ đã tồn tại !'
            }
        }

        const newService = new serviceModel(service)
        await newService.save()

        const _block = await blockModel.findById(service.block)
        _block.services.push(newService._id)
        await _block.save()

        return newService
    } catch (error) {
        return new Error(error)
    }
}

const GetBlockServices = async (userId, blockId) => {
    try {
        const _block = await blockModel.findOne({
            _id: blockId,
            owner: userId
        })

        if (!_block) return {
            error:{
                message: 'Khu trọ không tồn tại !'
            }
        }

        if (_block.error) return {
            error:{
                message: _block.error.message
            }
        }

        const _services = await serviceModel.find({
            block: blockId,
            isDeleted: false
        })

        return _services
    } catch (error) {
        return new Error(error)
    }
}

const GetServiceById = async (userId, serviceId) => {
    try {
        const _service = await serviceModel.findById(serviceId)
        if (!_service) return {
            error: {
                message: 'Không tìm thấy dịch vụ !'
            }
        }

        const _services = await GetBlockServices(userId, _service.block.toString())
        let _result = null
        _services.forEach(service => {
            if (service.nameService === _service.nameService){
                _result= service
                return
            }
        })

        if (_result) return _result
        return {
            error: {
                message: 'Không tìm thấy dịch vụ !'
            }
        }
    } catch (error) {
        return new Error(error)
    }
}

const UpdateService = async (userId, service) => {
    try {
        const _services = await GetBlockServices(userId, service.block)
        if (_services.error) return {
            error: {
                message: _services.error.message
            }
        }


        let _error = false
        _services.forEach(_service => {
            if (_service.nameService === service.nameService && _service._id.toString() !== service._id) {
                _error = true
                return
            }
        })
        if (_error) return {
            error: {
                message: 'Tên dịch vụ đã tồn tại !'
            }
        }

        const _service = await serviceModel.findById(service._id)
        if (_service.error) return {
            error:{
                message: _service.error.message
            }
        }

        if (_service.block.toString() !== service.block){
            const _oldBlock = await blockModel.findOne({
                _id: _service.block.toString(),
                isDeleted: false,
                owner: userId
            })

            if (_oldBlock.error) return {
                error: {
                    message: _oldBlock.error.message
                }
            }

            await _service.updateOne({
                nameService: service.nameService ? service.nameService : _service.nameService,
                price: service.price ? service.price : _service.price,
                unit: service.unit ? service.unit : _service.unit,
                block: service.block ? service.block : _service.block
            })
            await _service.save()

            const oldServices = _.remove(_oldBlock.services, service._id)
            await _oldBlock.updateOne({services: oldServices})
            await _oldBlock.save()
            console.log('oldServices', oldServices)

            const _newBlock = await blockModel.findOne({
                _id: service.block.toString(),
                isDeleted: false,
                owner: userId
            })
            await _newBlock.services.push(_service.id)
            await _newBlock.save()

            return "okk"
        }

        await _service.updateOne({
            nameService: service.nameService ? service.nameService : _service.nameService,
            price: service.price ? service.price : _service.price,
            unit: service.unit ? service.unit : _service.unit
        })
        await _service.save()
        return "ok"
    } catch (error) {
        return new Error(error)
    }
}

const DeleteService = async (userId, serviceId) => {
    try {
        const _service = await GetServiceById(userId, serviceId)
        if (_service.error) return {
            error: {
                message: _service.error.message
            }
        }

        await _service.updateOne({
            isDeleted: true
        })
        await _service.save()

        return _service
    } catch (error) {
        return new Error(error)
    }
}

const DeleteServices = async (userId, serviceIds) => {
    try {
        let error = null
        for (let i =0; i < serviceIds.length; i++){
            let _service = await GetServiceById(userId, serviceIds[i])
            console.log("_service", _service)
            if (_service.error) {
                error = _service.error
                return {error} 
            }
        }

        for (let i =0; i < serviceIds.length; i++){
            let _service = await GetServiceById(userId, serviceIds[i])
            await _service.updateOne({
                isDeleted: true
            })
            await _service.save()
        }

        return {error}
    } catch (error) {
        return new Error(error)
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