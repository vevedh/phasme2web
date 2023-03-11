const NeDB = require('nedb')
const path = require('path')

module.exports = function (app) {
  const dbPath = app.get('nedb')
  const Model = new NeDB({
    filename: path.join(dbPath, 'users-infos.db'),
    autoload: true,
    corruptAlertThreshold: 1
  })

  // Model.ensureIndex({ fieldName: 'user', unique: true })

  return Model
}
