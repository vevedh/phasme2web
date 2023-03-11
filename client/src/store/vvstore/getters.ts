import { VvStoreStateInterface } from "./state";
import { GetterTree } from 'vuex';

const getters: GetterTree<VvStoreStateInterface, any> = {
  getTables (state: VvStoreStateInterface) {
    return state.tables
  },
  getLayoutNeeded (state: VvStoreStateInterface) {
    return state.layoutNeeded
  },
  getIsLoginPage (state: VvStoreStateInterface) {
    return state.isLoginPage
  },
  getMobileMode (state: VvStoreStateInterface) {
    return state.mobileMode
  },
  getMenuCollapse (state: VvStoreStateInterface) {
    return state.menuCollapse
  },
  getPosts (state: VvStoreStateInterface) {
    return state.posts
  }
}

export default getters

