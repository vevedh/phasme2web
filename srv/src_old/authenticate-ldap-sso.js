const {
  AuthenticationBaseStrategy,
  ConnectionEvent
} = require('@feathersjs/authentication');
const logger = require('./logger');
const jetpack = require('fs-jetpack');

class LDAPSsoStrategy extends AuthenticationBaseStrategy {
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

  verifyConfiguration() {
    const config = this.configuration; //'bindDN', 'bindCredentials'
    //console.log('SSO Config :',config);
  }

  async authenticate(data, params) {
    const name = this.name;
    const config = this.configuration; //'bindDN', 'bindCredentials'
    return new Promise(async (resolve, reject) => {
      console.log('Auth SSo classic :', data, params);
      if (Object(data.sso).hasOwnProperty('sso')) {
        var userId = data.sso.sso.name;
        //console.log("Auth userid :",userId)
        //console.log("Auth adUser :",data.sso.sso.adUser)
        var user = Object.assign({},data.sso.sso);// await this.getUserData(data.sso.sso);
        console.log('Auth adUser user :',user);
        if (user) {
          let saveuser = user;
          //verifie qu'il exite un utilisateur local avec le meme mail que l'utilisateur ldap
          const waituser = await this.app.service('users').find({
            query: {
              sAMAccountName: user.sAMAccountName
            }
          });
          console.log('wait user :', waituser);

          // si il n'y a pas de correspondance locale
          if (waituser.length == 0) {
            if (!user.mail || user.mail == '') {
              user.mail = user.userPrincipalName;
            }
            const createLocal = await this.app.service('users').create(user);
            //console.log('Création locale : ', createLocal)
            userId = createLocal._id;
          } else {
            console.log('Correspondance  locale : ', waituser);
            userId = waituser[0]._id;
          }

          user._id = userId;

          this.configuration.entity = saveuser;



          this.app.set('auth_strategy', name);
          let result = JSON.parse(JSON.stringify(user));
          console.log('result: ', result);
          resolve({
            authentication: { strategy: name },
            user:result
          });
        } else {
          reject(null);
        }

      } else {
        resolve({
          authentication: {
            strategy: name
          }
        });
      }
    });
  }
}
exports.LDAPSsoStrategy = LDAPSsoStrategy;
