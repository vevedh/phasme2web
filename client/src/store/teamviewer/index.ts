import { Module } from 'vuex';
//import { StateInterface } from '../index';
import state, { TeamViewerStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const teamviewer: Module<TeamViewerStateInterface, any> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default teamviewer;
