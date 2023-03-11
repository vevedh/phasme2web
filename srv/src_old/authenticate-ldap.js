const {
  AuthenticationBaseStrategy,
  ConnectionEvent
} = require('@feathersjs/authentication');
const logger = require('./logger');
const jetpack = require('fs-jetpack');
const decodeSearchEntry = require('./decodeSearchEntry');
const { uuid } = require('systeminformation');



class LDAPStrategy extends AuthenticationBaseStrategy {

  ldapSearch(filter)  {

    const configuration = this.app.get('authentication').ldap;
    const client = this.app.get('ldapClient');

    if (client.connected) {
      try {
        client.undind();
      } catch (error) {
        console.log('End search');
      }

    }

    if (!client.connected) {
      client.bind(configuration.bindDN, configuration.bindCredentials, (err, res) => {
        if (err) {
          console.log('Echec auth-sso de connexion ldap !');
        }
        if (res) {
          console.log('Connexion auth-sso ldap etablie avec succès!');
        }
      });
    }

    var opts = {
    //  filter: '(objectClass=*)',  //simple search
    //  filter: '(&(uid=2)(sn=John))',// and search
      filter: filter, // '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      sizeLimit: 3000,
      paged: true,
    //attributes: adMap.filter(elt => attribs.includes(elt.ad)).map(obj => (obj.ld))
    };

    return new Promise((resolve, reject) => {
      if (!Date.fromLDAPString) {
        Date.fromLDAPString = function (s) {
          var b = s.match(/\d\d/g);
          return new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]));
        };
      }

      var values = [];
      client.search(configuration.searchBase, opts, (err, resp) => {
        if (err) {
          console.log('Error in search ' + err);
        } else {
          resp.on('searchEntry', (entry) => {
          //console.log('entry: ' + JSON.stringify(entry.object));
            values.push(entry);
          });
          resp.on('searchReference', (referral) => {
            //console.log('referral: ' + referral.uris.join());
          });
          resp.on('error', (err) => {
            //console.error('error: ' + err.message);
            // reject(err);
          });
          resp.on('end', () => {
            client.unbind();
            // console.log('status: ' + result.status);

            // res.json(values);
            let value;
            if (values && values.length > 0) {
              value = decodeSearchEntry(values[0]);
            } else {
              value = {};
            }
            //console.log('Ldap search result :',value);
            resolve(value);
          });
        }
      });

    });
  }

  checkLdap(data) {
    const configuration = this.app.get('authentication').ldap;



    // const arrBuf = this;

    return new Promise((resolve, reject) => {
      const clientLdap = this.app.get('ldapClient');

      if (clientLdap.connected) {
        try {
          clientLdap.undind();
        } catch (error) {
          console.log('End search');
        }

      }
      //console.log("Appel ldap :",this.configuration.searchBase.split(',')[0].split("=")[1]+"\\"+data.username, data.password);
      logger.info(
        'Domaine : %s',
        this.configuration.searchBase.split(',')[0].split('=')[1]
      );
      //console.log('Username and Password : ', data);
      //logger.info('Username and Password : %j', data);


      clientLdap.bind(
        this.configuration.searchBase.split(',')[0].split('=')[1] +
          '\\' +
          data.username,
        data.password,
        (err, res) => {
          if (err) {
            logger.info('Bind auth echec : %s', err);
            reject(err);
          }
          if (res) {
            this.ldapSearch(('(|(uid={{username}})(sAMAccountName={{username}}))').replace(/{{username}}/g,data.username)).then((user)=>{
              resolve(user);
            }).catch(()=>{
              reject(false);
            });
          }

        }
      );
    });

    // var client = new Promise((resolve,reject) => {
  }

  async getPayload(authResult, params) {
    // Call original `getPayload` first
    const payload = await super.getPayload(authResult, params);
    const { user } = authResult;

    console.log('Payload Ldap :',payload);
    console.log('LDAP payload user :',user);
    /*if (user && user.permissions) {
      payload.permissions = user.permissions;
    }*/

    return payload;
  }

  verifyConfiguration() {
    const config = this.configuration; //'bindDN', 'bindCredentials'
    ['url', 'searchBase', 'searchFilter'].forEach(prop => {
      if (typeof config[prop] !== 'string') {
        throw new Error(
          `'${this.name}' authentication strategy requires a '${prop}' setting`
        );
      }
    });
  }

  async authenticate(data, params) {
    //const { accessToken,payload,strategy } = params.authentication;

    //logger.info('Auth accessToken :', accessToken);
    //logger.info('Auth payload :', payload);
    logger.info('Auth params :', params);

    return new Promise((resolve, reject) => {
      const username = data.username;
      const password = data.password;

      logger.info('Auth :', username, password);

      // const auth = new LdapAuth(this.configuration);
      const name = this.name;
      //const app = this.app
      //const source = params.headers;
      console.log('Params infos :', params);
      //const source = params.headers.host
      var userId;

      // console.log('Config :',this.configuration);

      // new Promise((resolve, reject) => {
      this.checkLdap(data)
        .then(async user => {
          console.log('Connection etablie');
          console.log('auh ok LDAP:', user);
          /*if (user) {
            user._id = uuid();
            userId = user._id;
            this.configuration.entity = user;
            resolve({
              authentication: { strategy: name },
              user
            });
          } else {
            resolve(null);
          }*/
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
              params.user = createLocal;
            } else {
              //console.log('Correspondance  locale : ', waituser);
              userId = waituser[0]._id;
              params.user = waituser[0];
            }

            user._id = userId;

            this.configuration.entity = saveuser;
            params.user = this.configuration.entity;

            console.log('Get entity :',this.configuration.entity);
            console.log('Get storage :',params);

            this.app.set('auth_strategy', name);
            let result = JSON.parse(JSON.stringify(saveuser));

            this.app.service('authentication').create({
              strategy: name ,
              user:result
            })
            console.log('result storage: ', this.app.get('feathers-jwt'));
            //authentication: { strategy: name },
            resolve({ 
              authentication: { strategy: name },
              user:result
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
}
exports.LDAPStrategy = LDAPStrategy;
