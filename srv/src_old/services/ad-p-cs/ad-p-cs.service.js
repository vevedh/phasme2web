// Initializes the `adPCs` service on path `/ad-p-cs`
const { AdPCs } = require('./ad-p-cs.class')
const hooks = require('./ad-p-cs.hooks')

module.exports = function (app) {
  const options = {
    paginate: false,
    multi: true
  }

  // Initialize our service with any options it requires
  app.use('/adPCs', new AdPCs(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('adPCs')

  service.hooks(hooks)
}
