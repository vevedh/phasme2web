const { authenticate } = require('@feathersjs/authentication').hooks;
const logger = require('../../logger');
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ hashPassword('password') ],
    update: [ hashPassword('password'), authenticate('jwt') ],
    patch: [hashPassword('password'), authenticate('jwt') ],
    remove: [authenticate('jwt') ]
  },

  after: {
    all: [protect('password') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
