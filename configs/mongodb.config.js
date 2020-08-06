const mongoose = require('mongoose')
const configs = require('./app.config')

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(configs.DATABASE_HOST, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.once('open', ()=> {
    console.log("Kết nối database thành công !")
}).on('error', () => {
    console.log("Kết nối database thất bại !")
})