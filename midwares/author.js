const config = require('config')

function author(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  if (!config.get('requiresAuth')) return next()

  if (!req.user.isAuthor && !req.user.isAdmin) return res.status(403).send('Access denied.')

  next()
}

module.exports = author
