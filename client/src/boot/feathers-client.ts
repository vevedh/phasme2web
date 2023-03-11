import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';

import io from 'socket.io-client';

import { iff, discard } from 'feathers-hooks-common';

import feathersVuex from 'feathers-vuex';

import axios from 'axios';

import Vue from 'vue';

//const restClient = rest("http://localhost:3030");
let apiUrl;
//const apiUrl = "https://svrdevweb.agglo.local:3050";//"https://www.hdcapp.pro";//import.meta.env.VITE_APP1_API_URL as string

const feathersClient = feathers();

if (typeof window !== 'undefined') {
  console.log('Web origin :', window.location.origin);
  console.log('DEV env :', process.env.NODE_ENV);

  /*apiUrl =
    window.location.origin.split(':')[2] == '8080'
      ? 'https://webapps.agglo.local'
      : window.location.origin; //"https://svrdevweb.agglo.local:3030";////"http://localhost:3030"; https://svrdevweb.agglo.local
  console.log('DEV env :', apiUrl);*/

  const socket = io(process.env.API as string, {
    transports: ['websocket'],
    rejectUnauthorized: false,
  });

  feathersClient
    .configure(
      socketio(socket, {
        timeout: 220000,
      })
    )
    //.configure(restClient.axios(axiosInstance))
    .configure(auth({ storage: window.localStorage }))
    .hooks({
      before: {
        all: [
          // Don't send FeathersVuex temp attributes to the server.
          iff(
            (context) => ['create', 'update', 'patch'].includes(context.method),
            discard('__id', '__isTemp')
          ),
        ],
      },
    });
} else {
  //apiUrl = 'https://webapps.agglo.local';*/
  const socket = io(process.env.API as string, {
    transports: ['websocket'],
  });

  feathersClient.configure(socketio(socket));

  feathersClient.configure(
    auth({
      header: 'Authorization', // the default authorization header for REST
      path: '/api/authentication', // the server-side authentication service path
      jwtStrategy: 'jwt', // the name of the JWT authentication strategy
      //entity: 'user', // the entity you are authenticating (ie. a users)
      //service: 'users', // the service to look up the entity
      //cookie: 'feathers-jwt', // the name of the cookie to parse the JWT from when cookies are enabled server side
      storageKey: 'feathers-jwt', // the key to store the accessToken in localstorage or AsyncStorage on React Native
    })
  );
}

Vue.prototype.$feathersClient = feathersClient;

export default feathersClient;

// Setting up feathers-vuex
const { makeServicePlugin, makeAuthPlugin, BaseModel, models, FeathersVuex } =
  feathersVuex(feathersClient, {
    serverAlias: 'api', // optional for working with multiple APIs (this is the default value)
    idField: '_id', // Must match the id field in your database table/collection
    whitelist: ['$regex', '$options'],
  });

export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex };
