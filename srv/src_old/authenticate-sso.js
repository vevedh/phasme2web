const {
  AuthenticationBaseStrategy,
  ConnectionEvent
} = require('@feathersjs/authentication');
const logger = require('./logger');
const jetpack = require('fs-jetpack');
const https = require('https');
const axios = require('axios');
const fs = require('fs');
const request = require('request');


class SsoStrategy extends AuthenticationBaseStrategy {
  async getUserData(ssodata) {
    let obj = new Object();
    for (const key in ssodata) {
      if (Object.hasOwnProperty.call(ssodata, key)) {
        const element = ssodata[key];
        if (key != 'memberOf') {
          obj[key] = element[0];
        } else {
          obj[key] = element;
        }
      }
    }
    return obj;
  }

  verifyConfiguration() {
    const config = this.configuration; //'bindDN', 'bindCredentials'
    //console.log('SSO Config :',config);
  }

  async authenticate(data, params) {
    const name = this.name;
    const config = this.configuration;
    const app = this.app; //'bindDN', 'bindCredentials'
    //console.log('SSO Config :',config);
    console.log('Auth SSo non :', data);
    console.log('Auth SSo non  params:', params);

    const { sso } = require('node-expose-sspi');

    //(async () => {
    try {
      const client = new sso.Client();
      const response = await client.fetch(`http://${data.sso}/auth/sso`);
      const json = await response.json();
      console.log('json: ', json);

      var userId = json.sso.user.name;
      console.log('Auth userid :', userId);
      console.log('Auth adUser :', json.sso.user.adUser);
      var user = await this.getUserData(json.sso.user.adUser);
      console.log('Auth adUser user :', user);
      if (user) {
        if (!user.mail || user.mail == '') {
          user.mail = user.sAMAccountName;
        }
        //verifie qu'il exite un utilisateur local avec le meme mail que l'utilisateur ldap
        const waituser = await this.app.service('users').find({
          query: {
            email: user.mail
          }
        });
        //console.log('wait user :', waituser)
        // si il n'y a pas de correspondance locale
        if (waituser.total == 0) {
          const createLocal = await this.app.service('users').create({
            email: user.mail,
            role: 'invite',
            user: user
          });
          //console.log('Création locale : ', createLocal)
          userId = createLocal._id;
        } else {
          //console.log('Correspondance  locale : ', waituser)
          userId = waituser.data[0]._id;
        }

        user._id = userId;
        //console.log("Auth sso user :",user)
      }

      return {
        authentication: {
          strategy: name
        },
        user
      };
    } catch (e) {
      return {
        authentication: {
          strategy: name
        }
      };
    }
  }
}
exports.SsoStrategy = SsoStrategy;
