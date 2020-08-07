const mongoose = require('mongoose')
const {Schema} = mongoose

const schema = new Schema({
    nameRoom: {
        type: String,
        required: true
    },
    floor: Number,
    square: Number,
    price: Number,
    description: String,
    maxPeople: Number,
    isDeleted: {
        type: Boolean,
        default: false,
    },
    block: {
        type: Schema.Types.ObjectId,
        ref: 'block'
    },
    customers: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
})

module.exports = mongoose.model('room', schema)