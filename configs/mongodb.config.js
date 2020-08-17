const mongoose = require('mongoose')
const configs = require('./app.config')

const billSchema = require('../src/bills/bill.model')

mongoose.connect(configs.DATABASE_HOST,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
    console.log("Kết nối database thành công !")
}).on('error', () => {
    console.log("Kết nối database thất bại !")
})

if (!mongoose.models.bills) {
    billSchema.createCollection()
}