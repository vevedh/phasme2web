
import { ActionTree } from 'vuex';
//import { StateInterface } from '../index';
import { TeamViewerStateInterface } from './state';
import axios from "axios";

const actions: ActionTree<TeamViewerStateInterface, any> = {
  async getUsers(context) {
    // your code
    let httpOptions = {

        'Content-Type': 'application/json',
        'Authorization': 'Bearer 9232663-JbLRxOYVLtgHUFnvribV'

    };
    let results = await axios.get('https://webapi.teamviewer.com/api/v1/users?full_list=true',{headers:httpOptions})

    console.log("Utilisateurs teamviewer :",results.data.users)
    context.commit('changeUsers',results.data.users)
  }
};

export default actions;
