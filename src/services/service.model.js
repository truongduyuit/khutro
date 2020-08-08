const mongoose = require('mongoose')
const {Schema} = mongoose

const schema = new Schema({
    nameService: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    block: {
        type: Schema.Types.ObjectId,
        ref : 'block'
    }
})

module.exports = mongoose.model('service', schema)