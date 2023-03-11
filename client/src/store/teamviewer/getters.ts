import { GetterTree } from 'vuex';
//import { StateInterface } from '../index';
import { TeamViewerStateInterface } from './state';

const getters: GetterTree<TeamViewerStateInterface, any> = {
  getUsers (context: any) {
    // your code

    return context.users
  }
};

export default getters;
