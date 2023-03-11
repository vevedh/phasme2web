import { Module } from 'vuex';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state, { adInfosStateInterface } from './state';


const adinfos: Module<adInfosStateInterface, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
export default adinfos;
