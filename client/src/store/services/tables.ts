import feathersClient, { makeServicePlugin, BaseModel } from '../../boot/feathers-client'

class Table extends BaseModel {
  constructor(data: any, options: any) {
    //options.pagination =  null
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Table';

  // Define default properties here
  static instanceDefaults () {
    return {}
  }
}
const servicePath = 'tables'
const servicePlugin = makeServicePlugin({
  Model: Table,
  service: feathersClient.service(servicePath),
  servicePath,
  whitelist: ['$regex', '$options'],
  extend ({ store, module }) {
    // Listen to other parts of the store
    //store.watch(/* truncated */)

    return {
      state: {
        table: [],
        actualites: [{
          _id: '',
          description: 'test',
          rubriques: [],
          titre: 'NOS ACTUALITES',
          type: 'actualite'
        }]

      },
      getters: {
        listActus (state: any) {
          return state.actualites[0]
        },
        getTableQuery (state: any) {
          return state.table
        }
      },
      mutations: {
        setAllActus (state: any, context: any) {
          console.log("Test setAllActus :", context)
          state.actualites = context

        },
        setTableQuery (state: any, payload: any[]) {
          let type = payload[0];
          let table = payload[1];
          let datas = payload[2];
          console.log(`Set Params : ${type},${table}`)
          if (Array.isArray(state.table)) {
            let seltables = state.table.filter((elt: any) => ((elt.type == type) && (elt.table == table)))
            if (seltables.length == 0) {
              state.table.push({ type: type, name: table, datas: datas })
            } else {
              state.table.map((elt: any) => {
                if ((elt.type == type) && (elt.table == table)) {
                  elt.datas = datas
                }
                return elt
              })
            }
          }

        }
      },
      actions: {
        getTableQuery (context: any, payload: any[]) {
          let type = payload[0];
          let table = payload[1];
          let query = payload[2]; //object
          console.log(`Params : ${type},${table},${query}`)
          feathersClient.service(servicePath).find({
            query: {
              tableDb: type,
              tableName: table,
              query: JSON.stringify({ query: query })
            }
          }).then((datas: any) => {
            console.log("Datas :", datas)
            console.log("Query :", query)
            let newpayload = [];
            newpayload.push(type)
            newpayload.push(table)
            newpayload.push(datas)
            console.log("payload :", newpayload)
            context.commit('setTableQuery', newpayload);
          })
        },
        async getTableById (context: any, payload: any[]) {
          let id = payload[0];
          let type = payload[1];
          let table = payload[2];
          //let newData = payload[3];
          let currentDatas = await feathersClient.service(servicePath).find({
            query: {
              tableDb: type,
              tableName: table,
              query: JSON.stringify({ query: { _id: id } })
            }
          })

          let newpayload = [];
          newpayload.push(type)
          newpayload.push(table)
          newpayload.push(currentDatas)
          console.log("payload :", newpayload)
          context.commit('setTableQuery', newpayload);

        },
        async updateTableById (context: any, payload: any[]) {
          let id = payload[0];
          let type = payload[1];
          let table = payload[2];
          let newData = payload[3];
          let currentObj = await feathersClient.service(servicePath).find({
            query: {
              tableDb: type,
              tableName: table,
              query: JSON.stringify({ query: { _id: id } })
            }
          })


          let datas = await feathersClient.service(servicePath).update(currentObj._id, newData, {
            query: {
              tableDb: type,
              tableName: table
            }
          })
          let newpayload = [];
          newpayload.push(type)
          newpayload.push(table)
          newpayload.push(datas)
          console.log("payload :", newpayload)
          context.commit('setTableQuery', newpayload);

        },
        async createDataTable (context: any, payload: any[]) {
          //let id = payload[0];
          let type = payload[0];
          let table = payload[1];
          let newData = payload[2];



          let datas = await feathersClient.service(servicePath).create(newData, {
            query: {
              tableDb: type,
              tableName: table
            }
          })
          let newpayload = [];
          newpayload.push(type)
          newpayload.push(table)
          newpayload.push(datas)
          console.log("payload :", newpayload)
          context.commit('setTableQuery', newpayload);

        },
        getAllActus (context: any, _payload: []) {
          feathersClient.service(servicePath).find({
            query: {
              tableDb: 'mongodb',
              tableName: 'dbHomeSections',
              query: JSON.stringify({ query: { type: 'actualite' } })
            }
          }).then((datas: any) => {
            context.commit('setAllActus', datas);
          })
        },
        async updateRubriqueActusById (context: any, payload: any[]) {
          let idRubrique = payload[0];
          let newRubrique = payload[1];
          let actualites = await feathersClient.service(servicePath).find({
            query: {
              tableDb: 'mongodb',
              tableName: 'dbHomeSections',
              query: JSON.stringify({ query: { type: 'actualite' } })
            }
          })

          actualites[0].rubriques[idRubrique] = newRubrique
          await feathersClient.service(servicePath).update(actualites[0]._id, actualites[0], {
            query: {
              tableDb: 'mongodb',
              tableName: 'dbHomeSections'
            }
          })
          context.commit('setAllActus', actualites);
          //console.log("Context details :",context)

        },
        async addRubriqueActus (context: any, payload: any[]) {

          let newRubrique = payload[0];
          let actualites = await feathersClient.service(servicePath).find({
            query: {
              tableDb: 'mongodb',
              tableName: 'dbHomeSections',
              query: JSON.stringify({ query: { type: 'actualite' } })
            }
          })

          console.log("Actualites :", actualites)

          actualites[0].rubriques.push(newRubrique)
          await feathersClient.service(servicePath).update(actualites[0]._id, actualites[0], {
            query: {
              tableDb: 'mongodb',
              tableName: 'dbHomeSections'
            }
          })
          context.commit('setAllActus', actualites);
          //console.log("Context details :",context)

        },
        async delRubriqueActus (context: any, payload: any[]) {


          let idRub = payload[0];
          let actualites = await feathersClient.service(servicePath).find({
            query: {
              tableDb: 'mongodb',
              tableName: 'dbHomeSections',
              query: JSON.stringify({ query: { type: 'actualite' } })
            }
          })

          console.log("Actualites :", actualites)

          actualites[0].rubriques.splice(idRub, 1)
          await feathersClient.service(servicePath).update(actualites[0]._id, actualites[0], {
            query: {
              tableDb: 'mongodb',
              tableName: 'dbHomeSections'
            }
          })
          context.commit('setAllActus', actualites);
          //console.log("Context details :",context)

        }
      }
    }
  }
})


const checkQuery = async (context: any) => {


  const { app, method, result, params } = context;


  console.log("Query table ", context);

  //params.query.query = JSON.stringify(params.query.query)


  return context
}

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],//checkQuery
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin
