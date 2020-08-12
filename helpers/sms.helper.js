require('dotenv').config()

const sms = require('twilio')(
    process.env.ACCOUNT_SID,
    process.env.AUTH_TOKEN
)

const sendSMS = async (from, to, body) => {
    const _result = sms.messages.create({
        from,
        to,
        body
    })

    return _result
}


module.exports = {
    sendSMS
}