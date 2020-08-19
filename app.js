// Libraries
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('./helpers/logger')
const compression = require('compression')

// Modules
const configs = require('./configs/app.config')
require('./configs/mongodb.config')
const routers = require('./src/routers')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(`public`))
app.use(compression())

// routers
app.use('/api', routers)

// Catch 404 error & forward to handler
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}

    logger.log('error', req.originalUrl + ` | ${error.errorCode}`)
    return res.status(error.statusCode).json({
        success: false,
        error: {
            statusCode: error.statusCode,
            errorCode: error.errorCode,
            message: error.message
        },
        options: error.options
    })
})

// Server
const port = app.get('port') || configs.PORT
app.listen(port, () => {
    logger.log('debug' ,"Server đang mở ở port " + port)
})

module.exports = app