const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy
const jwt = require('jsonwebtoken')

const { InvalidArgumentError } = require('../error/error')
const blacklist = require('../redis/blacklistController')

const dbFunctionsAccounts = require('../db/dbFunctionsAccounts')

function verificaUsername(username) {
  if (username.rows.length === 0) {
    throw new InvalidArgumentError('Usuario ou senha inválida!')
  }
}

async function verificaPassword(password, passwordHash) {
  const passwordValid = await bcrypt.compare(password, passwordHash)
  if (!passwordValid) {
    throw new InvalidArgumentError('Usuario ou senha inválida!')
  }
}

async function verificaTokenBlacklist(token) {
  const tokenBlacklist = await blacklist.hasToken(token)
  if (tokenBlacklist) {
    throw new jwt.JsonWebTokenError('Token inválido por logout!')
  }
}

async function verificaConta(username) {
  const user = await dbFunctionsAccounts.querySelect(username)
  if (user.rows.length === 0) {
    throw new Error('Não existe uma conta vinculada a esse token')
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    async (username, password, done) => {
      try {
        const user = await dbFunctionsAccounts.querySelect(username)
        verificaUsername(user)
        await verificaPassword(password, user.rows[0].password)
        done(null, user)
      } catch (error) {
        done(error)
      }
    },
  ),
)

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      await verificaTokenBlacklist(token)
      const { username } = jwt.verify(token, process.env.CHAVE_JWT)
      verificaConta(username)
      done(null, username, token)
    } catch (error) {
      done(error)
    }
  }),
)
