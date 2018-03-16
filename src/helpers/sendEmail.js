const sgMail = require('@sendgrid/mail')
const User = require('../models/User')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sgMail.setSubstitutionWrappers('{{', '}}')

const sendEmails = (emails, content) => {
  const msg = {
    to: emails,
    from: 'opentourismplatform@gmail.com',
    templateId: '0839aec2-dd34-459d-9493-4fd9682b9073',
    substitutions: {
      name: content.en.name,
      id: content._id
    }
  }

  sgMail
    .sendMultiple(msg)
}

module.exports = content =>
  new Promise((resolve, reject) =>
    User.find({ role: { $not: /BASIC/ } }, 'email')
      .then(emails => sendEmails(emails, content))
      .then(() => resolve(content))
      .catch(reject))
