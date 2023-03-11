const express = require('@feathersjs/express');
const logger = require('../logger');
const powershell = require('node-powershell');
const npwrshell = require('powershell');
const si = require('systeminformation');
const multer = require('multer');
const mjml2html = require('mjml')
const jetpack = require('fs-jetpack');
const mailer = require('feathers-mailer');
const nodemailer = require('nodemailer');
const word = require('./word');
const hello = require('./hello');
const conf = require('./conf');
//const auth_sso = require('./auth-sso');
const path = require('path');
const exec = require('child-process-promise').exec;
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const NeDB = require('nedb');
const shellParser = require('node-shell-parser');
const fs = require('fs');
const os = require('os');
const ntlm = require('express-ntlm');
// We need this to create the MD5 hash
const crypto = require('crypto');
const base64js = require('base64-js');
const { authenticate } = require('@feathersjs/express');
const { spauth } = require('node-sp-auth');
const decodeSearchEntry = require('../decodeSearchEntry');
//const vvtool = require('../encrypt2');

const ovh = require('ovh')({
  endpoint: 'ovh-eu',
  appKey: 'mRtM2J1gyIRSmsNq',
  appSecret: 'qTcasoglcb6kqCn5ccGbfrfUEW1hKv05',
  consumerKey: '09PEelE6r7NClojT2RjJn0DY9byU9qyk',
});

/*const ovh = require('ovh')({
  endpoint: 'ovh-eu',
  appKey: 'qvl2OaYbyzFVqxFa',
  appSecret: 'RW2edrt8IWGMelAWu7mZuel9REvWzvRb',
  consumerKey: 'o7tFW2dp7UJn9MgQgQ0FA3vlJswAoX7P'
})*/
/*cacem-adm
#Application Description
Admin DSI CACEM
#Application Key
qvl2OaYbyzFVqxFa
#Application Secret
RW2edrt8IWGMelAWu7mZuel9REvWzvRb
"validationUrl": "https://eu.api.ovh.com/auth/?credentialToken=KCPAjYm7iVsGAXkYvLUENVcnOiHdFWmVmRpkilQofUFKSVgl9GAmCvMqAuykJdz2",
"consumerKey": "o7tFW2dp7UJn9MgQgQ0FA3vlJswAoX7P",
"state": "pendingValidation"
*/

var storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '../../../uploads'); // process.cwd()+'/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    // cb(null, file.fieldname + '-' + Date.now())
  },
});

var storagePubFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '../../../public/assets'); // process.cwd()+'/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    // cb(null, file.fieldname + '-' + Date.now())
  },
});

var upload = multer({
  storage: storageFile,
});

var uploadPub = multer({
  storage: storagePubFile,
});

logger.info(
  'Chemin des fichiers d\'uploads de fichiers : %s',
  path.resolve(__dirname + '../../../uploads')
);

// eslint-disable-next-line no-unused-vars
module.exports = async (app) => {
  var checkSysInfos = () => {
    return new Promise((resolve, reject) => {
      si.system()
        .then((data) => {
          logger.info('System : %j', data);
          app.system = data;
          // resolve(true);
          si.chassis().then((data) => {
            logger.info('Chassis : %j', data);
            app.chassis = data;
            si.osInfo().then((data) => {
              logger.info('OsInfos : %j', data);
              app.osInfos = data;
              si.versions().then((data) => {
                logger.info('Versions : %j', data);
                app.versions = data;

                resolve(true);
              });
            });
          });
        })
        .catch((err) => {
          reject(err);
          logger.info('Erreur : %j', err);
        });
    });
  };

  const getRestCollections = () => {
    return new Promise((resolve, reject) => {
      app.get('mongoClientRest').then(async (client) => {
        // logger.info("Client connected",client)
        // logger.info("DBO :",client)
        client.listCollections().toArray((err, collectionInfos) => {
          logger.info(collectionInfos);
          var collections = JSON.parse(JSON.stringify(collectionInfos));
          resolve(collections);
        });
      });
    });
  };

  const getCollections = () => {
    return new Promise((resolve, reject) => {
      app.get('mongoClient').then(async (client) => {
        client.listCollections().toArray((err, collectionInfos) => {
          logger.info(collectionInfos);
          var collections = JSON.parse(JSON.stringify(collectionInfos));
          resolve(collections);
        });
      });
    });
  };

  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(binary).toString('base64');
  };

  const ldapSearch = (filter) => {

    const configuration = app.get('authentication').ldap;
    const client = app.get('ldapClient');

    if (client.connected) {
      try {
        client.undind();
      } catch (error) {
        console.log('End search');
      }

    }

    if (!client.connected) {
      client.bind(configuration.bindDN, configuration.bindCredentials, (err, res) => {
        if (err) {
          console.log('Echec auth-sso de connexion ldap !');
        }
        if (res) {
          console.log('Connexion auth-sso ldap etablie avec succès!');
        }
      });
    }

    var opts = {
      //  filter: '(objectClass=*)',  //simple search
      //  filter: '(&(uid=2)(sn=John))',// and search
      filter: filter, // '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      sizeLimit: 0,
      paged: false,
      //attributes: adMap.filter(elt => attribs.includes(elt.ad)).map(obj => (obj.ld))
    };

    return new Promise((resolve, reject) => {
      if (!Date.fromLDAPString) {
        Date.fromLDAPString = function (s) {
          var b = s.match(/\d\d/g);
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

          return (new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]))).toLocaleDateString('fr-FR', options);
        };
      }

      var values = [];
      client.search(configuration.searchBase, opts, (err, resp) => {
        if (err) {
          console.log('Error in search ' + err);
        } else {
          resp.on('searchEntry', (entry) => {
            //console.log('entry: ' + JSON.stringify(entry.object));
            values.push(entry);
          });
          resp.on('searchReference', (referral) => {
            console.log('referral: ' + referral.uris.join());
          });
          resp.on('error', (err) => {
            console.error('error: ' + err.message);
            reject(err);
          });
          resp.on('end', () => {
            try {
              client.undind();
            } catch (error) {
              console.log('End search');
            }

            // console.log('status: ' + result.status);

            let value;
            if (values && values.length > 0) {
              value = decodeSearchEntry(values[0]);
            } else {
              value = {};
            }
           // console.log('Ldap search result :',value);
            resolve(value);
          });
        }
      });

    });
  };

  const updateAdOUs = (domain) => {
    // Get-ADOrganizationalUnit -Filter {Name -like '*'} | select name,DistinguishedName,@{n=’OUPath’;e={$_.distinguishedName -replace '^.+?,(CN|OU.+)','$1'}} | convertto-json -compress
    return new Promise((resolve, reject) => {
      logger.info(
        `Initialisation de la table des OUs du domaine  ${domain}....`
      );
      app
        .service('adOUs')
        .find({})
        .then((datas) => {
          resolve(datas);
        })
        .catch((err) => {
          reject(err);
          logger.info('Les dernières données resterons inchangées!');
        });
    });
  };

  const updateAdUsers = (domain) => {
    return new Promise((resolve, reject) => {
      logger.info(
        `Initialisation de la table des utilisateurs du domaine  ${domain}....`
      );
      app
        .service('adUsers')
        .find({})
        .then((datas) => {
          resolve(datas);
        })
        .catch((err) => {
          reject(err);
          logger.info('Les dernières données resterons inchangées!');
        });
    });
  };

  const updateAdPcs = (domain) => {
    return new Promise((resolve, reject) => {
      logger.info(
        `Initialisation de la table des PCS du domaine  ${domain}....`
      );
      app
        .service('adPCs')
        .find({})
        .then((datas) => {
          resolve(datas);
        })
        .catch((err) => {
          reject(err);
          logger.info('Les dernières données resterons inchangées!');
        });
    });
  };

  const ldapSpeSearch = (filter, attribs) => {
    const adMap = [
      { ad: 'Name', ld: 'name' }, { ad: 'GivenName', ld: 'givenName' }, { ad: 'Description', ld: 'description' }, { ad: 'Office', ld: 'physicalDeliveryOfficeName' }, { ad: 'SamAccountName', ld: 'sAMAccountName' },
      { ad: 'UserPrincipalName', ld: 'userPrincipalName' }, { ad: 'ThumbnailPhoto', ld: 'thumbnailPhoto' }, { ad: 'DisplayName', ld: 'displayName' }, { ad: 'Company', ld: 'company' },
      { ad: 'Department', ld: 'department' }, { ad: 'City', ld: 'l' }, { ad: 'HomePhone', ld: 'homePhone' }, { ad: 'mail', ld: 'mail' }, { ad: 'OfficePhone', ld: 'telephoneNumber' }, { ad: 'IPPhone', ld: 'ipPhone' },
      { ad: 'MobilePhone', ld: 'mobile' }, { ad: 'PostalCode', ld: 'postalCode' }, { ad: 'StreetAddress', ld: 'streetAddress' }, { ad: 'co', ld: 'co' }, { ad: 'Surname', ld: 'sn' }, { ad: 'Manager', ld: 'manager' },
      { ad: 'EmployeeNumber', ld: 'employeeNumber' }, { ad: 'MemberOf', ld: 'memberOf' }, { ad: 'Enabled', ld: 'userAccountControl' }, { ad: 'CannotChangePassword', ld: 'userAccountControl' },
      { ad: 'PasswordNeverExpires', ld: 'userAccountControl' }, { ad: 'AccountExpirationDate', ld: 'accountExpires' }, { ad: 'whenChanged', ld: 'whenChanged' }, { ad: 'whenCreated', ld: 'whenCreated' }, { ad: 'LastLogonDate', ld: 'modifyTimeStamp' }
    ];
    const client = app.get('ldapClient');
    client.bind(app.get('authentication').ldap.bindDN, app.get('authentication').ldap.bindCredentials, (err, res) => {
      if (err) {
        logger.info('Echec de connexion ldap !');
      }
      if (res) {
        logger.info('Connexion ldap etablie !');
      }
    });
    var opts = {
      //  filter: '(objectClass=*)',  //simple search
      //  filter: '(&(uid=2)(sn=John))',// and search
      filter: filter, // '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      sizeLimit: 3000,
      paged: true,
      attributes: adMap.filter(elt => attribs.includes(elt.ad)).map(obj => (obj.ld))
    };

    return new Promise((resolve, reject) => {
      if (!Date.fromLDAPString) {
        Date.fromLDAPString = function (s) {
          var b = s.match(/\d\d/g);
          return new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]));
        };
      }

      var valentry = [];
      client.search(app.get('authentication').ldap.searchBase, opts, (err, resp) => {
        if (err) {
          console.log('Error in search ' + err);
        } else {
          resp.on('searchEntry', (entry) => {
            //console.log('entry: ' + JSON.stringify(entry.object));
            if (entry.object) {
            // console.log('Attributes :',attribs);
              var obj = {};
              var entries = JSON.parse(JSON.stringify(entry.object));

              attribs.forEach((attrib) => {
                // console.log('Attribut :',attrib);
                if (adMap.filter(elt => elt.ad == attrib).length > 0) {
                  // console.log("Attrib map :",adMap.filter(elt => elt.ad == attrib))
                  const eqattrib = adMap.filter(elt => elt.ad == attrib)[0].ld;
                  const objattrib = adMap.filter(elt => elt.ad == attrib)[0].ad;
                  // obj[objattrib] = (entries[eqattrib])?entries[eqattrib]:null;
                  switch (eqattrib) {
                  case 'userAccountControl':
                    /**
                        512 = normal account, enabled,
                        514 = 512 + 2 = normal account, disabled
                        546 = 512 + 32 + 2 = normal account, disabled, no password required
                      2080 = 2048 + 32 = Interdomain trust, no password required
                      66048 = 65536 + 512 = normal account. password never expires
                      66050 = 65536 + 512 + 2 = normal account. password never expires, disabled
                      66080 = 65536 + 512 + 32 = normal account. password never expires, no password required
                       */
                    switch (entries[eqattrib]) {
                    case '512':
                      obj.Enabled = 'true';
                      obj.CannotChangePassword = null;
                      obj.PasswordNeverExpires = null;
                      break;
                    case '514':
                      obj.Enabled = 'false';
                      obj.CannotChangePassword = null;
                      obj.PasswordNeverExpires = null;
                      break;
                    case '546':
                      obj.Enabled = 'false';
                      obj.CannotChangePassword = null;
                      obj.PasswordNeverExpires = null;
                      break;
                    case '2080':
                      obj.Enabled = 'true';
                      obj.CannotChangePassword = null;
                      obj.PasswordNeverExpires = null;
                      break;
                    case '66048':
                      obj.Enabled = 'true';
                      obj.CannotChangePassword = null;
                      obj.PasswordNeverExpires = true;
                      break;
                    case '66050':
                      obj.Enabled = 'false';
                      obj.CannotChangePassword = null;
                      obj.PasswordNeverExpires = true;
                      break;
                    case '66080':
                      obj.Enabled = 'true';
                      obj.CannotChangePassword = null;
                      obj.PasswordNeverExpires = true;
                      break;

                    default:
                      break;
                    }

                    break;

                  case 'accountExpires':
                    // new Date(n/1e4 - 1.16444736e13);
                    obj.AccountExpirationDate = (new Date(Number(String(entries[eqattrib]).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString();
                    break;
                  case 'whenChanged':

                    obj.whenChanged = (new Date(Date.fromLDAPString(String(entries[eqattrib])))).toLocaleString();
                    break;
                  case 'modifyTimeStamp':
                    obj.LastLogonDate = (new Date(Date.fromLDAPString(String(entries[eqattrib])))).toLocaleString();
                    break;
                  case 'whenCreated':
                    obj.whenCreated = (new Date(Date.fromLDAPString(String(entries[eqattrib])))).toLocaleString();

                    break;

                  default:
                    obj[objattrib] = (entries[eqattrib]) ? entries[eqattrib] : null;
                    break;
                  }
                }
                // console.log("Objet :",obj);
              });

              valentry.push(obj);
            }
          });
          resp.on('searchReference', (referral) => {
            console.log('referral: ' + referral.uris.join());
          });
          resp.on('error', (err) => {
            console.error('error: ' + err.message);
          // reject(err);
          });
          resp.on('end', (result) => {
            client.unbind();
            // console.log('status: ' + result.status);
            // console.log('Ldap search result :',values);
            // res.json(values);
            resolve(valentry);
          });
        }
      });
    });
  };
  /*
  const transporter = {
    host: 'mail.cacem.fr',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'hdechavigny', // compte expéditeur
      pass: 'd@nZel!77' // mot de passe du compte expéditeur
    },
    tls: {
      ciphers: 'SSLv3'
    }
  }

  vvtool.decrypt(
        app.get('authentication').secret,
        'ffa470683ea0044cde033e9188c886f1|a0e0970e37c3ed0991'
      ),

      vvtool.decrypt(
    app.get('authentication').secret,
    app.get('mailTransport').auth.pass
  );
  */

  const vvmailtrans = {
    host: 'pro1.mail.ovh.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'herve@hdcapp.pro', // compte expéditeur
      pass: app.get('authentication').secret,// mot de passe du compte expéditeur
    },
    tls: {
      ciphers: 'SSLv3',
    },
  };
  let transtmp = app.get('mailTransport');
  //transtmp.auth.pass = app.get('authentication').secret;
  const trans = Object.assign({}, transtmp);
  logger.info('Préférence transport SMTP (mailTransport) :', trans);
  /* {
    host: '172.30.249.4',
    port: 25,

  }; */

  // if (trans) {
  // Register service and setting default From Email
  app.use('mailer', mailer(trans, { from: 'notification@cacem.fr' }));

  app.use('admmailer', mailer(vvmailtrans, { from: 'herve@hdcapp.pro' }));

  // ------  GESTION APIs d'OVH  ---------------------------------
  app.use('/api/ovh/domaines', (req, res, next) => {
    ovh.request(
      'POST',
      '/auth/credential',
      {
        accessRules: [
          { method: 'GET', path: '/*' },
          { method: 'POST', path: '/*' },
          { method: 'PUT', path: '/*' },
          { method: 'DELETE', path: '/*' },
        ],
      },
      (error, credential) => {
        logger.info('Credential :', error || credential);

        ovh
          .requestPromised('GET', '/domain/zone')
          .then((domaines) => {
            logger.info('Domaines :', domaines);
            res.json(domaines);
          })
          .catch((err) => {
            res.json({
              erreur: err,
            });
          });
      }
    );
  });

  app.use('/api/ovh/zone/refresh', (req, res, next) => {
    var zone = req.body.zone;

    ovh.request(
      'POST',
      '/auth/credential',
      {
        accessRules: [
          { method: 'GET', path: '/*' },
          { method: 'POST', path: '/*' },
          { method: 'PUT', path: '/*' },
          { method: 'DELETE', path: '/*' },
        ],
      },
      (error, credential) => {
        logger.info('Credential :', error || credential);

        ovh
          .requestPromised('POST', `/domain/zone/${zone}/refresh`)
          .then((domaine) => {
            logger.info('Domaine :', domaine);
            res.json(domaine);
          })
          .catch((err) => {
            res.json({
              erreur: err,
            });
          });
      }
    );
  });

  app.use('/api/ovh/zone/cnames', (req, res, next) => {
    var zone = req.body.zone;

    ovh.request(
      'POST',
      '/auth/credential',
      {
        accessRules: [
          { method: 'GET', path: '/*' },
          { method: 'POST', path: '/*' },
          { method: 'PUT', path: '/*' },
          { method: 'DELETE', path: '/*' },
        ],
      },
      (error, credential) => {
        logger.info('Credential :', error || credential);

        ovh
          .requestPromised('GET', `/domain/zone/${zone}/record`, {
            fieldType: 'CNAME',
          })
          .then(async (cnames) => {
            logger.info('Cnames :', cnames);
            var objCnames = [];
            for (let index = 0; index < cnames.length; index++) {
              const value = cnames[index];
              var cname = await ovh.requestPromised(
                'GET',
                `/domain/zone/${zone}/record/${value}`
              ); // .then((cname)=>{
              objCnames.push(cname);
            }
            res.json(objCnames);
          })
          .catch((err) => {
            res.json({
              erreur: err,
            });
          });
      }
    );
  });

  app.use('/api/ovh/zone/cname', (req, res, next) => {
    var zone = req.body.zone;
    var subDomain = req.body.subDomain;
    var target = req.body.target;

    ovh.request(
      'POST',
      '/auth/credential',
      {
        accessRules: [
          { method: 'GET', path: '/*' },
          { method: 'POST', path: '/*' },
          { method: 'PUT', path: '/*' },
          { method: 'DELETE', path: '/*' },
        ],
      },
      (error, credential) => {
        console.log('Credential :', error || credential);
        ovh
          .requestPromised('GET', `/domain/zone/${zone}/record`, {
            fieldType: 'CNAME',
            subDomain: subDomain,
          })
          .then(async (cnames) => {
            if (Array.isArray(cnames) && cnames.length == 1) {
              let recordId = cnames[0];
              var cnameDeleted = await ovh.requestPromised(
                'DELETE',
                `/domain/zone/${zone}/record/${recordId}`
              );
              console.log('Cname effacé!');
              await ovh.requestPromised('POST', `/domain/zone/${zone}/refresh`);
              ovh
                .requestPromised('POST', `/domain/zone/${zone}/record`, {
                  zoneName: zone,
                  fieldType: 'CNAME',
                  subDomain: subDomain,
                  target: target,
                })
                .then(async (cname) => {
                  console.log('Cname change :', cname);
                  await ovh.requestPromised(
                    'POST',
                    `/domain/zone/${zone}/refresh`
                  );
                  res.json(cname);
                })
                .catch((err) => {
                  res.json({
                    erreur: err,
                  });
                });
            }
          });
      }
    );
  });

  app.post('/api/ovh/zone/delete_cname', (req, res, next) => {
    var zone = req.body.zone;
    var recordId = req.body.id;

    ovh.request(
      'POST',
      '/auth/credential',
      {
        accessRules: [
          { method: 'GET', path: '/*' },
          { method: 'POST', path: '/*' },
          { method: 'PUT', path: '/*' },
          { method: 'DELETE', path: '/*' },
        ],
      },
      async (error, credential) => {
        console.log('Credential :', error || credential);
        var cnameDeleted = await ovh.requestPromised(
          'DELETE',
          `/domain/zone/${zone}/record/${recordId}`
        );
        console.log('Cname effacé!');
        await ovh.requestPromised('POST', `/domain/zone/${zone}/refresh`);
        res.json({
          success: cnameDeleted,
        });
      }
    );
  });

  app.post('/api/ovh/zone/new_cname', (req, res, next) => {
    var zone = req.body.zone;
    var subDomain = req.body.subDomain;
    var target = req.body.target;

    ovh.request(
      'POST',
      '/auth/credential',
      {
        accessRules: [
          { method: 'GET', path: '/*' },
          { method: 'POST', path: '/*' },
          { method: 'PUT', path: '/*' },
          { method: 'DELETE', path: '/*' },
        ],
      },
      (error, credential) => {
        console.log('Credential :', error || credential);
        ovh
          .requestPromised('POST', `/domain/zone/${zone}/record`, {
            fieldType: 'CNAME',
            subDomain: subDomain,
            target: target,
          })
          .then(async (cname) => {
            console.log('Cname crée :', cname);
            await ovh.requestPromised('POST', `/domain/zone/${zone}/refresh`);
            res.json(cname);
          })
          .catch((err) => {
            res.json({
              erreur: err,
            });
          });
      }
    );
  });

  // ----   Retourne la base de donnée Mongodb actuellement active
  app.get('/api/currentDatabase', async (req, res) => {
    res.json({
      database: app.get('currentDatabase'),
    });
  });

  // ---  Change la base de données MongoDB active
  app.post('/api/changeDefaultDB', (req, res) => {
    var dbname = req.body.dbname;
    const connection = app.get('mongodb');//vvtool.decrypt(app.get('mongodb'));
    const database = dbname;
    // logger.info("Database :",database)
    // .then(client => client.db(database));
    const mongoClient = MongoClient.connect(connection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((client) => {
      const dbAdmin = client.db().admin();
      app.set('dbAdmin', dbAdmin);
      app.set('currentDatabase', database);
      return client.db(database);
    });

    app.set('mongoClient', mongoClient);
    res.json({
      database: app.get('currentDatabase'),
    });
  });

  //  liste des tables de la base de donnée active
  app.get('/api/collections', async (req, res) => {
    var collections = await getCollections();
    // logger.info("collection :",collections)
    res.send(JSON.parse(JSON.stringify(collections)));
  });

  app.post('/api/clonedb', async (req, res) => {
    var dbsource = req.body.dbsource;
    var dbcible = req.body.dbcible;
    if (dbsource && dbcible) {
      const connection = app.get('mongodb');//vvtool.decrypt(app.get('mongodb'));
      // ----------  get collections cible
      const databaseRest = dbcible;
      logger.info('Database cible :', databaseRest);

      const mongoClientRest = MongoClient.connect(connection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then((client) => {
        const dbAdmin = client.db().admin();
        app.set('dbAdminRest', dbAdmin);
        app.set('currentDatabaseRest', databaseRest);
        return client.db(databaseRest);
      });

      app.set('mongoClientRest', mongoClientRest);

      var collectionsCible = await getRestCollections();
      logger.info('collection cible :', collectionsCible);
      // -------------------------------------------------

      if (collectionsCible.length > 0) {
        res.json({
          error: 'base de donnée cible non vide',
        });
      } else {
        // ------   get collections source -----------------
        const databaseSrc = dbsource;
        logger.info('Database source :', databaseSrc);

        const mongoClientSrc = MongoClient.connect(connection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }).then((client) => {
          const dbAdmin = client.db().admin();
          app.set('dbAdminRest', dbAdmin);
          app.set('currentDatabaseRest', databaseSrc);
          return client.db(databaseSrc);
        });

        app.set('mongoClientRest', mongoClientSrc);

        var collectionsSource = await getRestCollections();
        logger.info('collection source :', collectionsSource);

        if (collectionsSource.length == 0) {
          res.json({
            error: 'base de donnée source vide',
          });
        } else {
          const admin = app.get('dbAdmin');
          const mongoCommand = `db.copyDatabase("${dbsource}", "${dbcible}", "localhost")`;
          admin
            .command(mongoCommand)
            .then((data) => {
              logger.info(data);
              res.json({
                error: 'clone effectué',
              });
            })
            .catch((err) => {
              logger.info(err);
              res.json({
                error: err,
              });
            });
        }
      }
    }
  });

  //  retourne la liste des bases de données MongoDB
  app.get('/api/dbs', async (req, res) => {
    // `mongodb://${dbHostName}:${dbPortNumber}/${dbName}`
    if (!req.admin) req.admin = app.get('dbAdmin');

    req.admin.listDatabases((err, dbs) => {
      logger.info('dbs :', dbs);
      res.json(dbs.databases);
    });
  });

  // se connecte à la base de donnée MongoDB passé en parametre
  app.post('/api/dbconnect', async (req, res) => {
    var dbname = req.body.dbname;
    if (dbname) {
      const connection = app.get('mongodb');
      /*vvtool.decrypt(
        app.get('authentication').secret,
        app.get('mongodb')
      );*/
      const databaseRest = dbname;
      logger.info('Database :', databaseRest);

      const mongoClientRest = MongoClient.connect(connection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then((client) => {
        const dbAdmin = client.db().admin();
        app.set('dbAdminRest', dbAdmin);
        app.set('currentDatabaseRest', databaseRest);
        return client.db(databaseRest);
      });

      app.set('mongoClientRest', mongoClientRest);

      var collections = await getRestCollections();
      logger.info('collection :', collections);
      res.send(JSON.parse(JSON.stringify(collections)));
    } else {
      res.json({
        error: 'aucune base sélectionnée',
      });
    }
  });

  app.get('/api/ldapSearch', async (req, res) => {
    const client = app.get('ldapClient');
    var opts = {
      //  filter: '(objectClass=*)',  //simple search
      //  filter: '(&(uid=2)(sn=John))',// and search
      filter: '(|(uid=*)(sAMAccountName=*))', // '(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      attributes: ['sAMAccountName', 'cn'],
    };
    var values = [];
    client.search(
      app.get('authentication').ldap.searchBase,
      opts,
      (err, resp) => {
        if (err) {
          console.log('Error in search ' + err);
        } else {
          resp.on('searchEntry', (entry) => {
            // console.log('entry: ' + JSON.stringify(entry.object));
            var obj = {};
            var entry = JSON.parse(JSON.stringify(entry.object));
            obj.SamAccountName = entry.sAMAccountName;
            obj.cn = entry.dn;
            values.push(obj);
          });
          resp.on('searchReference', (referral) => {
            console.log('referral: ' + referral.uris.join());
          });
          resp.on('error', (err) => {
            console.error('error: ' + err.message);
          });
          resp.on('end', (result) => {
            console.log('status: ' + result.status);
            //console.log('Ldap search result :', values);
            res.json(values);
          });
        }
      }
    );
  });

  app.get('/api/hasAd', (req, res, next) => {
    app
      .get('pwshCmd')(
        'if ((Get-Module -ListAvailable -Name "ActiveDirectory") ) { write-output $true } else { write-output $false }'
      )
      .then((result) => {
        app.hasAd = result.trim().toLowerCase() === 'true';
        res.json({
          hasAd: app.hasAd,
        });
      })
      .catch((err) => {
        res.json({
          error: err,
        });
      });
  });

  app.get('/api/hasChocolatey', (req, res, next) => {
    app
      .get('pwshCmd')('Test-Path "$($env:ProgramData)\\chocolatey\\choco.exe"')
      .then((data) => {
        app.hasChocolatey = String(data).trim().toLowerCase() == 'true';
        res.json({
          hasChocolatey: app.hasChocolatey,
        });
      })
      .catch((err) => {
        res.json({
          error: err,
        });
      });
  });

  app.get('/api/isOnDomain', (req, res, next) => {
    app
      .get('pwshCmd')(
        '(Get-WmiObject -Class Win32_ComputerSystem).PartOfDomain'
      )
      .then((data) => {
        app.isOnDomain = String(data).trim().toLowerCase() == 'true';
        res.json({
          hasAd: app.isOnDomain,
        });
      })
      .catch((err) => {
        res.json({
          error: err,
        });
      });
  });

  app.post('/api/runpwrsh', (req, res, next) => {
    var cmd = req.body.cmd;
    logger.info('Command to run : %s', cmd);
    app
      .get('pwshCmd')(`${cmd}`)
      .then((data) => {
        logger.info('Output : %j', data);
        if (data) {
          res.json({
            data: JSON.parse(data),
            success: true,
          });
        } else {
          res.json({
            data: '',
            success: true,
          });
        }
      })
      .catch((err) => {
        logger.info('Error cmd :', err);
        res.json({
          error: err,
        });
      });
  });

  app.use('/api/execexg', (req, res, next) => {
    var cmd = req.body.cmd;
    var ps = new powershell({
      executionPolicy: 'Bypass',
      outputEncoding: 'utf-8',
      verbose: true,
      noProfile: true,
    });

    // svrexchg1.agglo.local
    ps.addCommand(
      `$username = "admexchange@agglo.local"; $password = ConvertTo-SecureString "FiniLeCl0ud" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password); $session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri http://svrexchg1.agglo.local/PowerShell -Authentication Kerberos -Credential $usercred  -AllowRedirection ;  Invoke-Command -Session $session -scriptblock {${cmd}} |ConvertTo-Json`
    ) //  -FilePath ".\\pwrshell\\run_exchg.ps1"
      .then(
        () =>
          ps.invoke().then(
            (output) => {
              logger.info('Output :', output);
              res.json({
                result: JSON.parse(output),
                success: true,
              }); // JSON.parse(output)
            },
            (err) => {
              logger.info('Output err:', err);
              res.json(false);
            }
          ),
        (err) => {
          logger.info('Output err:', err);
          res.json(false);
        }
      );
  });

  app.get('/api/svrsettings', authenticate('jwt'), (req, res, next) => {
    console.log('ENV :', process.env.NODE_ENV);
    var conf;
    if (process.env.NODE_ENV == 'production') {
      conf = jetpack.read(path.resolve('./config/production.json'), 'utf8');
    } else {
      conf = jetpack.read(path.resolve('./config/default.json'), 'utf8');
    }

    res.json(JSON.parse(conf));
  });

  app.get('/auth/sso', ntlm({
    debug: function() {
      var args = Array.prototype.slice.apply(arguments);
      //console.log.apply(null, args);
    },
    domain: 'AGGLO.LOCAL',
    domaincontroller: 'ldap://agglo.local',

  }),async (req, res, next) => {
    if (req.sso) {
      return res.json({
        sso: req.sso.user,
      });
    }
    if (req.ntlm) {
      let user = await ldapSearch(('(|(uid={{username}})(sAMAccountName={{username}}))').replace(/{{username}}/g,req.ntlm.UserName));
      return res.json({
        sso: user,
      });
    }
    if (!req.sso && !req.ntlm) {
      return res.status(401).end();
    }
    //console.log('/auth/sso',req.sso);


  });



  // app.get('/auth/sso',auth_sso(app));
  /* async (req, res, next) => {
    if (!req.headers['x-forwarded-user']) {
      return res.status(401).end();
    } else  {
      var authuser = req.headers['x-forwarded-user'].split('@')[0];
      var user =  await ldapSpeSearch(app.get('authentication').ldap.searchFilter.replace(/{{username}}/g,authuser),['Name','GivenName','Description','Office','SamAccountName','UserPrincipalName','ThumbnailPhoto','DisplayName','Company','Department','City','HomePhone','mail','OfficePhone','IPPhone','MobilePhone','PostalCode','StreetAddress','co','Surname','Manager','EmployeeNumber','MemberOf','Enabled','CannotChangePassword','PasswordNeverExpires','AccountExpirationDate','whenChanged','whenCreated','LastLogonDate']);
      console.log('User :', user);

      var sso = req.headers['x-forwarded-user'].split('@')[0];

      sso = {
        domain: 'AGGLO',
        name: 'hdechavigny',
        displayName: 'hdechavigny',
        accessToken: '0x000000000000BFFC',
        groups: [
          'AGGLO\\Agents DGA1',
          'AGGLO\\C.A. Service Informatique et T\ufffdl\ufffdphonie',
          'AGGLO\\Service EMAT-1-904615473',
          'AGGLO\\Utilisateurs Access',
          'AGGLO\\Utilisateurs Bureau 2016',
          'AGGLO\\Utilisateurs Bureau Citrix Distant',
          'AGGLO\\Utilisateurs Citrix',
          'AGGLO\\Utilisateurs DSI',
          'AGGLO\\Utilisateurs Google Chrome',
          'AGGLO\\Utilisateurs Intranet',
          'AGGLO\\Utilisateurs Kelio',
          'AGGLO\\Utilisateurs MS Project 2016',
          'AGGLO\\Utilisateurs Maxcompta',
          'AGGLO\\Utilisateurs Maxcompta XenApp',
          'AGGLO\\Utilisateurs Outlook 2016',
          'AGGLO\\Utilisateurs PowerPoint',
          'AGGLO\\Utilisateurs SMS',
          'AGGLO\\Utilisateurs Visio 2016',
          'AGGLO\\Utilisateurs WIFI',
          'AGGLO\\Utilisateurs Word',
          'AGGLO\\Utilisateurs copieur hall R1 par defaut',
          'AGGLO\\Utilisateurs du domaine',
          'AGGLO\\Utilisateurs mobiles CACEM',
          'AUTORITE NT\\Authentifications NTLM',
          'AUTORITE NT\\Cette organisation',
          'AUTORITE NT\\RESEAU',
          'AUTORITE NT\\Utilisateurs authentifi\ufffds',
          'BUILTIN\\Utilisateurs',
          '\\Tout le monde',
          '\ufffdtiquette obligatoire\\Niveau obligatoire moyen',
        ],
        sid: 'S-1-5-21-3082398674-3502640613-2844172946-4660',
        adUser: {
          objectClass: [
            'top',
            'person',
            'organizationalPerson',
            'user',
          ],
          cn: [
            'DE CHAVIGNY Herve',
          ],
          sn: [
            'DE CHAVIGNY',
          ],
          title: [
            'Gestionnaire Support et Exploitation',
          ],
          description: [
            'Gestionnaire Support et Exploitation',
          ],
          physicalDeliveryOfficeName: [
            '106',
          ],
          telephoneNumber: [
            '146',
          ],
          givenName: [
            'Herve',
          ],
          distinguishedName: [
            'CN=DE CHAVIGNY Herve,OU=DIRECTION SYSTEME D\'INFORMATION,OU=DGA1,OU=CACEM,DC=agglo,DC=local',
          ],
          instanceType: [
            4,
          ],
          whenCreated: [
            '31/12/2019 15:33:33',
          ],
          whenChanged: [
            '08/02/2022 22:43:08',
          ],
          displayName: [
            'DE CHAVIGNY Herve',
          ],
          uSNCreated: [
            'high: 0 low: 22256648',
          ],
          memberOf: [
            'CN=Service EMAT,OU=DIRECTION SYSTEME D\'INFORMATION,OU=DGA1,OU=CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs mobiles CACEM,OU=Listes de distribution,DC=agglo,DC=local',
            'CN=Utilisateurs Bureau Citrix Distant,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs SMS,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Administration Copieurs Xerox,OU=Listes de distribution,DC=agglo,DC=local',
            'CN=Utilisateurs Visio 2016,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Direction Systeme Information et Telecom,OU=Listes de distribution,DC=agglo,DC=local',
            'CN=All Users CACEM,OU=Listes de distribution,DC=agglo,DC=local',
            'CN=Alerte Informatique,OU=Listes de distribution,DC=agglo,DC=local',
            'CN=Utilisateurs MS Project 2016,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs Bureau 2016,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs Outlook 2016,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs Intranet,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs DSI,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs Maxcompta XenApp,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs Maxcompta,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=C.A. Service Informatique et Téléphonie,OU=DIRECTION SYSTEME D\'INFORMATION,OU=DGA1,OU=CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs Google Chrome,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs Word,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs Citrix,OU=Applications CACEM,DC=agglo,DC=local',
            'CN=Utilisateurs copieur hall R1 par defaut,OU=Imprimantes CACEM,DC=agglo,DC=local',
          ],
          uSNChanged: [
            'high: 0 low: 58069181',
          ],
          department: [
            'DIRECTION SYSTEMES D\'INFORMATION',
          ],
          company: [
            'CACEM',
          ],
          proxyAddresses: [
            'smtp:herve.dechavigny@cacem.fr',
            'SMTP:herve.dechavigny@cacem-mq.com',
          ],
          name: [
            'DE CHAVIGNY Herve',
          ],
          objectGUID: [
            '{EAB717A9-7CE8-4C1D-9B14-78196D046AC2}',
          ],
          userAccountControl: [
            66048,
          ],
          badPwdCount: [
            0,
          ],
          codePage: [
            0,
          ],
          countryCode: [
            0,
          ],
          badPasswordTime: [
            '07/05/2021 11:52:40',
          ],
          lastLogon: [
            '18/02/2022 10:48:20',
          ],
          pwdLastSet: [
            '03/01/2020 09:58:42',
          ],
          primaryGroupID: [
            513,
          ],
          objectSid: [
            'S-1-5-21-3082398674-3502640613-2844172946-4660',
          ],
          accountExpires: [
            '<Never Expires>',
          ],
          logonCount: [
            16966,
          ],
          sAMAccountName: [
            'hdechavigny',
          ],
          sAMAccountType: [
            805306368,
          ],
          showInAddressBook: [
            'CN=Tous les utilisateurs,CN=All Address Lists,CN=Address Lists Container,CN=Cacem,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=agglo,DC=local',
            'CN=Liste d\'adresses globale par défaut,CN=All Global Address Lists,CN=Address Lists Container,CN=Cacem,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=agglo,DC=local',
            'CN=All Recipients(VLV),CN=All System Address Lists,CN=Address Lists Container,CN=Cacem,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=agglo,DC=local',
            'CN=All Mailboxes(VLV),CN=All System Address Lists,CN=Address Lists Container,CN=Cacem,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=agglo,DC=local',
            'CN=Mailboxes(VLV),CN=All System Address Lists,CN=Address Lists Container,CN=Cacem,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=agglo,DC=local',
          ],
          legacyExchangeDN: [
            '/o=Cacem/ou=Exchange Administrative Group (FYDIBOHF23SPDLT)/cn=Recipients/cn=e1eb036d2ebc4f79a6c98d78f803b9ed-DE CHAVIGNY Herve',
          ],
          userPrincipalName: [
            'herve.dechavigny@cacem.fr',
          ],
          ipPhone: [
            '146',
          ],
          objectCategory: [
            'CN=Person,CN=Schema,CN=Configuration,DC=agglo,DC=local',
          ],
          dSCorePropagationData: [
            '19/08/2020 01:03:54',
            '01/01/1601 00:00:01',
          ],
          lastLogonTimestamp: [
            'high: 30940477 low: 1044085592',
          ],
          msTSExpireDate: [
            '20/03/2022 12:26:14',
          ],
          msTSLicenseVersion: [
            '393216',
          ],
          msTSManagingLS: [
            '00377-70517-40386-AT629',
          ],
          msTSLicenseVersion2: [
            '7',
          ],
          msTSLicenseVersion3: [
            'C50-6.00-S',
          ],
          mail: [
            'herve.dechavigny@cacem.fr',
          ],
          manager: [
            'CN=KNEUR Sebastien,OU=DIRECTION SYSTEME D\'INFORMATION,OU=DGA1,OU=CACEM,DC=agglo,DC=local',
          ],
          mobile: [
            '06 96 28 65 06',
          ],
          msExchHomeServerName: [
            '/o=Cacem/ou=Exchange Administrative Group (FYDIBOHF23SPDLT)/cn=Configuration/cn=Servers/cn=SVREXCHG1',
          ],
          msExchWhenMailboxCreated: [
            '31/12/2019 15:39:52',
          ],
          msExchUserCulture: [
            'fr-FR',
          ],
          mDBUseDefaults: [
            true,
          ],
          msExchMobileMailboxFlags: [
            1,
          ],
          msExchDumpsterQuota: [
            31457280,
          ],
          msExchPoliciesIncluded: [
            'f1e10489-5e0f-4039-855e-3a439ebcb021',
            '{26491cfc-9e50-4857-861b-0cb8df22b5d7}',
          ],
          mailNickname: [
            'herve.dechavigny',
          ],
          msExchArchiveQuota: [
            'high: 0 low: 104857600',
          ],
          msExchUserAccountControl: [
            0,
          ],
          msExchRBACPolicyLink: [
            'CN=Default Role Assignment Policy,CN=Policies,CN=RBAC,CN=Cacem,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=agglo,DC=local',
          ],
          msExchTextMessagingState: [
            302120705,
            16842751,
          ],
          msExchDelegateListBL: [
            'CN=devices,OU=Boites Partagées,DC=agglo,DC=local',
            'CN=admindsi,OU=Boites Partagées,DC=agglo,DC=local',
          ],
          msExchCalendarLoggingQuota: [
            6291456,
          ],
          msExchUMDtmfMap: [
            'reversedPhone:6056826960',
            'reversedPhone:641',
            'emailAddress:437833324284469',
            'lastNameFirstName:332428446943783',
            'firstNameLastName:437833324284469',
          ],
          homeMDB: [
            'CN=Mailbox Database1,CN=Databases,CN=Exchange Administrative Group (FYDIBOHF23SPDLT),CN=Administrative Groups,CN=Cacem,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=agglo,DC=local',
          ],
          msExchELCMailboxFlags: [
            130,
          ],
          msExchDumpsterWarningQuota: [
            20971520,
          ],
          msExchArchiveWarnQuota: [
            'high: 0 low: 94371840',
          ],
          msExchRecipientDisplayType: [
            1073741824,
          ],
          msExchMailboxSecurityDescriptor: [
            '<Security descriptor>',
          ],
          msExchVersion: [
            'high: 20540 low: 0',
          ],
          msExchRecipientTypeDetails: [
            'high: 0 low: 1',
          ],
          ADsPath: [
            'LDAP://CN=DE CHAVIGNY Herve,OU=DIRECTION SYSTEME D\'INFORMATION,OU=DGA1,OU=CACEM,DC=agglo,DC=local',
          ],
        },
      };

      req.feathers.sso = sso;


      console.log('SSo memorise :', sso);

    }
    return res.json({
      sso: sso,
    });
  });*/

  if (os.platform() === 'win32') {
    const { sso } = require('node-expose-sspi');

    app.get('/auth/sso', (req, res, next) => {
      if (!req.sso) {
        return res.status(401).end();
      }
      //console.log('/auth/sso',req.sso);

      return res.json({
        sso: req.sso.user,
      });
    });
  }
  /*app.get('*', (req, res, next) => {
    res.redirect('/')
  })*/

  app.use('/api/word', word());

  app.use('/api/message', (req, res, next) => {
    const message = req.body.message;
    app.service('messages').publish('created', () => app.channel('anonymous'));
    app.service('messages').create({
      message: message,
    });
  });

  app.get('/api/hello', hello(app));
  app.get('/api/admingrp', conf(app));

  app.use('/api/getpdf', (req, res, next) => {
    res
      .status(200)
      .sendFile(
        path.resolve(__dirname, '../../uploads/Création d\'un compte Google.pdf')
      );
  });

  app.get('/api/getpdfFile', (req, res, next) => {
    var file = req.query.filename;
    if (
      jetpack.exists(path.resolve(__dirname, `../../uploads/${file}`)) == 'file'
    ) {
      res
        .status(200)
        .sendFile(path.resolve(__dirname, `../../uploads/${file}`));
    } else {
      res.json({
        error: 'pas de fichier',
      });
    }
  });

  app.post('/api/getdocsfile', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    logger.info('Body :', req.body);
    let user = req.body.user;
    let filename = req.body.filename;
    if (jetpack.exists(`./users/${user}/default/docs/${filename}`) == 'file') {
      //res.status(200).sendFile(`${process.cwd()}/users/${user}/default/docs/${filename}`)
      logger.info(`./users/${user}/default/docs/${filename}`);

      const src = jetpack.read(`./users/${user}/default/docs/${filename}`);
      res.json({
        data: src,
      });
    } else {
      res.json({
        error: 'pas de fichier',
      });
    }
  });

  app.get('/api/svrinfos', (req, res, next) => {
    checkSysInfos().then(() => {
      res.json({
        infos: {
          system: app.system,
          chassis: app.chassis,
          osInfos: app.osInfos,
          versions: app.versions,
          isondomain: app.isOnDomain,
          domain: app.domain,
          mailconf: app.get('mail_ok'),
          mongodb: app.get('mongodb_ok'),
          curentdb: app.get('currentDatabase'),
          choco: app.get('choco_ok'),
          python: app.get('python_ok'),
          mkdocs: app.get('mkdocs_ok'),
          mkdocs_material: app.get('mkdocsm_ok'),
          sites: app.get('nb_sites'),
          ensites: app.get('nb_ensites'),
        },
      });
    });
  });

  app.post('/api/pull', (req, res, next) => {
    exec('git pull').then((result) => {
      // https://vevedh:d%40nZel77@github.com/vevedh/dash-cacem
      res.json({
        result: result,
        success: true,
      });
    });
  });

  app.get('/api/projets', (req, res, next) => {
    app
      .service('/sites')
      .find({})
      .then((result) => {
        res.json({
          result: result,
          success: true,
        });
      });
  });

  app.post('/api/push', (req, res, next) => {
    exec('git push').then((result) => {
      res.json({
        result: result,
        success: true,
      });
    });
  });

  app.post('/api/build', (req, res, next) => {
    exec(
      'git pull https://vevedh:d%40nZel77@github.com/vevedh/dash-cacem'
    ).then((result) => {
      if (result) {
        exec('cd .. && cd .. && npm run build').then((result1) => {
          res.json({
            result: result1,
            success: true,
          });
        });
      }
    });
  });

  app.post('/api/restart', (req, res, next) => {
    /* res.json({
      path: process.cwd()
    }) */

    res.json({
      path: process.cwd(),
      success: true,
    });
    process.exit(1);
  });

  app.post('/api/sendmail', async (req, res, next) => {
    const email = req.body.sendTo;
    const sujet = req.body.sujet;
    const content = req.body.htmlcontent;
    // Use the service
    const emailstart = {
      from: 'no-reply@cacem.fr',
      to: email,
      subject: sujet,
      html: content,
    };

    const send = await app.service('mailer').create(emailstart);
    if (send) {
      logger.info('Mail envoyé :', send);
      res.json({
        message: 'E-mail envoyé',
        success: true,
      });
    } else {
      res.json({
        message: err,
        success: false,
      });
    }
  });

  app.post('/api/uptAdUsers', (req, res, next) => {
    const currentDomain = app
      .get('authentication')
      .ldap.searchBase.replace(',', '.')
      .replace(/dc\=/gi, '');
    Promise.all([
      // updateAdOUs(currentDomain),
      updateAdUsers(currentDomain),
      // updateAdPcs(currentDomain),
    ])
      .then((results) => {
        logger.info('Table adUsers actualisée!', results);
        res.json({
          message: 'Table adUsers actualisée!',
          success: true,
        });
      })
      .catch((err) => {
        res.json({
          message: 'Table adUsers non modifiée!',
          success: false,
        });
      });
  });

  app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }

    res.send(file);
  });

  app.post('/pubuploadfile', uploadPub.single('image'), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }

    res.send(file);
  });

  // Uploading multiple files
  app.post('/uploadmultiple', upload.array('files[]'), (req, res, next) => {
    const files = req.files;
    if (!files) {
      const error = new Error('Please choose files');
      error.httpStatusCode = 400;
      return next(error);
    }

    res.send(files);
  });

  app.use('/projects', (req, res, next) => {
    let list;
    const lstprjs = jetpack.list(app.get('prj_folder'));
    if (lstprjs.length > 0) {
      list = [];
      lstprjs.forEach((name) => {
        const obj = {};
        if (jetpack.exists(`${app.get('prj_folder')}/${name}`) == 'dir') {
          obj.nom = name;
          obj.www = false;
          if (jetpack.exists(`${app.get('prj_folder')}/${name}/www`) == 'dir') {
            obj.www = true;
          }
          list.push(obj);
        }
      });
    }
    res.json({
      projets: list,
    });
  });

  app.use('/sharepoint/auth', (req, res, next) => {
    var url = req.body.url;
    var credentials = req.body.credentials;

    spauth.getAuth(url, credentialOptions).then((options) => {
      var data = '';

      let headers = options.headers;
      headers['Accept'] = 'application/json;odata=verbose';

      var config = {
        method: 'get',
        url: 'http://svrsharepoint3/_api/web',
        headers: headers,
        data: data,
      };

      axios(config)
        .then(function (response) {
          logger.info(JSON.stringify(response.data));
          res.json(response.data);
        })
        .catch(function (error) {
          logger.info(error);
          res.json({
            error: error,
          });
        });
    });
  });

  app.use('/getSUsers', (req, res, next) => {
    var data = '';

    var config = {
      method: 'get',
      url: 'http://svrsimplydesk.agglo.local:4000/CustomerManagement.svc/GetUsers?p=1&datemin=2020-01-01&datemax=2020-10-01',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  app.use('/getSAllTeam', (req, res, next) => {
    var data = '';

    var config = {
      method: 'get',
      url: 'http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetAllTeam',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  // http://svrsimplydesk:4000/CustomerManagement.svc/GetAgentsByteamID?teamId=

  app.use('/getSAgents', (req, res, next) => {
    var data = '';

    var config = {
      method: 'get',
      url: 'http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetAllHelpdeskAgents',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  // getSCategories
  app.use('/getSCategories', (req, res, next) => {
    var data = '';

    var config = {
      method: 'get',
      url: 'http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetAllTicketCategories',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  // IncidentManagement.svc/GetAllPriorities
  app.use('/getSAllPriorities', (req, res, next) => {
    var data = '';

    var config = {
      method: 'get',
      url: 'http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetAllPriorities',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  // IncidentManagement.svc/GetAllTicketTypes
  app.use('/getSAllTicketTypes', (req, res, next) => {
    var data = '';

    var config = {
      method: 'get',
      url: 'http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetAllTicketTypes',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  // IncidentManagement.svc/GetLinkedTicketCatgoriesByTicketTypeID?ticketTypeId=5f4cba96-6438-4afe-89a9-10b566125b30
  app.use('/getSAllTicketIncidents', (req, res, next) => {
    var data = '';

    var config = {
      method: 'get',
      url: 'http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetLinkedTicketCatgoriesByTicketTypeID?ticketTypeId=5f4cba96-6438-4afe-89a9-10b566125b30',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  // http://svrsimplydesk:4000/CustomerManagement.svc/GetOrganizationsByCompanyName?c=CACEM
  app.use('/getSOrganizationsByCompanyName', (req, res, next) => {
    var data = '';

    var config = {
      method: 'get',
      url: 'http://svrsimplydesk:4000/CustomerManagement.svc/GetOrganizationsByCompanyName?c=CACEM',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  // http://svrsimplydesk:4000/CustomerManagement.svc/GetUserByUserName?u=hdechavigny
  app.use('/getStUserByUserName', (req, res, next) => {
    var user = req.body.username;
    var data = '';

    var config = {
      method: 'get',
      url: `http://svrsimplydesk:4000/CustomerManagement.svc/GetUserByUserName?u=${user}`,
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  app.use('/getSAgentsByteamId', (req, res, next) => {
    var id = req.body.id;
    var data = '';

    var config = {
      method: 'get',
      url: `http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetAgentsByteamID?teamId=${id}`,
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  app.use('/getSOpenTickets', (req, res, next) => {
    var page = req.body.page;
    var datemin = req.body.datemin;
    var datemax = req.body.datemax;

    var data = '';

    var config = {
      method: 'get',
      url: `http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetOpenTickets?p=${page}&datemin=${datemin}&datemax=${datemax}`,
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  app.use('/getSClosedTickets', (req, res, next) => {
    var page = req.body.page;
    var datemin = req.body.datemin;
    var datemax = req.body.datemax;

    var data = '';

    var config = {
      method: 'get',
      url: `http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetClosedTickets?p=${page}&datemin=${datemin}&datemax=${datemax}`,
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  app.use('/addSTicket', (req, res, next) => {
    var titre = req.body.titre;
    var sujet = req.body.sujet;

    var data = JSON.stringify({
      Body: titre,
      ExternalId: null,
      Subject: sujet,
    }); //

    var config = {
      method: 'post',
      url: 'http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/AddTicket',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
        'Content-Type': 'application/json; charset=utf-8',
        Allow: '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent, Auth-Token',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });
  // IncidentManagement.svc/AddTicketByAdmin

  app.use('/addSTicketAdm', (req, res, next) => {
    var titre = req.body.titre;
    var sujet = req.body.sujet;
    var agentid = req.body.agentid;
    var priorite = req.body.priorite;
    var typeid = req.body.typeid;

    var data = JSON.stringify({
      AgentTeamId: null,
      AssignedId: agentid,
      Body: titre,
      PriorityId: priorite,
      ExternalId: null,
      Subject: sujet,
      TicketTypeId: typeid,
      RequesterId: null,
    }); //

    var config = {
      method: 'post',
      url: 'http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/AddTicketByAdmin',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
        'Content-Type': 'application/json; charset=utf-8',
        Allow: '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent, Auth-Token',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        logger.info(JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.json({
          error: error,
        });
      });
  });

  if (app.get('platform') == 'win32') {
    /**
     * controle l'installation de chocolatey
     */

    app
      .get('pwshCmd')('choco --version')
      .then((resok) => {
        logger.info('Chocolatey est installé !  la version : %s', resok);
        app.set('choco_ok', true);
      })
      .catch(() => {
        app
          .get('pwshCmd')(
            'Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://chocolatey.org/install.ps1\'))'
          )
          .then((data) => {
            logger.info('Chocolatey est maintenant installé : %s', data);
            app.set('choco_ok', true);
          })
          .catch((err) => {
            app.set('choco_ok', false);
            logger.info(
              'Erreur d\'installation de l\'outil Chocolatey : %s',
              err
            );
          });
      });

    /**
     * test la presence du serveur sur le domaine
     */
    //  test la presence du serveur sur le domaine
    app
      .get('pwshCmd')(
        '(Get-WmiObject -Class Win32_ComputerSystem).PartOfDomain'
      )
      .then(async (data) => {
        app.isOnDomain = String(data).trim().toLowerCase() == 'true';
        logger.info('Le serveur est sur un domaine');

        const resdom = await app.get('pwshCmd')(
          'Get-WmiObject -Class Win32_ComputerSystem|select Domain|convertto-json'
        );
        // logger.info(resdom)
        let currentDomain;

        if (resdom && resdom.Domain) {
          logger.info('Le domaine est %s', resdom.Domain);
          currentDomain = resdom.Domain;
        } else {
          currentDomain = app
            .get('authentication')
            .ldap.searchBase.replace(',', '.')
            .replace(/dc\=/gi, '');
        }
        logger.info('Domaine : %s', currentDomain);

        /**
         *  Vérifie la presence du module Activediretory
         */
        app
          .get('pwshCmd')(
            'if ((Get-Module -ListAvailable -Name "ActiveDirectory") ) { write-output $true } else { write-output $false }'
          )
          .then((result) => {
            logger.info(
              'Module ActiveDirectory installé : %s',
              result.trim().toLowerCase()
            );
            app.hasAd = result.trim().toLowerCase() === 'true';
            if (result.trim().toLowerCase() === 'true') {
              if (app.get('mongodb_ok') == true) {
                Promise.all([
                  // updateAdOUs(currentDomain),
                  updateAdUsers(currentDomain),
                  // updateAdPcs(currentDomain),
                ])
                  .then((values) => {
                    logger.info(
                      'Tables adOUs,adUsers,adPCs actualisées! %j',
                      values
                    );
                  })
                  .catch((err) => {
                    // reject(err)
                    logger.info(
                      'Erreur inconnue ou infos du domaine non accessible, verifier votre fichier config/default.json ! %s',
                      err
                    );
                  });
              } else {
                logger.info('Il n\'y a aucune table mongodb disponible');
              }
            } else {
              logger.info(
                'Le module PowerShell \'ActiveDirectory\' n\'est pas disponible !'
              );
            }
          })
          .catch((err) => {
            // reject(err)
            logger.info(
              'Le module PowerShell \'ActiveDirectory\' n\'est pas disponible !'
            );
          });

        /**
         *  Vérifie la présence du module NTFSSecurity
         */
        /* app.get('pwshCmd')(
      'if ((Get-Module -ListAvailable -Name "NTFSSecurity") ) { write-output $true } else { write-output $false }'
    ).then((result) => {
      logger.info(
        'Module NTFSSecurity installé : %s',
        result.trim().toLowerCase()
      );
      app.hasNtfs = result.trim().toLowerCase() === 'true';
      if (!app.hasNtfs) {
        app.get('pwshCmd')(
          'Install-Module -Name NTFSSecurity  -Force  -MaximumVersion'
        )
          .then((resinst) => {
            logger.info(
              'Résultat de l\'installation du module NTFSSecurity :%j',
              resinst
            );
          })
          .catch((err) => {
            logger.info('Erreur dans l\'installation de NTFSSecurity');
          });
      }
    });

    */
      })
      .catch((err) => {
        logger.info('Le serveur n\'est pas sur le domaine');
      });
  }

  //await checkSysInfos();

  logger.info(`Environnement : ${app.get('platform')}`);

  if (app.get('mongodb')) {
    logger.info('----------------------Initialisation des infos du domaine en cours... ---------------------------');
    Promise.all([
      updateAdOUs(app
        .get('authentication')
        .ldap.searchBase.replace(',', '.')
        .replace(/dc\=/gi, '')),
      updateAdUsers(app
        .get('authentication')
        .ldap.searchBase.replace(',', '.')
        .replace(/dc\=/gi, '')),
      updateAdPcs(app
        .get('authentication')
        .ldap.searchBase.replace(',', '.')
        .replace(/dc\=/gi, '')),
    ])
      .then((values) => {
        logger.info(
          'Tables adOUs,adUsers,adPCs actualisées! %j',
          values.length
        );
        logger.info(
          'Tables adOUs actualisées! %j',
          values[0].length
        );
        logger.info(
          'Tables adUsers actualisées! %j',
          values[1].length
        );
        logger.info(
          'Tables adPCs actualisées! %j',
          values[2].length
        );
      })
      .catch((err) => {
        // reject(err)
        logger.info(
          'Erreur inconnue ou infos du domaine non accessible, verifier votre fichier config/default.json ! %s',
          err
        );
      });
  } else {
    logger.info('Il n\'y a aucune table mongodb disponible');
  }

  if ( app.osInfos ) {
    const emailperso = {
      to: 'vevedh@gmail.com',
      subject: 'Serveur Web démarré',
      html: `Votre serveur <b>Web</b> est démarré <br>
      <br>
      Lien (support SSO actif): <a href="https://${app.osInfos.fqdn}:${app.get('port')}">https://${app.osInfos.fqdn.toLowerCase()}:${app.get('port')}</a><br>
      <br>Informations système<br>
      Serveur : ${app.osInfos.distro}<br>
      Architecture : ${app.osInfos.arch}<br>
      Version: ${app.osInfos.build}<br>
      HostName: ${app.osInfos.hostname}<br>
      Fqdn: ${app.osInfos.fqdn}<br>
      Nombre de sites : ${app.get('nb_sites')}<br>
      Nombre de sites actifs: ${app.get('nb_ensites')}<br><br>

      Les paramètres du serveur se trouvent dans le fichier: <b>./config/production.json</b><br>
      Dans ce fichier :<br>
      - Le répertoire de vos sites WEB :<br>
        {<br>
          ...<br>
          "prj_folder": "C:\\Projets",<br>
          ...<br>
        }<br>
        tout <b>sous-dossier</b> de ce répertoire contenant un dossier "<b>www</b>"<br>
        avec des fichiers HTML représentant un Site Statique, Et sera donc une site web actif.<br>
        Il sera accessible comme ceci :  https://${app.osInfos.fqdn}:${app.get(
  'port'
)}/<b>sous-dossier</b><br>
      - Chaine de connexion de la base de donnée MongoDB :<br>
      {<br>
        ...<br>
        "mongodb": "mongodb://localhost:27017/cacemdb?authSource=admin",<br>
        ...<br>
      }<br>
      cette connexion dois être accessible pour le fonctionnement de la platforme
      `,
    };

    app
      .service('admmailer')
      .create(emailperso)
      .then((send) => {
        logger.info('Envoi d\'un mail de démarrage serveur admin');
        app.set('mail_ok', true);
      })
      .catch((err) => {
        app.set('mail_ok', false);
        logger.info('Erreur d\'envoi d\'un mail');
        logger.info(
          `Le paramétrage dans config/ 'mailTransport' mal configuré ! : %j\n
  Exemple de configuration:

   "mailTransport": {
    "host": "SMTP_SERVEUR",
    "port": PORT,
    "secure": false,
    "auth": {
      "user": "MAIL_USER",
      "pass": "MAIL_PASSWORD"
    },
    "tls": {
      "ciphers":"SSLv3"
    }
  }\n`,
          err
        );
      });
  }

  if (process.env == 'production') {
    //
    // Envoi d'un mail à l'admin du site
    const emailstart = {
      to: 'admindsi@cacem.fr',
      subject: 'Serveur Web démarré',
      html: `Votre serveur <br>Web</br> est démarré <br>
    <br>
    <b>Nouveautés :</b><br>
    <ul>
    <li>Liste les domaines chez OVH et modification possible des CNAMES</li>
    <li>Documentation du switch "stacked" du 3ème Etage du Siège</li>
    </ul>
    <br>
    Lien (support SSO actif): <a href="https://${app.osInfos.fqdn}:${app.get(
  'port'
)}">https://${app.osInfos.fqdn.toLowerCase()}:${app.get('port')}</a><br>
    <br>Informations système<br>
    Serveur : ${app.osInfos.distro}<br>
    Architecture : ${app.osInfos.arch}<br>
    Version: ${app.osInfos.build}<br>
    HostName: ${app.osInfos.hostname}<br>
    Fqdn: ${app.osInfos.fqdn}<br>
    Nombre de sites : ${app.get('nb_sites')}<br>
    Nombre de sites actifs: ${app.get('nb_ensites')}<br>
    <b>Platfome Web de micros-services et API(s)</b><br>

    Les paramètres du serveur se trouvent dans le fichier: <b>./config/production.json</b><br>
    Dans ce fichier :<br>
    - Le répertoire de vos sites WEB :<br>
      {<br>
        ...<br>
        "prj_folder": "C:\\Projets",<br>
        ...<br>
      }<br>
      tout <b>sous-dossier</b> de ce répertoire contenant un dossier "<b>www</b>"<br>
      avec des fichiers HTML représentant un Site Statique, Et sera donc une site web actif.<br>
      Il sera accessible comme ceci : https://${app.osInfos.fqdn}:${app.get(
  'port'
)}/<b>sous-dossier</b><br>
    - Chaine de connexion de la base de donnée MongoDB :<br>
    {<br>
      ...<br>
      "mongodb": "mongodb://localhost:27017/cacemdb?authSource=admin",<br>
      ...<br>
    }<br>
    cette connexion dois être accessible pour le fonctionnement de la platforme
    `,
    };

    app
      .service('mailer')
      .create(emailstart)
      .then((send) => {
        logger.info('Envoi d\'un mail de démarrage serveur');
        app.set('mail_ok', true);
      })
      .catch((err) => {
        app.set('mail_ok', false);
        logger.info('Erreur d\'envoi d\'un mail');
        logger.info(
          `Le paramétrage dans config/ 'mailTransport' mal configuré ! : %j\n
Exemple de configuration:

 "mailTransport": {
  "host": "SMTP_SERVEUR",
  "port": PORT,
  "secure": false,
  "auth": {
    "user": "MAIL_USER",
    "pass": "MAIL_PASSWORD"
  },
  "tls": {
    "ciphers":"SSLv3"
  }
}\n`,
          err
        );
      });
  }

  // await updateAdUsers(currentDomain);
  // await updateAdPcs(currentDomain);
  //
};
