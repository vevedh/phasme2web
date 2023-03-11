const { authenticate } = require('@feathersjs/authentication').hooks
const logger = require('../../logger')
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks

// We need this to create the MD5 hash
const crypto = require('crypto')

// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar'
// The size query. Our chat needs 60px images
const query = 's=60'
// Returns the Gravatar image for an email
const getGravatar = email => {
  // Gravatar uses MD5 hashes from an email address (all lowercase) to get the image
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex')
  // Return the full avatar URL
  return `${gravatarUrl}/${hash}?${query}`
}

// transformer les données utilisateur Ad avant mémorisation
// valable pour d'autres transformations
const arrayBufferToBase64 = (buffer) => {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const populateUser = async (context) => {
  const { app, method, result, params } = context

  logger.info('method : %s', context.method)
  logger.info('data : %j', context.data)

  context.data.gravatar = (context.data.email) ? getGravatar(context.data.email) : ''

  // if (context)

  if (!context.data.role) {
    context.data.role = 'invite'
  }

  return context
}

const modUsersDatas = async (context) => {
  context.data.picBase64 = (context.data.ThumbnailPhoto != null) ? 'data:image/jpeg;base64,' + arrayBufferToBase64(context.data.ThumbnailPhoto).toString() : ''

  if (context.data.picBase64 == '') {
    // definir un avatar
    context.data.picBase64 = (context.data.mail) ? getGravatar(context.data.mail) : ''
  }

  return context
}

const addUsersState = async (context) => {
  context.data.state = 'offline'
  return context
}

const checkDB = async (context) => {
  const { app, method, result, params } = context

  await checkMongoDB(app)

  return context
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [populateUser, hashPassword('password')],
    update: [populateUser, hashPassword('password'), authenticate('jwt')],
    patch: [hashPassword('password'), authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
