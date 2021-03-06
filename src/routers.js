const express = require('express')
const routers = express.Router();

const userRouter = require('./users/user.router')
const blockRouter = require('./blocks/block.router')
const roomRouter = require('./rooms/room.router')
const serviceRouter = require('./services/service.router')
const customerRouter = require('./customers/customer.router')
const billRouter = require('./bills/bill.router')
const serviceDetailRouter = require('./service-details/service-detail.router')

const Upload = require('../middlewares/uploadFiles')

routers.use('/user', userRouter)
routers.use('/block', blockRouter)
routers.use('/room', roomRouter)
routers.use('/service', serviceRouter)
routers.use('/customer', customerRouter)
routers.use('/bill', billRouter)
routers.use('/service-detail', serviceDetailRouter)

routers.post('/upload-image', Upload.array('myImages', 10), (req,res, next) => {
    const paths = []
    req.files.forEach(file => {
        paths.push(file.path.split('public\\')[1])
    })

    return res.status(200).json({
        paths
    })
})

module.exports = routers