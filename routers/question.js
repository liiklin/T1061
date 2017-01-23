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

        server.post({
            path: '/:id/ask',
            validations: {
                body: {
                    descr: joi.string(),
                    question: joi.string().required(),
                    user_uuid: joi.string().required()
                }
            }
        }, (req, res, next) => {
            const body = Object.assign(req.params, req.body)

            question.createByParentId(body)
                .then(result => {
                    res.json(result)

                    return next()
                })
                .catch(err => {
                    logger.error('POST /questions/:id/ask', err)

                    res.send(500, {
                        "message": "create_disallow"
                    })
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

        // 新增 Put /questions/{id}/resolve
        server.put({
            path: '/:id/resolve',
            validations: {
                body: {
                    user_uuid: joi.string()
                }
            }
        }, (req, res, next) => {
            question.updateByResolve(req.params.id, req.body)
                .then(result => {
                    // res.json(result)
                    res.json({
                        "status": "success",
                        "msg": "成功"
                    })

                    return next()
                })
                .catch(err => {
                    logger.error('PUT /questions/{id}/resolve', err)

                    switch (err.code) {
                        case 500:
                            res.send(500, {
                                "status":"failed",
                                "message": err.error
                            })
                            break
                        case 404:
                            res.send(404, {
                                "status":"failed",
                                "message": "not_found"
                            })
                            break
                        default:
                            res.send(500, {
                                "status":"failed",
                                "message": err.error
                            })
                    }
                })
        })
    })
}
