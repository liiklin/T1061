const joi = require('joi')
const logger = require('tracer').console()
const namespace = require('restify-namespace')
const question = require('../db/question')

module.exports = server => {
  namespace(server, '/api/:version/online/questions', () => {
    server.get('/:id', (req, res, next) => {
      question.findById(req.params.id)
        .then(result => {
          res.json(result)

          return next()
        })
        .catch(err => {
          logger.error('GET /questions/:id', err)

          res.send(404, {
            "message": "not_found"
          })
        })
    })

    server.post({
      path: '/:id',
      validations: {
        query: {
          action: joi.string().required()
        },
        body: {
          data: joi.string().required(),
          replier_uuid: joi.string().required()
        }
      }
    }, (req, res, next) => {
      const body = Object.assign(req.query, req.body)

      question.update(req.params.id, body)
        .then(result => {
          res.json(result)

          return next()
        })
        .catch(err => {
          logger.error('POST /questions/:id', err)

          switch (err.code) {
            case 500:
              res.send(500, {
                "message": "update_disallow"
              })
              break
            case 404:
              res.send(404, {
                "message": "not_found"
              })
              break
            default:
              res.send(500, {
                "message": "update_disallow"
              })
          }
        })
    })

    server.put({
      path: '/:id',
      validations: {
        body: {
          data: joi.string(),
          group: joi.string(),
          question: joi.string(),
          descr: joi.string(),
          state: joi.string(),
          user_uuid: joi.string()
        }
      }
    }, (req, res, next) => {
      question.updateItems(req.params.id, req.body)
        .then(result => {
          res.json(result)

          return next()
        })
        .catch(err => {
          logger.error('PUT /questions/:id', err)

          switch (err.code) {
            case 500:
              res.send(500, {
                "message": "update_disallow"
              })
              break
            case 404:
              res.send(404, {
                "message": "not_found"
              })
              break
            default:
              res.send(500, {
                "message": "update_disallow"
              })
          }
        })
    })

    server.del('/:id', (req, res, next) => {
      question.deleteById(req.params.id)
        .then(() => {
          res.json({
            "message": "action_succeed"
          })

          return next()
        })
        .catch(err => {
          logger.error('DELETE /questions/:id', err)
          
          switch (err.code) {
            case 500:
              res.send(500, {
                "message": "delete_disallow"
              })
              break
            case 404:
              res.send(404, {
                "message": "not_found"
              })
              break
            default:
              res.send(500, {
                "message": "delete_disallow"
              })
          }
        })
    })
  })
}