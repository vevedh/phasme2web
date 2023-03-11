import { GetterTree } from 'vuex';
//import { StateInterface } from '../index';
import { AdminStateInterface } from './state';

const getters: GetterTree<AdminStateInterface, any> = {
  getTitle (context) {
    // your code
    return context.title
  },
  getFormData(context) {
    return context.getform
  }
};

export default getters;
