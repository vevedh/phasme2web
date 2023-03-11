import { GetterTree } from 'vuex';
//import { StateInterface } from '../index';
import { SimplyDeskStateInterface } from './state';

const getters: GetterTree<SimplyDeskStateInterface, any> = {
  getUsers (context: any) {
    // your code

    return context.users
  }
};

export default getters;
