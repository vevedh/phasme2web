const config = require('./config');

const kerberos = require('kerberos');
const ActiveDirectory = require('activedirectory');
const userExists = require('./userExists');
const isMemberOf = require('./isMemberOf');

/**
 * This method will be used to indicate that there was a problem
 * with starting up the server.
 *
 * @param {Response} res
 * @param {Error} err
 */
const forbidden = (res, err) => {
  console.log('Res :',res);
  console.error('Something failed: ' + err);
  res.status(403).send();
};

/**
 * This is some single sign on middleware that will authenticate
 * a user via their SPNEGO & check to see if they're within a
 * specific group.
 */
const sso = async (req, res, next) => {
  const { authorization } = req.headers;
  const { group } = config;

  // If not authorization header exists, return with WWWW-Authenticate Negotiate.
  // This will get the browser to automatically respond with a SPNEGO ticket, if the
  // browser is chrome then the service may need to be whitelisted, as it won't return
  // a SPNEGO ticket by default.
  if (!authorization) {
    res.set('WWW-Authenticate', 'Negotiate');
    return res.status(401).send();
  }

  // Get our SPNEGO ticket
  const ticket = authorization.substring(10);
  let server;

  // This try catch block will just start start the server side
  // kerberos authentication context.
  try {
    server = await kerberos.initializeServer(config.service);
  } catch (err) {
    return forbidden(res, err);
  }

  // This try catch block will just perform the authentication
  // using the snego ticket & the configured kerberos keytab.
  try {
    await server.step(ticket);
  } catch (err) {
    return forbidden(res, err);
  }

  const { username } = server;
  const activeDirectory = new ActiveDirectory(config);

  // This try catch block will simply check that the user
  // exists within the AD domain.
  try {
    await userExists(username, activeDirectory);
  } catch (err) {
    return forbidden(res, err);
  }

  // This try catch block will simply check that the user
  // is a member of a specific AD group, i.e. 'Admin',
  // 'Super User', etc.
  try {
    await isMemberOf(username, group, activeDirectory);
  } catch (err) {
    return forbidden(res, err);
  }

  // As we know that the user has been authenticated & is a member of the given
  // active directory group, we can safely proceed through to
  // execute any further business logic.
  next();
};

module.exports = sso;
