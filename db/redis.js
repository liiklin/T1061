const NRP = require('node-redis-pubsub')
const nrp = new NRP({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL,
  auth: process.env.REDIS_PASSWORD,
  scope: ''
})

module.exports = nrp