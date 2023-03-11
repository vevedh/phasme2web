// Initializes the `lst-adfonctions` service on path `/lst-adfonctions`
const { TreeOUs } = require('./treeous.class')
const hooks = require('./treeous.hooks')

module.exports = function (app) {
  const options = {
    domain: app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, ''),
    paginate: false
  }

  // Initialize our service with any options it requires
  app.use('/treeous', new TreeOUs(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('treeous')

  service.hooks(hooks)
}
