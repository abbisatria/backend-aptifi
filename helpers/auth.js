const jwt = require('jsonwebtoken')
const response = require('./response')

module.exports = {
  authCheck: (req, res, next) => {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.substr(7)
      const data = jwt.verify(token, '4pt1f1')
      if (data) {
        req.userData = data
        return next()
      }
    }
    return response(res, 401, false, 'Authorization needed')
  }
}
