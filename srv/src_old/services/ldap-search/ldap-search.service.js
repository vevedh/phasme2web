// Initializes the `ldapSearch` service on path `/ldap-search`
const { LdapSearch } = require('./ldap-search.class');
const hooks = require('./ldap-search.hooks');

module.exports = function (app) {
  const options = {
    paginate: false,
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/ldap-search', new LdapSearch(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('ldap-search');

  service.hooks(hooks);
};
