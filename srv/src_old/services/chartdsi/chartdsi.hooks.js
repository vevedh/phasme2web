
const beforeCreate = async (context) => {
  context.data.adate = new Date().toLocaleDateString()
  context.data.atime = new Date().toLocaleTimeString()

  return context
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [beforeCreate],
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
}
