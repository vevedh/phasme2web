import { Service } from '@feathersjs/feathers';
import feathersClient, { makeServicePlugin, BaseModel } from '../../boot/feathers-client'

class Simtickets extends BaseModel {
  constructor(data: any, options: any) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Simtickets';

  // Define default properties here
  static instanceDefaults () {
    return {}
  }
}
const servicePath = 'simtickets'
const servicePlugin = makeServicePlugin({
  Model: Simtickets,
  service: feathersClient.service(servicePath) as Service<any>,
  servicePath,
  whitelist: ['$regex', '$options']
})



// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
})





export default servicePlugin
