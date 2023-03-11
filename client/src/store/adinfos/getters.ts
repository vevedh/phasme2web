import { GetterTree } from 'vuex';

import feathersClient from 'src/boot/feathers-client';

import { adInfosStateInterface } from './state';

const getters: GetterTree<adInfosStateInterface, any> = {
  getRole(state: adInfosStateInterface) {
    return state.isAdmin;
  },

  getSiteRole(state: adInfosStateInterface) {
    return state.siteRole;
  },

  getDatabases(state: adInfosStateInterface) {
    
    return state.bases;
  },

  getCurrentTables(state: adInfosStateInterface) {

    return state.currentTables;
  },
};
export default getters;
