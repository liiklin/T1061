const joi = require('joi')
const fetch = require('node-fetch')
const series = require('async/series')
const logger = require('tracer').console()
const namespace = require('restify-namespace')
const group = require('../db/group')
const answer = require('../db/answer')
const question = require('../db/question')

module.exports = server => {
  namespace(server, '/api/:version/online/groups', () => {
    server.get('/', (req, res, next) => {
      group.find()
        .then(results => {
          res.json(results)

          return next()
        })
        .catch(err => {
          logger.error('GET /group', err)

          res.send(500, {
            message: 'server error'
          })
        })
    })

    server.post({
      path: '/',
      validations: {
        body: {
          name: joi.string().required(),
          url: joi.string().required()
        }
      }
    }, (req, res, next) => {
      group.create(req.body)
        .then(result => {
          res.json(result)

          return next()
        })
        .catch(err => {
          logger.error('POST /group', err)

          res.send(500, {
            message: 'name_duplicated'
          })
        })
    })

    server.get('/:id', (req, res, next) => {
      group.findOneById(req.params.id)
        .then(result => {
          res.json(result)

          return next()
        })
        .catch(err => {
          logger.error('GET /group/:id', err)

          res.send(404, {
            "message": "not_found"
          })
        })
    })

    server.put({
      path: '/:id',
      validations: {
        body: {
          name: joi.string(),
          url: joi.string()
        }
      }
    }, (req, res, next) => {
      group.update(req.params.id, req.body)
        .then(result => {
          res.json(result)

          return next()
        })
        .catch(err => {
          logger.error('PUT /group/:id', err)

          switch (err.code) {
            case 404:
              res.send(404, {
                "message": "not_found"
              })
              break;
            case 500:
              res.send(500, {
                "message": "update_failed"
              })
              break;
            default:
              res.send(500, {
                "message": "update_failed"
              })
          }
        })
    })

    server.del('/:id', (req, res, next) => {
      group.deleteById(req.params.id)
        .then(() => {
          res.json({
            "message": "action_succeed"
          })

          return next()
        })
        .catch(err => {
          logger.error('DELETE /group/:id', err)

          switch (err.code) {
            case 404:
              res.send(404, {
                "message": "not_found"
              })
              break;
            case 500:
              res.send(500, {
                "message": "delete_disallow"
              })
              break;
            default:
              res.send(500, {
                "message": "delete_disallow"
              })
          }
        })
    })

    server.get('/:id/answers', (req, res, next) => {
      answer.findByGroupId(req.params.id)
        .then(results => {
          const arr = []

          results.forEach(item => {
            arr.push({
              id: item.id,
              group_id: item.group_id,
              question: item.question,
              answer: item.answer,
              uuid: item.chlo2u_uuid
            })
          })

          res.json(arr)

          return next()
        })
        .catch(err => {
          logger.error('GET /group/:id/answers', err)

          res.send(404, {
            "message": "not_found"
          })
        })
    })

    server.patch('/:id/answers', (req, res, next) => {
      let page = 0
      let url = ''
      const count = 30
      const promises = []

      group.findOneById(req.params.id)
        .then(group => {
          url = group.url

          return fetch(`${group.url}?pagesize=1`)
        })
        .then(res => res.json())
        .then(json => {
          page = Math.ceil(json.totalcount / count)

          for (let i = 1; i <= page; i += 1) {
            promises.push(callback => {
              fetch(`${url}?pagesize=${count}&pageindex=${i}`)
                .then(res => res.json())
                .then(json => answer.createBeforeUpdate(req.params.id, json.items))
                .then(results => callback(null, results))
                .catch(err => {
                  throw err
                })
            })
          }

          series(promises, (err, results) => {
            if (err) {
              throw err
            } else {
              res.json({
                "message": "action_succeed"
              })

              return next()
            }
          })
        })
        .catch(err => {
          logger.error('PATCH /group/:id/answers', err)

          res.send(500, {
            "message": "action_failed",
            "reason": "api_connect_timeout"
          })
        })
    })

    server.get('/:id/questions', (req, res, next) => {
      question.findByGroupId(req.params.id)
        .then(results => {
          res.json(results)

          return next()
        })
        .catch(err => {
          logger.error('GET /group/:id/questions', err)

          res.send(404, {
            "message": "not_found"
          })
        })
    })

    server.post({
      path: '/:id/questions',
      validations: {
        body: {
          descr: joi.string(),
          question: joi.string().required(),
          user_uuid: joi.string().required()
        }
      }
    }, (req, res, next) => {
      const body = Object.assign(req.params, req.body)

      question.create(body)
        .then(result => {
          res.json(result)

          return next()
        })
        .catch(err => {
          logger.error('POST /group/:id/questions', err)

          res.send(500, {
            "message": "create_disallow"
          })
        })
    })
  })
}