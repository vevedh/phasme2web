// Initializes the `simtickets` service on path `/simtickets`
const { Simtickets } = require('./simtickets.class');
const hooks = require('./simtickets.hooks');

module.exports = function (app) {
  const options = {
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/simtickets', new Simtickets(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('simtickets');

  service.hooks(hooks);
};
