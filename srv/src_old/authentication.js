const {
  AuthenticationService,
  AuthenticationBaseStrategy,
  JWTStrategy
} = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');
const { LDAPStrategy } = require('./authenticate-ldap');

const { SsoStrategy } = require('./authenticate-ldap-ntlm');
const axios = require('axios');

class MySSoService extends AuthenticationService {

  

 
  async getPayload(authResult, params) {
    // Call original `getPayload` first
    const payload = await super.getPayload(authResult, params);

    const { user } = authResult;

    

   console.log('Storage :', authResult);
   console.log('Auth  payload :', payload);
   console.log('Auth  payload :', this.app.get('authentication'));
   console.log('Auth  options :', this.getTokenOptions);
    //console.log('SSO params:',params.headers);

    if (user) {
      console.log('Auth test user :', user);
      params.user = user;
      payload.user = user;
    } else {
      console.log('Auth credential vide , payload :', payload);
    }

    return payload;
  }
}

class MyJwtStrategy extends JWTStrategy {

}

class Sso2Strategy extends AuthenticationBaseStrategy {

  constructor(host) {
    console.log('host', host);
    super(host);
    this.host = host;
  }

  async authenticate(authentication, params) {
    console.log(this.host, authentication);
    let result = await axios.post(this.host + '/auth/sso', {
      accessToken: authentication.jwt,
      strategy: 'jwt'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    delete result.data.authentication;
    //console.log('Result sso :',result.data);
    return result.data;
  }
}

module.exports = app => {
  const authentication = new MySSoService(app);//AuthenticationService(app); //;  //MyAuthService(app)


  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('ldap', new LDAPStrategy());
  authentication.register('sso2', new SsoStrategy());

  //app.use(auth_sso(app));

  app.use('/authentication',  authentication);

  

  app.configure(expressOauth());
};
