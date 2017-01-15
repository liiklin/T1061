require('dotenv').config()

const restify = require('restify')
const validator = require('restify-joi-validator')
const server = restify.createServer()

server.use(restify.bodyParser())
server.use(restify.queryParser())
server.use(validator())

require('./routers/group')(server)
require('./routers/answer')(server)
require('./routers/question')(server)
require('./routers/asyncData')(server)

module.exports = server
