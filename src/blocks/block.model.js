const mongoose = require('mongoose')
const {Schema} = mongoose

const schema = new Schema({
    NameBlock: {
        type: String,
        required: true,
        unique: true
    },
    Address: String,
    Description: String,
    Images: [String],
    PriceFrom : {
        type: Number,
        default: 0
    },
    PriceTo : {
        type: Number,
        default: 0
    },
    Status: {
        type: Boolean,
        default: true,
    },
    Owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    Rooms: [{
        type: Schema.Types.ObjectId,
        ref: 'room'
    }]
})

module.exports = mongoose.model('block', schema)