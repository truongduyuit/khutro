const mongoose = require('mongoose')
const {Schema} = mongoose
const configs = require('../../configs/app.config')

const schema = new Schema({
  Email: {
    type: String,
    unique: true,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  Role: {
    type: String,
    enum: configs.USER_ROLE,
    default: "owner"
  },
  Confirmed: {
    type: Boolean,
    default: false
  },
  FullName: String,
  Address: String,
  PhoneNumber: String,
  DateJoined: {
    type: Date,
    default: Date.now()
  },
  Blocks:[{
      type: Schema.Types.ObjectId,
      ref: 'block'
  }]
})

module.exports = mongoose.model('user', schema)