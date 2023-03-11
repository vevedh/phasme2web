// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'
import { LDAPStrategy } from './authenticate-ldap.js';
import { SsoStrategy } from './authenticate-ldap-ntlm.js';

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

export const authentication = (app) => {
  const authentication = new MySSoService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('auth0', new OAuthStrategy())
  authentication.register('ldap', new LDAPStrategy());
  authentication.register('sso2', new SsoStrategy());

  app.use('authentication', authentication)
  app.configure(oauth())
}
