const logger = require('./logger');
const MongoClient = require('mongodb').MongoClient;
//const vvtool = require('./encrypt2');
module.exports = function (app) {
  const connection = app.get('mongodb'); //vvtool.decrypt(app.get('authentication').secret,app.get('mongodb'));
  const database = connection
    .substr(connection.lastIndexOf('/') + 1)
    .replace('?authSource=admin', '');
  logger.info('Base de donnée : ' + database);
  logger.info('Base url de connexion : ' + connection);
  // console.log("Database :",database)
  // .then(client => client.db(database));
  const mongoClient = MongoClient.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((client) => {
      const dbAdmin = client.db().admin();
      dbAdmin.listDatabases((err, result) => {
        console.log('Databases :',result.databases);
        app.set('alldatabases', result.databases);
      });
      app.set('dbAdmin', dbAdmin);
      app.set('currentDatabase', database);
      app.set('mongodb_ok', true);

      return client.db(database);
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

  app.set('mongoClient', mongoClient);
};
