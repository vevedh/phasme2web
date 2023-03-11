// const app = require('../app');

module.exports = (app) => {
  return hello = (req, res, next) => {
    res.json({
      message: 'Bonjour hervé',
      database: app.get('currentDatabase'),
      infos: {
        system: app.system,
        chassis: app.chassis,
        osInfos: app.osInfos,
        versions: app.versions
      }
    })
  }
}
