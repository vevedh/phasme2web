const { Service } = require('feathers-mongodb')

exports.TestMongo = class TestMongo extends Service {
  constructor (options, app) {
    super(options)

    app.get('mongoClient').then(db => {
      this.Model = db.collection('test-mongo')
    })
  }
}
