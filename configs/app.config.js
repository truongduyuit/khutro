const DATABASE_HOST = 'mongodb://localhost/khutro'
const EMAIL_ACCOUNT = {
  email: 'khutro247@gmail.com',
  password: 's2duychung'
}

const PORT = 3001
const SECRET_KEY = "chungnguyentruongduy"
const TOKEN_LIFE = "11h"

const USER_ROLE_ENUM = {
    ALL: "all",
    ADMIN : "admin",
    OWNER: "owner",
    CUSTOMER: "customer"
}

const USER_ROLES = Object.keys(USER_ROLE_ENUM).map(function(role){
    return USER_ROLE_ENUM[role]
})

module.exports = {
  PORT,
  SECRET_KEY,
  DATABASE_HOST,
  EMAIL_ACCOUNT,
  TOKEN_LIFE,
  USER_ROLES,
  USER_ROLE_ENUM
}