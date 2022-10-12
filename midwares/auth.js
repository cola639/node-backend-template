const jwt = require('jsonwebtoken')
const config = require('config')

function auth(req, res, next) {
  if (!config.get('requiresAuth')) return next()

  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('账号未登录,请先登录')

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
    req.user = decoded
    next()
  } catch (ex) {
    res.status(400).send('Invalid token.')
  }
}

module.exports = auth
