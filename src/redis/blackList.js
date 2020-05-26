const redis = require('redis')

console.log('[Redis] Starting Redis server...')
module.exports = redis.createClient({
  host: 'redis-server_db',
  port: 6379,
  prefix: 'blackList:',
})
