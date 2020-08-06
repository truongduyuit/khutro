// Libraries
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('morgan')

// Modules
const configs = require('./configs/app.config')
require('./configs/mongodb.config')
const routers = require('./src/routers')

// Middleware
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(express.static(`public`))

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
    const status = err.status || 500

    // response to client
    return res.status(status).json({
        error : {
            message : error.message
        }
    })
})

// Server
const port = app.get('port') || configs.PORT
app.listen(port, () => {
    console.log("Server đang mở ở port " + port)
})

module.exports = app