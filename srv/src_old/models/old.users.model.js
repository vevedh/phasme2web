const NeDB = require('nedb');
const path = require('path');

module.exports = function (app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'users.db'),
    autoload: true,
    corruptAlertThreshold: 1
  });

  //Model.ensureIndex({ fieldName: 'uid', unique: true });

  return Model;
};
