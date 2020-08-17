const mongoose = require('mongoose')
const {Schema} = mongoose

const schema = new Schema({
    nameBlock: {
        type: String,
        required: true,
        unique: true
    },
    address: String,
    description: String,
    images: [String],
    priceFrom : {
        type: Number,
        default: 0
    },
    priceTo : {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: 'room'
    }],
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'service'
    }]
},{
    timestamps: true
})

module.exports = mongoose.model('block', schema)