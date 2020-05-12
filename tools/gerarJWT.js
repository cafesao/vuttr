const crypto = require('crypto')

const chave = crypto
  .createHash('sha512')
  .update(`${Math.random()}`)
  .digest('hex')

console.log(chave)
