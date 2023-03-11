// Initializes the `test` service on path `/test`
const { ShellSsh } = require('./shellssh.class')
//const createModel = require('../../models/test.model')
const hooks = require('./shellssh.hooks')

module.exports = function (app) {
  const options = {
    //Model: createModel(app),
    paginate: false//app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/shellssh', new ShellSsh(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('shellssh')

  service.hooks(hooks);
}
