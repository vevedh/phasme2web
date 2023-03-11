import { Module } from 'vuex';
//import { StateInterface } from '../index';
import state, { AdminStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const admin: Module<AdminStateInterface, any> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default admin;
