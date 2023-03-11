const NeDB = require('nedb');
const path = require('path');
const logger = require('../../logger');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
//const vvtool = require('../../encrypt2');
exports.Tables = class DynamicService {
  setup(app, path) {
    this.app = app;
    this.path = path;
    this.params = app.params;
  }

  /*class Tables {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
    this.params = app.params;
  }*/

  async find(params) {
    logger.info(
      `tableDb :${params.query.tableDb},tableName :${params.query.tableName}`
    );





    if (params.query.tableDb && params.query.tableName) {

      if ((params.query.tableDb != 'mongodb') && (params.query.tableName != '')) {
        const newSpeMongo = require('feathers-mongodb');
        const connection = this.app.get('mongodb');//vvtool.decrypt(this.app.get('authentication').secret,this.app.get('mongodb'));
        MongoClient.connect(connection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
          .then((client) => {
            //console.log('Client :',client)
            //console.log('Collection name:',client.db(`${params.query.tableDb}`).collection(params.query.tableName))
            this.app.use(`/${params.query.tableName}`, newSpeMongo({Model:client.db(`${params.query.tableDb}`).collection(params.query.tableName),paginate:false,multi:true},this.app));
            this.app.set(`${params.query.tableDb}`, client.db(`${params.query.tableDb}`));
          }).catch(err => { console.log('Details :',err);});
      }

      if (String(params.query.tableName).indexOf('?') != -1) {
        const tableName = String(params.query.tableName).split('?')[0];
        const paramsVals = String(params.query.tableName).split('?')[1];
        logger.info(
          'Search =',
          Object.fromEntries(new URLSearchParams(paramsVals))
        );

        return this.getService(params.query.tableDb, tableName).find({
          query: Object.fromEntries(new URLSearchParams(paramsVals)),
        });
      } else if (params.query.query) {

        console.log('Query :',params.query.query);
        let qry = JSON.parse(params.query.query);

        console.log('DB name:',params);
        const dbBase = params.query.tableDb;
        const dbTable =  params.query.tableName;
        try {
          return this.getService(
            dbBase,
            dbTable
          ).find(qry);//{ query:JSON.parse(params.query.query)}
        } catch (error) {
          return error;
        }


        // { query : JSON.parse(params.query.query) }
      } else {
        //console.log('Query data :',params.query.query);
        return this.getService(
          params.query.tableDb,
          params.query.tableName
        ).find({});

      }
    } else {
      return 'Erreur !';
    }
  }

  async get(id, params) {
    if (params.query.tableDb && params.query.tableName) {
      if ((params.query.tableDb != 'mongodb') && (params.query.tableName != '')) {
        const newSpeMongo = require('feathers-mongodb');
        const connection = this.app.get('mongodb');//vvtool.decrypt(this.app.get('authentication').secret,this.app.get('mongodb'));
        MongoClient.connect(connection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
          .then((client) => {
            //console.log('Client :',client)
            console.log('Collection name:',client.db(`${params.query.tableDb}`).collection(params.query.tableName));
            this.app.use(`/${params.query.tableName}`, newSpeMongo({Model:client.db(`${params.query.tableDb}`).collection(params.query.tableName),paginate:false,multi:true},this.app));
            this.app.set(`${params.query.tableDb}`, client.db(`${params.query.tableDb}`));
          }).catch(err => { console.log('Details :',err);});
      }
      return this.getService(params.query.tableDb, params.query.tableName).get(
        id,
        params
      );
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Table not found' });
    }
  }

  async create(data, params) {
    console.log('Create data :', data);
    console.log('Create params :', params.query);
    if (params.query.tableDb && params.query.tableName) {
      if ((params.query.tableDb != 'mongodb') && (params.query.tableName != '')) {
        const newSpeMongo = require('feathers-mongodb');
        const connection = this.app.get('mongodb'); //vvtool.decrypt(this.app.get('authentication').secret,this.app.get('mongodb'));
        MongoClient.connect(connection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
          .then((client) => {
            //console.log('Client :',client)
            //console.log('Collection name:',client.db(`${params.query.tableDb}`).collection(params.query.tableName))
            this.app.use(`/${params.query.tableName}`, newSpeMongo({Model:client.db(`${params.query.tableDb}`).collection(params.query.tableName),paginate:false,multi:true},this.app));
            this.app.set(`${params.query.tableDb}`, client.db(`${params.query.tableDb}`));
          }).catch(err => { console.log('Details :',err);});
      }
      console.log('create table ', params.query.tableName);

      const dbFind = await this.app.service('databases').find({
        query: {
          dbName: params.query.tableName,
          dbType: params.query.tableDb,
        },
      });

      if (dbFind && dbFind.length != 0) {
        console.log('Dbfind :', dbFind);
        console.log('Cette table existe déjà malheureusement !');
        return this.getService(
          params.query.tableDb,
          params.query.tableName
        ).create(data, params);
        // throw new Error(`Il y a déjà 1 table avec ce nom ${params.query.tableName} et type ${params.query.tableDb} !`);
      } else {
        console.log(`Creation possible de la table ${params.query.tableName} `);

        const dbCreate = await this.app.service('databases').create({
          dbType: params.query.tableDb,
          dbName: params.query.tableName,
          createAt: new Date(),
        });

        if (dbCreate) {
          console.log(
            `Creation de la table  ${params.query.tableName} effectuée `
          );
        }

        return this.getService(
          params.query.tableDb,
          params.query.tableName
        ).create(data, params);
      }
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Table not found' });
    }
  }

  async update(id, data, params) {
    if (params.query.tableDb && params.query.tableName) {
      if ((params.query.tableDb != 'mongodb') && (params.query.tableName != '')) {
        const newSpeMongo = require('feathers-mongodb');
        const connection = this.app.get('mongodb'); //vvtool.decrypt(this.app.get('authentication').secret,this.app.get('mongodb'));
        MongoClient.connect(connection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
          .then((client) => {
            //console.log('Client :',client)
            //console.log('Collection name:',client.db(`${params.query.tableDb}`).collection(params.query.tableName))
            this.app.use(`/${params.query.tableName}`, newSpeMongo({Model:client.db(`${params.query.tableDb}`).collection(params.query.tableName),paginate:false,multi:true},this.app));
            this.app.set(`${params.query.tableDb}`, client.db(`${params.query.tableDb}`));
          }).catch(err => { console.log('Details :',err);});
      }
      return this.getService(
        params.query.tableDb,
        params.query.tableName
      ).update(id, data, params.query.params);
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Table not found' });
    }
  }

  async patch(id, data, params) {
    if (params.query.tableDb && params.query.tableName) {

      if ((params.query.tableDb != 'mongodb') && (params.query.tableName != '')) {
        const newSpeMongo = require('feathers-mongodb');
        const connection = this.app.get('mongodb'); //vvtool.decrypt(this.app.get('authentication').secret,this.app.get('mongodb'));
        MongoClient.connect(connection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
          .then((client) => {
            //console.log('Client :',client)
            //console.log('Collection name:',client.db(`${params.query.tableDb}`).collection(params.query.tableName))
            this.app.use(`/${params.query.tableName}`, newSpeMongo({Model:client.db(`${params.query.tableDb}`).collection(params.query.tableName),paginate:false,multi:true},this.app));
            this.app.set(`${params.query.tableDb}`, client.db(`${params.query.tableDb}`));
          }).catch(err => { console.log('Details :',err);});
      }

      return this.getService(
        params.query.tableDb,
        params.query.tableName
      ).patch(id, data, params);
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Table not found' });
    }
  }

  async remove(id, params) {
    console.log('Id :', id);
    console.log('Params :', params.query);
    if (params.query.tableDb && params.query.tableName) {

      if ((params.query.tableDb != 'mongodb') && (params.query.tableName != '')) {
        const newSpeMongo = require('feathers-mongodb');
        const connection = this.app.get('mongodb'); //vvtool.decrypt(this.app.get('authentication').secret,this.app.get('mongodb'));
        MongoClient.connect(connection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
          .then((client) => {
            //console.log('Client :',client)
            //console.log('Collection name:',client.db(`${params.query.tableDb}`).collection(params.query.tableName))
            this.app.use(`/${params.query.tableName}`, newSpeMongo({Model:client.db(`${params.query.tableDb}`).collection(params.query.tableName),paginate:false,multi:true},this.app));
            this.app.set(`${params.query.tableDb}`, client.db(`${params.query.tableDb}`));
          }).catch(err => { console.log('Details :',err);});
      }

      return this.getService(
        params.query.tableDb,
        params.query.tableName
      ).remove(id, params.query.params);
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Table not found' });
    }
  }

  getService(db, name) {
    console.log('Type Table :', db);
    console.log('Table name :', name);

    if (String(name).indexOf('?') != -1) {
      name = String(name).split('?')[0];
    }

    if (!this.app.service(`${name}`)) {
      //  creation du service selon type de base de donnée
      switch (db) {
      case 'nedb':
        //  database  adapter
        const { Service } = require('feathers-nedb');

        console.log('Service NEDB table :', name, __dirname);
        // Modele + service
        this.app.use(
          `/${name}`,
          new Service({
            Model: new NeDB({
              filename: `${__dirname}/../../../db-data/${name}`, // `./db-data/${name}`,//path.resolve(process.cwd() + "/db-data/" + name),
              autoload: true,
            }),
            paginate: false,
            multi: true,
          })
        );

        break;
      case 'mongodb':
        //  database  adapter
        const ServiceMongo = require('feathers-mongodb');

        class mongoService extends ServiceMongo {
          constructor(options, app) {
            super(options);

            app.get('mongoClient').then((client) => {
              this.Model = client.collection(name);
            });
          }
        }
        // lister les collection existantes
        // et verifier si elles exites dans databases ( tables utilisables )

        const options = {
          // Model: createModel(app),
          paginate: false, // app.get('paginate')
          multi: true,
        };

        // Initialize our service with any options it requires
        this.app.use(`/${name}`, new mongoService(options, this.app));
        //
        break;
      case 'db_' + db.substring(3, db.length):
        console.log('Base de donnée spéciale site :', db);
        //  database  adapter
        const ServiceSpeMongo = require('feathers-mongodb');
        class mongoSpeService extends ServiceSpeMongo {
          constructor(options, app) {
            super(options);

            app.get(`${db}`).then((client) => {
              this.Model = client.collection(name);
            });
          }
        }
        // lister les collection existantes
        // et verifier si elles exites dans databases ( tables utilisables )

        const optionsSpe = {
          // Model: createModel(app),
          paginate: false, // app.get('paginate')
          multi: true,
        };

        // Initialize our service with any options it requires
        this.app.use(`/${name}`, new mongoSpeService(optionsSpe, this.app));




        //
        break;

      default:
        console.log('Base de donnée nommée :', db);
        //  database  adapter
        const ServiceDbMongo = require('feathers-mongodb');
        class mongoDbService extends ServiceDbMongo {
          constructor(options, app) {
            super(options);

            app.get(`${db}`).then((client) => {
              this.Model = client.collection(name);
            });
          }
        }
        // lister les collection existantes
        // et verifier si elles exites dans databases ( tables utilisables )

        const optionsDb = {
          // Model: createModel(app),
          paginate: false, // app.get('paginate')
          multi: true,
        };

        // Initialize our service with any options it requires
        this.app.use(`/${name}`, new mongoDbService(optionsDb, this.app));
        /*const { ServiceNedb } = require("feathers-nedb");
          console.log("Service NEDB table sys :", name);

          this.app.use(
            `/${name}`,
            new ServiceNedb({
              Model: new NeDB({
                filename: `${__dirname}/../../../db-sys-data/${name}`, // path.resolve(process.cwd() + "server/db-sys-data/" + name),//,//path.resolve(process.cwd() + "/db-sys-data/" + name),
                autoload: true,
              }),
              paginate: false,
              multi: true,
            })
          );

          this.app.service(`${name}`);*/
        break;
      }
    }

    return this.app.service(`${name}`);
  }
};
