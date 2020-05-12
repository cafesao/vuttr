const redis = require('redis')

console.log('[Redis] Iniciando server Redis...')
module.exports = redis.createClient({
  host: 'redis-server_db',
  port: 6379,
  prefix: 'listaNegra:',
})
