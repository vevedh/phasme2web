import { MutationTree } from 'vuex';
import { VvStoreStateInterface } from "./state"
import feathersClient from "src/boot/feathers-client";

const mutation: MutationTree<VvStoreStateInterface> = {
  async setTable (state: VvStoreStateInterface, params: any) {
    console.log('Table type:', params.tableDb)
    console.log('Table Name:', params.tableName)
    console.log("Table Datas :", params.datas)

    const isTable = state.tables.find(elt => elt.dbName == params.tableName)
    console.log('Table existe :', isTable)
    if (!isTable) {
      console.log('Ajout de la table')
      state.tables.push({ dbType: params.tableDb, dbName: params.tableName, datas: params.datas })
    } else {

      isTable.datas = params.datas;
    }
  },
  initTable (state: VvStoreStateInterface, params: any) {
    state.tables = params
  },
  setDatabase (state: VvStoreStateInterface, params: any) {
    state.database = params
  },
  setLastResult (state: VvStoreStateInterface, params: any) {
    state.lastresult = params
  },
  setQueryResult (state: VvStoreStateInterface, params: any) {
    state.queryresult = params
  },
  setQuery (state: VvStoreStateInterface, params: any) {
    state.query = params
  },
  setLayoutNeeded (state: VvStoreStateInterface, value: any) {
    state.layoutNeeded = value
  },
  setIsLoginPage (state: VvStoreStateInterface, value: any) {
    state.isLoginPage = value
  },
  setMobileMode (state: VvStoreStateInterface, value: any) {
    state.mobileMode = value
  },
  setMenuCollapse (state: VvStoreStateInterface, value: any) {
    state.menuCollapse = value
  },
  setPosts (state: VvStoreStateInterface, posts: any) {
    state.posts = posts
  }
}


export default mutation
