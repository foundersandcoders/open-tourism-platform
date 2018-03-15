const sgMail = require('@sendgrid/mail')
const User = require('../models/User')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sgMail.setSubstitutionWrappers('{{', '}}')

const sendEmails = (emails, content) =>
  new Promise((resolve, reject) => {
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
      .then(resolve)
      .catch(reject)
  })

const extractEmails = users =>
  users.reduce((acc, curr) => {
    if (curr.role !== 'BASIC') {
      return acc.concat(curr.email)
    }
    return acc
  }, [])

module.exports = content =>
  new Promise((resolve, reject) =>
    User.find()
      .then(extractEmails)
      .then((emails) => sendEmails(emails, content))
      .then(() => resolve(content))
      .catch(reject))
