require('dotenv').config()

const server = require('../app')
const port = process.env.PORT || 8001

server.listen(port, () => console.log('%s listening at %s', server.name, server.url))