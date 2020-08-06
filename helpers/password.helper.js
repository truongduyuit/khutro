const bcrypt = require('bcryptjs')

const HashPassword = async password => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

const ComparePassword = async (password, passwordHashed) => {
  return await bcrypt.compare(password, passwordHashed)
}

module.exports = {
  HashPassword,
  ComparePassword
}