const app = require('../../src/app');

describe('\'ldapSearch\' service', () => {
  it('registered the service', () => {
    const service = app.service('ldap-search');
    expect(service).toBeTruthy();
  });
});
