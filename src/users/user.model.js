const mongoose = require('mongoose')
const {Schema} = mongoose
const configs = require('../../configs/app.config')

const schema = new Schema({
  email: {
    type: String
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
  isDeleted: {
    type: Boolean,
    default: false
  },
  blocks:[{
    type: Schema.Types.ObjectId,
    ref: 'block',
  }],
  room: {
    type: Schema.Types.ObjectId,
    ref: 'room',
  },
  outOfDay: {
    type: Date,
    default: Date.now()
  }
}, {
    timestamps: true
})

module.exports = mongoose.model('user', schema)