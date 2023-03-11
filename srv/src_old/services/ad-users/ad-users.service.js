// Initializes the `adUsers` service on path `/ad-users`
const { AdUsers } = require('./ad-users.class');

const hooks = require('./ad-users.hooks');

module.exports = function (app) {



  const options = {
    paginate: false,
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/adUsers', new AdUsers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('adUsers');

  service.hooks(hooks);
};
