// Initializes the `lst-adusers` service on path `/lst-adusers`
const { LstAdusers } = require('./lst-adusers.class')
const hooks = require('./lst-adusers.hooks')

module.exports = function (app) {
  const options = {
    domain: app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, ''),
    paginate: false
  }

  // Initialize our service with any options it requires
  app.use('/lst-adusers', new LstAdusers(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('lst-adusers')

  service.hooks(hooks)
}
