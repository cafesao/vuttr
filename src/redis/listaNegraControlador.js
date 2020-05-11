const blacklist = require('./listaNegra')

const { promisify } = require('util')
const existsAsync = promisify(blacklist.exists).bind(blacklist)
const setAsync = promisify(blacklist.set).bind(blacklist)

const jwt = require('jsonwebtoken')
const { createHash } = require('crypto')

function geraTokenHash(token) {
  return createHash('sha256').update(token).digest('hex')
}

module.exports = {
  add: async (token) => {
    const dataExpiracao = jwt.decode(token).exp
    const tokenHash = geraTokenHash(token)
    await setAsync(tokenHash, '')
    blacklist.expireat(tokenHash, dataExpiracao)
  },
  hasToken: async (token) => {
    const tokenHash = geraTokenHash(token)
    const resultado = await existsAsync(tokenHash)

    return resultado === 1
  },
}
