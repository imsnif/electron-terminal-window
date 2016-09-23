const path = require('path')
const MailGun = require('mailgun-es6')
const mailGun = new MailGun({
  privateApi: process.env.MAILGUN,
  publicApi: process.env.MAILGUN,
  domainName: 'sandboxffb8b5b920c4475bb7a5a3d8f597adbe.mailgun.org'
})

Promise.resolve()
.then(() => mailGun.sendEmail({
  to: ['grimsniffer@gmail.com'],
  from: 'grimsniffer@gmail.com',
  subject: 'Email Subject',
  text: 'Email Text',
  attachment: {
    fType: 'image/png',
    fLoc: path.resolve(__dirname, '..', 'test', 'screenshots', 'debug.png')
  }
}))
.then(result => console.log('success:', result))
.catch(e => console.log('failure:', e))
