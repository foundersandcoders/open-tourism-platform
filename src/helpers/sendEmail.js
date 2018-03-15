const sgMail = require('@sendgrid/mail')
const User = require('../models/User')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sgMail.setSubstitutionWrappers('{{', '}}')

const sendEmails = (emails, content) =>
  new Promise((resolve, reject) => {
    const msg = {
      to: emails,
      from: 'opentourismplatform@gmail.com',
      templateId: '84dc4053-b395-42d3-b204-1770b20995cc',
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
