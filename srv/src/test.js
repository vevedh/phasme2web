import  MongoClient  from 'mongodb'
import { logger } from './logger.js'

  const connection = process.env.MONGODB_URL

  const database = new URL(connection).pathname.substring(1)
  logger.info('Base de donnée : ' + database);
  logger.info('Base url de connexion : ' + connection);
  MongoClient.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((client) => {


  const dbAdmin = client.db().admin();
  dbAdmin.listDatabases().then((result) => {
    logger.info('Databases : %j',result.databases);
    //app.set('alldatabases', result.databases);
  });
  //app.set('dbAdmin', dbAdmin);
  //app.set('currentDatabase', database);
  //app.set('mongodb_ok', true);
  logger.info(
    'Votre base de donnée Mongodb est  accessible et configurée!'
  );
  return client.db(database)

  })
  .catch((err) => {

    logger.info(
      'Votre base de donnée Mongodb n\'est pas accessible ou est non configurée!'
    );
    logger.info(`Dans le fichier de configuration vous devez avoir une chaine de connexion accessible!\n
    Exemple de configuration:

      "mongodb": "mongodb://localhost:27017/database?authSource=admin"\n `);
  });

