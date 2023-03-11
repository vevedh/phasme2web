// Initializes the `lst-adfonctions` service on path `/lst-adfonctions`
const { LstAdfonctions } = require('./lst-adfonctions.class')
const hooks = require('./lst-adfonctions.hooks')

module.exports = function (app) {
  const options = {
    domain: app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, ''),
    paginate: false
  }

  // Initialize our service with any options it requires
  app.use('/lst-adfonctions', new LstAdfonctions(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('lst-adfonctions')

  service.hooks(hooks)
}
