const mongoose = require('mongoose')
const {Schema} = mongoose

const schema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'room',
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'service',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    serviceAmount: {
        type: Number,
        required: true
    },
    ofMonth: {
        type: Date,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    isPay: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('service-detail', schema)