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

  checkLdap(data) {

    const clientLdap = require('ldapjs').createClient({
      url: this.configuration.url,
      reconnect: true,
      idleTimeout: 2592000,
      tlsOptions: { rejectUnauthorized: false }
    });

    // const arrBuf = this;

    return new Promise((resolve, reject) => {
      console.log('Appel ldap :',data);

      logger.info('Username : %s', data);
      if (clientLdap.connected) {
        //console.log("Search base:",this.configuration.searchBase);
        // console.log("Filtre :",this.configuration.searchFilter.replace(/{{username}}/g,data.username));
        clientLdap.search(
          this.configuration.searchBase,
          {
            filter: this.configuration.searchFilter.replace(
              /{{username}}/g,
              data.split('@')[0]
            ),
            scope: 'sub'
          },
          (err, res) => {
            if (err) {

              reject('Connexion impossible !');
            }
            if (res) {
              console.log('Recherche :',res);
              const entries = [];
              let thumbNail;
              res.on('searchEntry', entry => {
                // console.log("Entree :",entry.attributes);
                entry.attributes.forEach(attr => {
                  if (attr.type == 'thumbnailPhoto') {
                    //console.log('thumbnailPhoto :', attr._vals)
                    //console.log('Is Buffer :', Buffer.isBuffer(attr._vals[0]))

                    //console.log('Data buffer :', attr._vals[0].toString('base64'))

                    thumbNail = attr._vals[0].toString('base64');
                  }
                });
                var r = entry.object;
                if (!r.mail) {
                  r.mail = r.userPrincipalName;
                }
                r.img64 = thumbNail;
                entries.push(r);

                // console.log("Recherche :",entries);
              });
              res.on('error', err => {
                reject(err);
              });
              res.on('end', result => {
                clientLdap.destroy();
                if (entries.length == 1) {
                  //console.log("AuthResult :",entries[0])
                  resolve(entries[0]);
                } else {
                  reject(false);
                }
              });
            }
          }
        );
      }
    });

    // var client = new Promise((resolve,reject) => {
  }

  verifyConfiguration() {
    const config = this.configuration; //'bindDN', 'bindCredentials'

  }

  async authenticate(data, params) {
    console.lo('Auth : %s', params.headers['x-forwarded-user']);

    //const { accessToken } = params.authentication;

    return new Promise((resolve, reject) => {


      console.lo('Auth : %s', params.headers['x-forwarded-user']);

      // const auth = new LdapAuth(this.configuration);
      const name = this.name;

      var userId;//= params.headers['x-forwarded-user'];

      // console.log('Config :',this.configuration);

      // new Promise((resolve, reject) => {
      this.checkLdap(params.headers['x-forwarded-user'])
        .then(async user => {
          console.log('Connection etablie');
          if (user) {
            //verifie qu'il exite un utilisateur local avec le meme mail que l'utilisateur ldap

            //console.log('Config entity :', this.app);
            this.configuration.entity = user;
            //console.log('auh ok :', user);
            this.app.set('auth_strategy', name);

            resolve({
              authentication: { strategy: name },
              user
            });
          }
        })
        .catch(err => {
          logger.info('Echec de connexion :', err);
          reject(err);
        });
      //});
    });
  }

  /*async authenticate(data, params) {
    const name = this.name;
    const config = this.configuration;
    const app = this.app; //'bindDN', 'bindCredentials'
    //console.log('SSO Config :',config);
    console.log('Auth SSo :', data);
    console.log('Auth SSo  params:', params);



    //(async () => {
    try {


      var userId = params.headers['x-forwarded-user'];
      console.log('Auth userid :', userId);

      var user = await app.service('adUsers').find({ query: { uid:userId }});
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
  }*/
}
exports.SsoStrategy = SsoStrategy;
