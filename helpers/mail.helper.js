const nodemailer = require('nodemailer')
const configs = require('../configs/app.config')

const sendMail = (fromE, toE, subjectE, textE, htmlE) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configs.EMAIL_ACCOUNT.email, 
      pass: configs.EMAIL_ACCOUNT.password, 
    },
  });

  let mailOptions = {
    from: fromE,
    to: toE,
    subject: subjectE,
    text: textE,
    html: htmlE,
  }

 transporter.sendMail(mailOptions, function(error, response){
  if(error) return error
  else return response
 })
}

module.exports = {
  sendMail
}