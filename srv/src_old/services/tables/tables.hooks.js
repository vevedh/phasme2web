const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;

const ObjectID = require('mongodb').ObjectID;

const checkQuery = async (context) => {


  const { app, method, result, params } = context;

  if (Object(params.query.query).hasOwnProperty('_id')) {
    if ( !ObjectID.isValid(params.query.query._id)) {
      console.log('Query table result :', params.query.query._id);

      params.query.query._id = new ObjectID(params.query.query._id);
    }

  }




  return context;
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [] //authenticate('jwt')
  },

  after: {
    all: [],
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
