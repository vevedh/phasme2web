module.exports = (app) => {
  return conf = (req, res, next) => {
    res.json(app.get('admGroups'))
  }
}
