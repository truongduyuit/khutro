const mongoose = require('mongoose')
const {Schema} = mongoose
const configs = require('../../configs/app.config')

const schema = new Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: configs.USER_ROLES,
    default: "owner"
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  fullName: String,
  address: String,
  phoneNumber: String,
  dateJoined: {
    type: Date,
    default: Date.now()
  },
  blocks:[{
      type: Schema.Types.ObjectId,
      ref: 'block'
  }]
})

module.exports = mongoose.model('user', schema)