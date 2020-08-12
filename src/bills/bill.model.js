const mongoose = require('mongoose')
const {Schema} = mongoose

const schema =new Schema({
    title: {
        type: String,
        required: true,
        min: 6,
        max: 500
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'room'
    },
    roomPrice: Number,
    roomTotalAmount: Number,
    customers: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'service-detail'
    }],
    serviceTotalAmount: Number,
    totalBillAmount: {
        type: Number,
        required: true
    },
    isPay: {
        type: Boolean,
        default: false
    },
    dateCheckout: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('bill', schema)