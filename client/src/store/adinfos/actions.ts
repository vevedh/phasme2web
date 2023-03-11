import { Notify } from 'quasar';

import { ActionTree } from 'vuex';

import feathersClient from 'src/boot/feathers-client';

import axios from 'axios';

import { adInfosStateInterface } from './state';


const actions: ActionTree<adInfosStateInterface, any> = {

  async getRole(context, payload) {
    let isAdmin = false;
    let grpes = [];
    console.log('User to get role', payload);
    let admGroupes = (await feathersClient.service('conf-infos').find())
      .admGroups; //(await feathersClient.service('conf-infos').find())[0].admGroups
    console.log('Admins :', admGroupes);
    // est authentifié
    console.log('Est authentifié :', feathersClient.authentication.authenticated);
    console.log('Est authentifié :', feathersClient.authentication.storage);
    if (feathersClient.authentication.authenticated) {
      const auth = await feathersClient.reAuthenticate();
      console.log('Auth infos :', auth);
      let current = auth.authentication.payload.user;//payload; //auth.user.sAMAccountName
  
      console.log('Current user ', current);
      if (Object(current).hasOwnProperty('user')) {
        current  = current.user
      }
      grpes =
        current.memberOf && Array.isArray(current.memberOf)
          ? current.memberOf.map((item: any) => {
              return item.match(new RegExp(/(?<=CN=)(.*?)(?=\,)/, 'gm'))[0];
            })
          : current.memberOf.match(new RegExp(/(?<=CN=)(.*?)(?=\,)/, 'gm'));
      console.log('User groupe :', grpes);
      context.commit('setUserGrpes',grpes)
  
      isAdmin =
        grpes.filter((x: any) =>
          (Array.isArray(admGroupes) ? admGroupes : ['none']).includes(x)
        ).length > 0
          ? true
          : false;
    }
  
    console.log('ROLES isAdmin :', isAdmin);
    context.commit('setRole', isAdmin);
    
  
    //console.log("Auth role :",current.user)
  },
  
  async getSiteRole(context) {
    const grpes = (await axios.get(window.location.origin+'/admins.json')).data;
  
    console.log('Est authentifié :', feathersClient.authentication.authenticated);
    if (feathersClient.authentication.authenticated) {
      const auth = await feathersClient.authentication.app.authenticate();
      console.log('Auth infos :', auth.user.sAMAccountName);
      console.log('Utilisateurs admins :', grpes.admrdc);
      let username = auth.user.sAMAccountName;
      context.commit('setSiteRole', 'invite');
      if (grpes.admrdc.includes(username)) {
        context.commit('setSiteAdmin', true);
        console.log('ADMIN DU SITE  RDC');
        context.commit('setSiteRole', 'admrdc');
      }
  
      if (grpes.admparking.includes(username)) {
        context.commit('setSiteAdmin', true);
        console.log('ADMIN DU SITE PARKING');
        context.commit('setSiteRole', 'admparking');
      }
    }
  },
  
  
  async getAllDatabases (context) {
    const databases = await feathersClient.service('checkdbs').find({
      query: {
        database: 'databases'
      }
    });
  
    console.log('Toutes les bases :', databases)
    context.commit('setAllDatabases', databases)
  },
  
  // liste des utilisateurs de la cacem
  async getAllUsers(context) {
    //
     //await feathersClient.service('adUsers').find({});// filter:'(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))'
     const users = await feathersClient
      .service('tables')
      .find({
        query: {
          tableDb: 'cacemdb',
          tableName: 'ad-users',
          query: JSON.stringify({}),
        },
      });
    console.log('Liste des utilisateurs :', users);
    context.commit('setAllUtilisateurs', users);
  },
  
  
  async getTables (context, db: String) {
    const tables = await feathersClient.service('checkdbs').find({
      query: {
        todb: `${db}`
      }
    });
    console.log('Toutes les tables :', tables)
    context.commit('setCurrentTables', tables)
  },
  
  async getTableDatas (context, ...args: any[]) {
    console.log('Arguments :',args)
    console.log('db :', args[0][0])
    console.log('Table :', args[0][1])
    const tbDatas = await feathersClient.service('tables').find({ query: { tableDb: args[0][0], tableName: args[0][1], query: JSON.stringify({}) } })
    console.log('Toutes les données :', tbDatas)
    context.commit('setCurrentTableDatas', tbDatas)
  }
}


export default actions;


