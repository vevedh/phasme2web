const app = require('../../src/app');

describe('\'simtickets\' service', () => {
  it('registered the service', () => {
    const service = app.service('simtickets');
    expect(service).toBeTruthy();
  });
});
