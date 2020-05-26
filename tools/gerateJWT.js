const crypto = require('crypto')

const key = crypto.createHash('sha512').update(`${Math.random()}`).digest('hex')

console.log(key)
