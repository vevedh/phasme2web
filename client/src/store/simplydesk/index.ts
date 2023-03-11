import { Module } from 'vuex';
//import { StateInterface } from '../index';
import state, { SimplyDeskStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const SimplyDesk: Module<SimplyDeskStateInterface, any> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default SimplyDesk;
