const { Service } = require('feathers-mongodb')

exports.Chartdsi = class Chartdsi extends Service {
  constructor (options, app) {
    super(options)

    app.get('mongoClient').then(db => {
      this.Model = db.collection('chartdsi')
    })
  }
}
