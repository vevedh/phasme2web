// Initializes the `adOUs` service on path `/ad-o-us`
const { AdOUs } = require('./ad-o-us.class')
const hooks = require('./ad-o-us.hooks')

module.exports = function (app) {
  const options = {
    paginate: false,
    multi: true
  }

  // Initialize our service with any options it requires
  app.use('/adOUs', new AdOUs(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('adOUs')

  service.hooks(hooks)
}
