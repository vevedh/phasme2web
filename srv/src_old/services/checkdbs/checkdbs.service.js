// Initializes the `checkdbs` service on path `/checkdbs`
const { Checkdbs } = require('./checkdbs.class');
const logger = require('../../logger');
const jetpack = require('fs-jetpack');
const path = require('path');
const hooks = require('./checkdbs.hooks');
//const plugin = require('feathers-mongodb-management');

module.exports = async function (app) {
  //let dbService = app.service('/mongo/databases');

  const checkMongoDB = (app) => {
    return new Promise((resolve, reject) => {
      //----------------------------------------------------
      app
        .get('mongoClient')
        .then( (client) => {
          logger.info('Mongo Client connecté ! '); //, client)
          logger.info('Base MongoDb VV active : %s', app.get('currentDatabase'));
          //logger.info("DBO : %j ", client)

          //return new Promise((resolve, reject) => {
          client.listCollections().toArray((err, collectionInfos) => {
            if (err) {
              reject('Aucunes collections/tables!!!');
            }
            logger.info('Tables liste : %j', collectionInfos);

            if (Array.isArray(collectionInfos) && (collectionInfos.length == 0)) {
              logger.info('Tables liste vide');
              reject('Pas de collections/tables dans la base');
            } else {
              console.log('Check mongodb...');
              logger.info(
                `${
                  collectionInfos.length
                } collections/tables dans la base ${app.get('currentDatabase')}`
              );

              if (Array.isArray(collectionInfos) && (collectionInfos.length > 0)) {

                logger.info('parcours...');

                for (let index = 0; index < collectionInfos.length; index++) {
                  const elt = collectionInfos[index];

                  //}
                  //collectionInfos.forEach((elt) => {
                  logger.info('Visite la collection/table : %j', elt);

                  app
                    .service('databases')
                    .find({
                      query: {
                        dbType: 'mongodb',
                        dbName: app.get('currentDatabase'),
                        dbTable: elt.name,
                      },
                    })
                    .then((tables) => {
                      logger.info('Table %j:', tables);
                      //var istable = tables;
                      if (Array.isArray(tables) && tables.length == 0) {
                        app
                          .service('databases')
                          .create({
                            dbType: 'mongodb',
                            dbName: app.get('currentDatabase'),
                            dbTable: elt.name,
                            createAt: new Date(),
                          })
                          .then((tableCreated) => {
                            logger.info('Table crée : %s', tableCreated);
                          })
                          .catch((err) => {
                            reject('Table non crée');
                          });
                        // logger.info("Table mongo db existante trouvée  :", elt.name)
                      } else {
                        resolve(true);
                      }
                      resolve(true);
                    })
                    .catch((err) => {
                      reject(err);
                    });
                }
              }

              logger.info('ok...');
              resolve(true);
            }
          });

          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  logger.info('Vérification des base de données MongoDB');
  //try {
  const mongoOk = await checkMongoDB(app);

  //logger.info("Echec checkDbs!!!!");

  if (mongoOk) {
    logger.info('MongoDb accessible !');
    app.set('mongodb_ok', true);
  } else {
    logger.info('MongoDb inaccessible !');
    app.set('mongodb_ok', false);
  }

  logger.info('Chemin des services : %s', __dirname);

  if (jetpack.exists(path.resolve('./data')) === 'dir') {
    const nedbTables = jetpack.list(path.resolve('./data'));

    logger.info('Datadb sys nedb directory : %s', path.resolve('./data'));
    logger.info('Nedb Tables : %j', nedbTables);

    if (nedbTables) {
      logger.info('Nedb tables');
      nedbTables.forEach((tbnedb) => {
        app
          .service('databases')
          .find({
            query: {
              dbType: 'nedb',
              dbName: tbnedb,
            },
          })
          .then((dbres) => {
            logger.info(` database ${tbnedb} : %j`, dbres);
            var isNedbTable = dbres;
            if (isNedbTable.length == 0) {
              app
                .service('databases')
                .create({
                  dbType: 'nedb',
                  dbName: tbnedb,
                  createAt: new Date(),
                })
                .then((dbcre) => {
                  logger.info(`Creation de la base  ${dbcre} `);
                })
                .catch((err) => {
                  logger.info('error database');
                });
            }
            logger.info('Table nedb  existante trouvée  : %j', tbnedb);
          });
        /*.catch((err) => {
            logger.info("error database");
          });*/
      });
    }
  }

  const options = {
    paginate: false,
  };
  // Initialize our service with any options it requires
  app.use('/checkdbs', new Checkdbs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('checkdbs');

  service.hooks(hooks);
};
