const {
  AuthenticationBaseStrategy,
  ConnectionEvent
} = require('@feathersjs/authentication');
const logger = require('./logger');
const jetpack = require('fs-jetpack');
const https = require('https');
const http = require('http');
const axios = require('axios').default;
const fs = require('fs');

const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

class SsoStrategy extends AuthenticationBaseStrategy {
  async getUserData(ssodata) {
    let obj = new Object();
    for (const key in ssodata) {
      if (Object.hasOwnProperty.call(ssodata, key)) {
        const element = ssodata[key];
        if (key != 'MemberOf') {
          obj[key] = element[0];
        } else {
          obj[key] = element;
        }
      }
    }
    return obj;
  }

  async getData() {


    return new Promise((resolve,reject) => {
      var data = '';

      let headers = {};
      headers['Accept'] = 'application/json;';

      var config = {
        method: 'get',
        url: 'http://localhost:3031',
        headers: headers,
        data: data,
      };

      axios(config)
        .then( (response) => {
          console.log(JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch( (error) => {
          console.log(error);
          reject({
            error: error,
          });
        });
    });

  }

  async postData() {


    return new Promise((resolve,reject) => {
      var data = JSON.stringify({
        authentication: {
          strategy: 'sso2'
        }
      });

      let headers = {};
      headers['Content-Type'] = 'application/json; charset=utf-8';

      var config = {
        method: 'post',
        url: 'http://localhost:3030/authentication',
        headers: headers,
        data: data,
      };

      axios(config)
        .then( (response) => {
          console.log(JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch( (error) => {
          console.log(error);
          reject({
            error: error,
          });
        });
    });

  }

  async getFetchData() {


    return new Promise((resolve,reject) => {

      fetch('http://localhost:3031')
        .then( (response) => {
          console.log(JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch( (error) => {
          console.log(error);
          reject({
            error: error,
          });
        });
    });

  }

  verifyConfiguration() {
    const config = this.configuration; //'bindDN', 'bindCredentials'
    console.log('SSO Config :',config);
  }

  async authenticate(data, params) {
    const name = this.name;
    const { sso } = data;


    console.log('Auth SSo2 :', sso);
    console.log('Auth SSo2  params:', params);

    const json =  Object.assign({},sso);



    //(async () => {
    try {


      console.log('Fetch json: ', json);

      var userId = json.sso.user.name;
      console.log('Auth userid :', userId);
      console.log('Auth adUser :', json.sso.user);
      var user = Object.assign({},json.sso.user);//await this.getUserData(json.sso.user);
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


  parse(req,res) {
    if (req.feathers) {
      console.log('Feathers :',req.feathers);
    }
    if (req.sso) {
      req.feathers.sso = req.sso;
      console.log('SSo memorise :', req.sso);
      return {
        strategy: this.name,
        sso: req.sso
      };
    }
    return null;
  }
}
exports.SsoStrategy = SsoStrategy;
