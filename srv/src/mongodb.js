// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import  {MongoClient}  from 'mongodb'
import { logger } from './logger.js'
export const mongodb = (app) => {
  const connection = app.get('mongodb')

  const database = new URL(connection).pathname.substring(1)
  logger.info('Base de donnée : ' + database);
  logger.info('Base url de connexion : ' + connection);
  const mongoClient = MongoClient.connect(connection).then((client) => {


  /*const dbAdmin = client.db().admin();
  dbAdmin.listDatabases((err, result) => {
    logger.info('Databases :',result.databases);
    app.set('alldatabases', result.databases);
  });
  app.set('dbAdmin', dbAdmin);*/
  //app.set('currentDatabase', database);
  //app.set('mongodb_ok', true);
  logger.info(
    'Votre base de donnée Mongodb n\'est pas accessible ou est non configurée!'
  );
  return client.db(database)

  })
  .catch((err) => {
    app.set('mongodb_ok', false);
    logger.info(
      'Votre base de donnée Mongodb n\'est pas accessible ou est non configurée!'
    );
    logger.info(`Dans le fichier de configuration vous devez avoir une chaine de connexion accessible!\n
    Exemple de configuration:

      "mongodb": "mongodb://localhost:27017/database?authSource=admin"\n `);
  });

  app.set('mongodbClient', mongoClient)
}
