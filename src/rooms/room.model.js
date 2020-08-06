const mongoose = require('mongoose')
const {Schema} = mongoose

const schema = new Schema({
    NameRoom: {
        type: String,
        required: true,
        unique: true
    },
    Floor: Number,
    Square: Number,
    Price: Number,
    Description: String,
    MaxPeople: Number,
    Status: Number,
    Block: {
        type: Schema.Types.ObjectId,
        ref: 'block'
    }
})

module.exports = mongoose.model('room', schema)