// Initializes the `projets` service on path `/sites`
const { Sites } = require('./sites.class')
// const createModel = require('../../models/sites.model');
const hooks = require('./sites.hooks')

module.exports = function (app) {
  const options = {
    paginate: false
  }

  // Initialize our service with any options it requires
  app.use('/sites', new Sites(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('sites')

  service.hooks(hooks)
}
