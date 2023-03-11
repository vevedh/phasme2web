/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
const logger = require('../../logger');
const jetpack = require('fs-jetpack');
const path = require('path');
const { reject } = require('bluebird');
const MongoClient = require('mongodb').MongoClient;
//const vvtool = require('../../encrypt2');
exports.Checkdbs = class Checkdbs {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    if (params && params.query.database === 'database') {
      logger.info('Mongo database : %s',this.app.get('currentDatabase'));
      return Promise.resolve(this.app.get('currentDatabase'));
    }
    if (params && params.query.database === 'databases') {
      logger.info('Mongo databases : %j',this.app.get('alldatabases'));
      return Promise.resolve(this.app.get('alldatabases'));
    }
    if (params && Object(params.query).hasOwnProperty('todb')) {
      //console.log('for base :',params.query.todb);
      // liste pour un autre mongoclient connection
      return new Promise((resolve, reject) => {
        const connection = this.app.get('mongodb');//vvtool.decrypt(this.app.get('authentication').secret,this.app.get('mongodb'));
        MongoClient.connect(connection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
          .then((client) => {
            if (client) {
              logger.info('Mongo Client connecté ! '); //, client)
              logger.info('Base MongoDb  : %s', params.query.todb);

              client.db(params.query.todb).listCollections().toArray((err, collectionInfos) => {
                if (err) {
                  reject([]);
                }
                logger.info('Tables : %j', collectionInfos);

                if (Array(collectionInfos).length == 0) {
                  reject('Pas de collections/tables dans la base');
                } else {
                  logger.info(
                    `${
                      collectionInfos.length
                    } collections/tables dans la base ${this.app.get(
                      'currentDatabase'
                    )}`
                  );
                  for (let index = 0; index < collectionInfos.length; index++) {
                    const elt = collectionInfos[index];
                    logger.info('Visite la collection/table : %j', elt);
                  }
                  resolve(collectionInfos);
                }
              });
            }
          })
          .catch((err) => {
            reject([]);
          });
      });
    }
    return new Promise((resolve, reject) => {

      this.app
        .get('mongoClient')
        .then((client) => {
          if (client) {
            client.listDatabases((err, dbs) => {
              logger.info('dbs : %j', dbs);

            });
            logger.info('Mongo Client connecté ! '); //, client)
            logger.info(
              'Base MongoDb vvv active : %s',
              this.app.get('currentDatabase')
            );

            client.listCollections().toArray((err, collectionInfos) => {
              if (err) {
                ////console.log('Aucunes collections/tables!!!');
                reject([]);
              }
              logger.info('Tables : %j', collectionInfos);

              if (Array(collectionInfos).length == 0) {
                //console.log('Pas de collections/tables dans la base');
                reject([]);
              } else {
                logger.info(
                  `${
                    collectionInfos.length
                  } collections/tables dans la base ${this.app.get(
                    'currentDatabase'
                  )}`
                );
                for (let index = 0; index < collectionInfos.length; index++) {
                  const elt = collectionInfos[index];
                  logger.info('Visite la collection/table : %j', elt);
                }
                resolve(collectionInfos);
              }
            });
          }
        })
        .catch((err) => {
          reject([]);
        });
      resolve([]);
    });
    //return [];
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  //   create({ changeDb: 'db_visiocacem'})
  async create(data, params) {
    return new Promise((resolve, reject) => {
      if (data && Object(data).hasOwnProperty('changeDb')) {
        var dbname = data.changeDb;
        //const connection = this.app.get("mongodb");
        const database = dbname;
        this.app
          .get('MongoClient')
          .then((client) => {
            const dbAdmin = client.db().admin();
            this.app.set('dbAdmin', dbAdmin);
            this.app.set('currentDatabase', database);
            this.app.set('mongoClient', client);
            resolve(client.db(database));
          })
          .catch((err) => {
            reject(err);
          });
      }  else {
        reject('Commande impossible');
      }
    });
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
