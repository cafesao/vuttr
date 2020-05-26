const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy

const { ErrorArgumentInvalid } = require('../error/error')
const blackList = require('../redis/blackListController')

const dbAccount = require('../db/dbAccount')

function checkUser(username) {
  if (username.rows.length === 0) {
    throw new ErrorArgumentInvalid('Invalid username or password!')
  }
}

async function checkPassword(password, passwordHash) {
  const passwordValid = await bcrypt.compare(password, passwordHash)
  if (!passwordValid) {
    throw new ErrorArgumentInvalid('Invalid username or password!')
  }
}

async function checkTokenBlacklist(token) {
  const tokenListBlack = await blackList.hasToken(token)
  if (tokenListBlack) {
    throw new jwt.JsonWebTokenError('Token invalid by logout!')
  }
}

async function checkAccount(username) {
  const searchUser = await dbAccount.searchAccount(username)
  if (searchUser.rows.length === 0) {
    throw new Error('There is no account linked to that token')
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
        const userSearch = await dbAccount.searchAccount(username)
        checkUser(userSearch)
        await checkPassword(password, userSearch.rows[0].password)
        done(null, userSearch)
      } catch (error) {
        done(error)
      }
    },
  ),
)

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      await checkTokenBlacklist(token)
      const { username } = jwt.verify(token, process.env.CHAVE_JWT)
      checkAccount(username)
      done(null, username, token)
    } catch (error) {
      done(error)
    }
  }),
)
