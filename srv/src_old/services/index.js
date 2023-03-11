const logger = require('../logger');
const jetpack = require('fs-jetpack');

const users = require('./users/users.service.js');
const tables = require('./tables/tables.service.js');
const databases = require('./databases/databases.service.js');
const checkdbs = require('./checkdbs/checkdbs.service.js');
const ldapSearch = require('./ldap-search/ldap-search.service.js');
const forms = require('./forms/forms.service.js');
const sites = require('./sites/sites.service.js');
const appSettings = require('./app-settings/app-settings.service.js');
const confInfos = require('./conf-infos/conf-infos.service.js');
const mjml = require('./mjml/mjml.service.js');
const mkdocs = require('./mkdocs/mkdocs.service.js');
const lstAdusers = require('./lst-adusers/lst-adusers.service.js');
const lstAdfonctions = require('./lst-adfonctions/lst-adfonctions.service.js');
const lstAdservices = require('./lst-adservices/lst-adservices.service.js');
const treeOus = require('./treeous/treeous.service.js');
const pwrutils = require('./pwrutils/pwrutils.service.js');
const adUsers = require('./ad-users/ad-users.service.js');
const adOUs = require('./ad-o-us/ad-o-us.service.js');
const adPCs = require('./ad-p-cs/ad-p-cs.service.js');
const shellssh = require('./shellssh/shellssh.service.js');
const messages = require('./messages/messages.service.js');

const usersInfos = require('./users-infos/users-infos.service.js');

const chartdsi = require('./chartdsi/chartdsi.service.js');
const simtickets = require('./simtickets/simtickets.service.js');
     

const test = require('./test/test.service.js');
//const vvmongo = require("./vvmongo/vvmongo.service.js");

// eslint-disable-next-line no-unused-vars
module.exports = async (app) => {
  app.configure(users);

  //app.configure(vvmongo);

  app.configure(databases);
  app.configure(checkdbs);
  app.configure(ldapSearch);
  app.configure(tables);

  app.configure(messages);
  app.configure(usersInfos);

  app.configure(forms);
  app.configure(sites);
  app.configure(shellssh);

  app.configure(appSettings);
  app.configure(confInfos);
  app.configure(mjml);
  app.configure(mkdocs);
  app.configure(lstAdusers);
  app.configure(lstAdfonctions);
  app.configure(lstAdservices);
  app.configure(treeOus);
  app.configure(pwrutils);

  app.configure(chartdsi);
  app.configure(adUsers);
  app.configure(adOUs);
  app.configure(adPCs);

  app.configure(simtickets);

  app.configure(test);
};
