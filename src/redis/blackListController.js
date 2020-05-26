const blacklist = require('./blackList')

const { promisify } = require('util')
const existsAsync = promisify(blacklist.exists).bind(blacklist)
const setAsync = promisify(blacklist.set).bind(blacklist)

const jwt = require('jsonwebtoken')
const { createHash } = require('crypto')

function generateTokenHash(token) {
  return createHash('sha256').update(token).digest('hex')
}

module.exports = {
  add: async (token) => {
    const dataExpiration = jwt.decode(token).exp
    const tokenHash = generateTokenHash(token)
    await setAsync(tokenHash, '')
    blacklist.expireat(tokenHash, dataExpiration)
  },
  hasToken: async (token) => {
    const tokenHash = generateTokenHash(token)
    const result = await existsAsync(tokenHash)

    return result === 1
  },
}
