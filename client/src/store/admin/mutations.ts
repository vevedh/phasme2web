import { MutationTree } from 'vuex';

import { AdminStateInterface } from './state';

const mutation: MutationTree<AdminStateInterface> = {
  changeTitle (state: AdminStateInterface, payload) {
    // your code
    state.title = "Change title to " + payload
  },
  setConfig (state: AdminStateInterface, params) {
    state.config = params;
  },
  changeLeftDrawer (state: AdminStateInterface, params) {
    state.leftMenu = !state.leftMenu
  },
  setLeftDrawer (state: AdminStateInterface, params) {
    state.leftMenu = params
  },
  setMailSendEmail (state: AdminStateInterface, params) {
    state.mailsend = params
  },
  setAllVisiteurs (state: AdminStateInterface, params) {
    state.visiteurs = params
  },
  setVisiteursParking (state: AdminStateInterface, params) {
    state.visiteursParking = params
  },
  setAllUtilisateurs (state: AdminStateInterface, params) {
    state.utilisateurs = params
  },
  setAllComputers (state: AdminStateInterface, params) {
    state.pcs = params
  },
  setAllOUs (state: AdminStateInterface, params) {
    state.ous = params
  },
  setSavedForm (state: AdminStateInterface, params) {
    state.savedform = Object.assign({},params)
  },
  setGetForm (state: AdminStateInterface, params) {
    state.getform = Object.assign([],params);
  },
  setAllForms (state: AdminStateInterface, params) {
    state.allForms = params
  },
  setTemplates (state: AdminStateInterface, params) {
    state.ftemplates = Object.assign([],params);
  },
  setSelTemplate(state: AdminStateInterface, params) {
    state.template = Object.assign({},params);
  },
  setAllAppLinks (state: AdminStateInterface, params) {
    state.applinks = params
  },
  

};

export default mutation;
