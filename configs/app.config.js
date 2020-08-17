require('dotenv').config()
const DATABASE_HOST = 'mongodb://DESKTOP-JNE0RP1:27017,DESKTOP-JNE0RP1:27018,DESKTOP-JNE0RP1:27019/khutro?replicaSet=rs'

const EMAIL_ACCOUNT = {
  email: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD
}

const PORT = 3001
const SECRET_KEY = process.env.SECRET_KEY
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