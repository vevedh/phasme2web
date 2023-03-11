// Initializes the `confInfos` service on path `/conf-infos`
const { Mjml } = require('./mjml.class')
const hooks = require('./mjml.hooks')

module.exports = function (app) {
  const options = {
    paginate: false
  }

  // Initialize our service with any options it requires
  app.use('/mjml', new Mjml(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('mjml')

  service.hooks(hooks)
}
