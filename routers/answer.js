const joi = require('joi')
const logger = require('tracer').console()
const namespace = require('restify-namespace')
const answer = require('../db/answer')

module.exports = server => {
  namespace(server, '/api/:version/online/answers', () => {
    server.get('/:id', (req, res, next) => {
      answer.findById(req.params.id)
        .then(result => {
          res.json(result)

          return next()
        })
        .catch(err => {
          logger.error('GET /answers/:id', err)

          res.send(404, {
            "message": "not_found"
          })
        })
    })
  })
}