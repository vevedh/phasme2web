// src/store/index.js
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { store as wrapper } from 'quasar/wrappers'
import { FeathersVuex, makeAuthPlugin } from '../boot/feathers-client'

import users from './services/users'
import tables from './services/tables'
import ConfInfos from './services/confInfos'
import CheckDbs from './services/checkdbs'
import Simtickets from './services/simtickets'
import Mjml from './services/mjml'
import adinfos from './adinfos'

import admin from './admin'
import vvstore from './vvstore'
import auth from './store.auth'

import feathersClient from "src/boot/feathers-client";
import teamviewer from './teamviewer'
import SimplyDesk from './simplydesk'


Vue.use(Vuex)
Vue.use(FeathersVuex)

/*
export interface StateInterface {
  admin: unknown;
  bases: unknown;
}*/

export const strict = false

export default wrapper(async function ({ Vue }) {
  Vue.use(Vuex)

  const store = new Vuex.Store({


    modules: {
      vvstore,
      adinfos,
      admin,
      teamviewer,
      SimplyDesk

    },
    plugins: [

      ConfInfos,
      CheckDbs,
      Simtickets,
      Mjml,
      users,
      tables,
      auth
    ],

    strict: false/*!!process.env.DEBUGGING*/
  })

  try {
    let authenticated = await feathersClient.reAuthenticate();
      //let authenticated = await store.dispatch('auth/authenticate');
    console.log('ReAuthenticated :',authenticated)
  } catch (error) {
    
  }
  //const changeDB = await feathersClient.service('checkdbs').create({ changeDb: 'visiodb' });

  const dbTables = await feathersClient.service('checkdbs').find({});
  console.log('Tables :', dbTables)

  store.state.currentTables = dbTables;

  const database = await feathersClient.service('checkdbs').find({
    query: {
      database: 'database'
    }
  });

  store.state.selectDataBase = database;


  const databases = await feathersClient.service('checkdbs').find({
    query: {
      database: 'databases'
    }
  });

  console.log('Bases :', databases)

  store.state.allDatabases =  databases;


  const tmpval = [].map((o: any) => ({ dbType: 'mongodb', dbName: o.name, datas: '' }))
  store.commit('vvstore/initTable', tmpval)
  store.commit('vvstore/setDatabase', database)

  console.log('Database :', database)
  console.log('Store  = ', store)


  


  return store
})


