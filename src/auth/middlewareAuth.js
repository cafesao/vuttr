const passport = require('passport')

module.exports = {
  local: (req, res, next) => {
    passport.authenticate(
      'local',
      { session: false },
      (error, username, info) => {
        if (error && error.name === 'ErrorArgumentInvalid') {
          res.status(406).json({ error: error.message })
        } else if (error) {
          res.status(500).json({ error: error.message })
        } else {
          req.username = username
          return next()
        }
      },
    )(req, res, next)
  },
  bearer: (req, res, next) => {
    passport.authenticate(
      'bearer',
      { session: false },
      (error, username, info) => {
        if (error && error.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: error.message })
        }
        if (error && error.name === 'TokenExpiredError') {
          return res
            .status(401)
            .json({ error: error.message, expiradoEm: error.expiredAt })
        }
        if (error) {
          return res.status(500).json({ error: error.message })
        }
        if (!username) {
          return res.status(400).json({ error: 'Token was not entered' })
        }
        req.info = info
        return next()
      },
    )(req, res, next)
  },
}
