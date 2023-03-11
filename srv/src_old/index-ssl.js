const express = require('@feathersjs/express');
const feathers = require('@feathersjs/feathers');
const https = require('https');
const http = require('http');
const fs = require('fs');
const WebSocketServer = require('ws');
const fsjetpack = require('fs-jetpack');
const os = require('os');

const logger = require('./logger');
const app = require('./app');


const port = app.get('port');
const hostname = app.get('kerberos').fqdn.split('.')[0];
const domain = app.get('kerberos').fqdn.split('.')[1]+'.'+app.get('kerberos').fqdn.split('.')[2];

if (
  fsjetpack.exists(__dirname + `/${hostname}.${domain}.pem`) == 'file' &&
  fsjetpack.exists(__dirname + `/${hostname}.${domain}-key.pem`) == 'file'
) {
  const server = https
    .createServer(
      {
        key: fs.readFileSync(__dirname + `/${hostname}.${domain}-key.pem`),
        cert: fs.readFileSync(__dirname + `/${hostname}.${domain}.pem`),
      },
      app
    )
    .listen(port);


  if (os.platform() === 'win32') {
    const { sso } = require('node-expose-sspi');

    appA.use(sso.auth({ forceNTLM: true }));

    appA.use('/auth/sso', (req, res, next) => {
      res.json({
        sso: req.sso,
      });
    });
  }

  //app.listen(3000, () => console.log('Server started on port 3000'));
  //  redirige toutes les requetes http (80) vers https (port)
  /*appA.get('*', (req, res, next) => {
    if (req.path != '/auth/sso') {
      res.redirect('https://' + req.headers.host + ':' + port + '/' + req.path);
    }
  });
 */
  const wss = new WebSocketServer({ server });

  // initialise les serveurs
  app.setup(wss);
  //appA.setup(unsecure);

  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
  );

  server.on('listening', () =>
    logger.info(
      'Serveur web ssl démarré : https://%s:%d',
      app.get('host'),
      port
    )
  );


} else {
  const unsecure = http.createServer(app).listen(port);
  app.setup(unsecure);
  unsecure.on('listening', () =>
    logger.info('Serveur special démarré : http://%s:%d', app.get('host'), port)
  );
}
