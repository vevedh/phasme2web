// Initializes the `test-mongo` service on path `/test-mongo`
const { TestMongo } = require('./test-mongo.class')
const hooks = require('./test-mongo.hooks')

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/test-mongo', new TestMongo(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('test-mongo')

  service.hooks(hooks)
}
