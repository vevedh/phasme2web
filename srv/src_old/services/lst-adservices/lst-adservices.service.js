// Initializes the `lst-adservices` service on path `/lst-adservices`
const { LstAdservices } = require('./lst-adservices.class')
const hooks = require('./lst-adservices.hooks')

module.exports = function (app) {
  const options = {
    domain: app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, ''),
    paginate: false
  }

  // Initialize our service with any options it requires
  app.use('/lst-adservices', new LstAdservices(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('lst-adservices')

  service.hooks(hooks)
}
