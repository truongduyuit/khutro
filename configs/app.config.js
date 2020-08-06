const DATABASE_HOST = 'mongodb://localhost/khutro'
const EMAIL_ACCOUNT = {
  email: 'khutro247@gmail.com',
  password: 's2duychung'
}

const PORT = 3001
const SECRET_KEY = "chungnguyentruongduy"
const USER_ROLE = ["admin", "owner", "customer"]
const TOKEN_LIFE = "1h"

module.exports = {
  PORT,
  SECRET_KEY,
  DATABASE_HOST,
  EMAIL_ACCOUNT,
  TOKEN_LIFE,
  USER_ROLE
}