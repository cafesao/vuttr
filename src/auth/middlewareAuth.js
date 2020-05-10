const passport = require('passport')

module.exports = {
  local: (req, res, next) => {
    passport.authenticate('local', { session: false }, (erro, user, info) => {
      if (erro && erro.name === 'InvalidArgumentError') {
        res.status(406).json({ erro: erro.message })
      } else if (erro) {
        res.status(500).json({ erro: erro.message })
      } else {
        req.user = user
        return next()
      }
    })(req, res, next)
  },
  bearer: (req, res, next) => {
    passport.authenticate('bearer', { session: false }, (erro, user, info) => {
      if (erro && erro.name === 'JsonWebTokenError') {
        return res.status(401).json({ erro: erro.message })
      }
      if (erro && erro.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ erro: erro.message, expiradoEm: erro.expiredAt })
      }
      if (erro) {
        return res.status(500).json({ erro: erro.message })
      }
      if (!user) {
        return res.status(400).json({ erro: 'Não foi informado o token' })
      }
      req.info = info
      return next()
    })(req, res, next)
  },
}
