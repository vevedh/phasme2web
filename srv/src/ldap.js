
import { logger } from './logger.js'

export const ldap = function (app) {
  const configuration = app.get('authentication').ldap;
  const clientLdap = require('ldapjs').createClient({
    url: configuration.url,
    bindDN:configuration.bindDN,
    bindCredentials: configuration.bindCredentials,
    reconnect: true,
    idleTimeout: 2592000,
    tlsOptions: { rejectUnauthorized: false }
  });
  app.set('ldapClient', clientLdap);

  logger.info('Ldap configuration : %j', configuration);
  if (clientLdap.connected) {
    try {
      clientLdap.undind();
    } catch (error) {
      console.log('Fermer avant la connexion');
    }


  }
  clientLdap.bind(configuration.bindDN, configuration.bindCredentials, (err, res) => {
    if (err) {
      logger.info('Echec init de connexion ldap !');
      app.set('ldap_ok', false);
    }
    if (res) {
      logger.info('Connexion init ldap etablie avec succès!');
      if (clientLdap.connected) {
        app.set('ldapClient', clientLdap);
        app.set('ldap_ok', true);
      }
    }
  });
};
