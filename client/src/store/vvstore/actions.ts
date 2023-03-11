import { Notify } from "quasar";
import { ActionTree } from 'vuex';
import feathersClient from "src/boot/feathers-client";
import { VvStoreStateInterface } from "./state";

const actions: ActionTree<VvStoreStateInterface, any> = {
  async createTable ({ commit }: any, payload: any) {

    console.log("Feathers services", feathersClient)

    console.log("Feathers payload", payload)
    let results = await feathersClient.service('tables').create(payload.datas, {
      query: {
        tableDb: payload.tableDb,//'nedb','mongodb'
        tableName: payload.tableName
      }
    })/*.then((results: any) => {
    console.log('Result :', results)
  }).catch((err: any) => { console.log('Error :', err) })*/
    commit('setLastResult', results);
    let newdatas = await feathersClient.service('tables').find({
      query: {
        tableDb: payload.tableDb,//'nedb','mongodb'
        tableName: payload.tableName,
        query: JSON.stringify({})
      }
    })

    let table = { tableDb: payload.tableDb, tableName: payload.tableName, datas: newdatas }

    //return results
    commit("setTable", table);

  },
  async queryTable ({ commit }: any, payload: any) {
    let resdatas = await feathersClient.service('tables').find({
      query: {
        tableDb: payload.tableDb,//'nedb','mongodb'
        tableName: payload.tableName,
        query: JSON.stringify({ query: payload.query })
      }
    })
    commit('setQuery', payload.query)
    commit('setQueryResult', resdatas)

  }

}

export default actions
