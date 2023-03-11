// Initializes the `/mailer` service on path `/mailer`
const hooks = require('./smailer.hooks');
const Mailer = require('feathers-mailer');
//const vvtool = require('../../encrypt2');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function (app) {
  app.use('/smailer', Mailer(smtpTransport({
    host: 'mail.cacem.fr',
    secure: false, //true
    port: 587,
    auth: {
      user: 'notification@cacem.fr',
      pass: app.get('authentication').secret //vvtool.decrypt(app.get('authentication').secret,app.get('mailTransport').auth.pass)
    }
  })));

  const service = app.service('smailer');
  service.hooks(hooks);
};
