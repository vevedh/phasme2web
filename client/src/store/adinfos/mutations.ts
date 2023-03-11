import axios from 'axios';

import feathersClient from 'src/boot/feathers-client';

import { MutationTree } from 'vuex';

import { adInfosStateInterface } from './state';

const mutation: MutationTree<adInfosStateInterface> = {
  setRole(state: adInfosStateInterface, role) {
    console.log('Role :', role);
    state.isAdmin = role;
  },

  setSiteAdmin(state: adInfosStateInterface, val) {
    state.isSiteAdmin = val;
  },

  setSiteRole(state: adInfosStateInterface, val) {
    state.siteRole = val;
  },

  setUserGrpes(state: adInfosStateInterface, val) {
    state.userGrpes = val;
  },

  setAllUtilisateurs(state: adInfosStateInterface, val) {
    state.users = Object.assign([],val);
  },

  setAllDatabases(state: adInfosStateInterface, val) {
    state.bases = Object.assign([],val);
  },

  setCurrentTables(state: adInfosStateInterface, val) {
    state.currentTables = Object.assign([],val);
  },

  setCurrentDb(state: adInfosStateInterface, val) {
    state.currentDb = val;
  },
  setCurrentTableDatas(state: adInfosStateInterface, val) {
    state.currentDatas = Object.assign([],val);
  },
};
export default mutation;
