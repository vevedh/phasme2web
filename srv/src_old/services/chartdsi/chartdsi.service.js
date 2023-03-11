// Initializes the `chartdsi` service on path `/chartdsi`
const { Chartdsi } = require('./chartdsi.class')
const hooks = require('./chartdsi.hooks')

module.exports = function (app) {
  const options = {
    paginate: false,
    multi: true
  }

  // Initialize our service with any options it requires
  app.use('/chartdsi', new Chartdsi(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('chartdsi')

  service.hooks(hooks)
}
