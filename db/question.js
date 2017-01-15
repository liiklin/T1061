const orm = require('orm')
const uuidV4 = require('uuid/v4')
const redis = require('./redis')
const answer = require('./answer')
const similar = require('./similar')
const db_url = process.env.DB_URL
const QuestionsSchema = {
  id: Number,
  group_id: Number,
  question: String,
  descr: String,
  state: String,
  reply: String,
  user_uuid: String,
  created_at: Date,
  replied_at: Date,
  replier_uuid: String,
  uuid: String
}

exports.findById = id => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Questions = db.define('questions', QuestionsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          const query = {}

          if (Number(id)) {
            query.id = id
          } else {
            query.uuid = id
          }

          Questions.one(query, (err, question) => {
            if (err) {
              db.close()
              reject(err)
            } else {
              if (question) {
                similar.findByQuestionId(question.id)
                  .then(result => {
                    if (result) {
                      return answer.findByIdAndNotLinks(result.answer_id)
                    } else {
                      return ''
                    }
                  })
                  .then(answer => {
                    if (answer) {
                      question.link = answer
                    }

                    db.close()
                    resolve(question)
                  })
                  .catch(err => {
                    db.close()
                    reject(err)
                  })
              } else {
                db.close()
                reject(err)
              }
            }
          })
        }
      })
    }
  })
})

exports.findAndNotLinks = id => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Questions = db.define('questions', QuestionsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          Questions.find({ id }, (err, results) => {
            db.close()

            if (err) {
              reject(err)
            } else {
              resolve(results)
            }
          })
        }
      })
    }
  })
})

exports.findByGroupId = group_id => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Questions = db.define('questions', QuestionsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          Questions.find({ group_id }, (err, results) => {
            db.close()

            if (err) {
              reject(err)
            } else {
              resolve(results)
            }
          })
        }
      })
    }
  })
})

exports.findByQuery = query => new Promise((resolve, reject) => {
  let begin_time = new Date(),
    end_time = new Date(),
    page = query.page || 1,
    page_size = query.page_size || 20

  if (query.begin_time) {
    begin_time = new Date(query.begin_time)
    delete query.begin_time
  }
  if (query.end_time) {
    end_time = new Date(query.end_time)
    delete query.end_time
  }
  delete query.page
  delete query.page_size

  query['created_at'] = orm.between(begin_time,end_time)

  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Questions = db.define('questions', QuestionsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          Questions.find(query).limit(20).offset((page-1) * 20).run((err, results) => {
            db.close()

            if (err) {
              reject(err)
            } else {
              resolve(results)
            }
          })
        }
      })
    }
  })
})

exports.create = object => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Questions = db.define('questions', QuestionsSchema)
      const newRecord = {
        descr: object.descr,
        question: object.question,
        group_id: object.id,
        user_uuid: object.user_uuid,
        uuid: uuidV4(),
        created_at: new Date(),
        state: 'initial'
      }

      Questions.create(newRecord, (err, result) => {
        if (err) {
          db.close()

          reject(err)
        } else {
          redis.emit(`questions create`, result)

          db.close()
          resolve(result)
        }
      })
    }
  })
})

exports.updateItems = (id, object) => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject({
        error: err,
        code: 500
      })
    } else {
      const Questions = db.define('questions', QuestionsSchema)

      db.sync(err => {
        const query = {}

        if (Number(id)) {
          query.id = id
        } else {
          query.chlo2u_uuid = id
        }

        Questions.one(query, (err, question) => {
          if (err) {
            db.close()
            reject({
              error: err,
              code: 500
            })
          } else {
            if (question) {
              Object.keys(object).forEach(key => {
                question[key] = object[key]
              })

              question.save(err => {
                db.close()

                if (err) {
                  reject({
                    error: err,
                    code: 500
                  })
                } else {
                  redis.emit(`questions update`, question)

                  resolve(question)
                }
              })
            } else {
              db.close()

              reject({
                error: err,
                code: 404
              })
            }
          }
        })
      })
    }
  })
})

exports.deleteById = id => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject({
        error: err,
        code: 500
      })
    } else {
      const Questions = db.define('questions', QuestionsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject({
            error: err,
            code: 500
          })
        } else {
          const query = {}

          if (Number(id)) {
            query.id = id
          } else {
            query.chlo2u_uuid = id
          }

          Questions.count(query, (err, count) => {
            if (err) {
              db.close()
              reject({
                error: err,
                code: 500
              })
            } else {
              if (count) {
                Questions.find(query).remove(err => {
                  db.close()

                  if (err) {
                    reject({
                      error: err,
                      code: 500
                    })
                  } else {
                    redis.emit(`questions delete`, { id })

                    resolve()
                  }
                })
              } else {
                db.close()

                reject({
                  error: err,
                  code: 404
                })
              }
            }
          })
        }
      })
    }
  })
})

exports.update = (id, object) => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject({
        error: err,
        code: 500
      })
    } else {
      const Questions = db.define('questions', QuestionsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject({
            error: err,
            code: 500
          })
        } else {
          const query = {}

          if (Number(id)) {
            query.id = id
          } else {
            query.uuid = id
          }

          Questions.one(query, (err, question) => {
            if (err) {
              db.close()
              reject({
                error: err,
                code: 500
              })
            } else {
              if (question) {
                question.state = object.action

                switch (object.action) {
                  case 'link':
                    answer.findByIdAndNotLinks(object.data)
                      .then(answer => {
                        question.link = answer

                        return similar.update(question.id, answer.id)
                      })
                      .then(() => {
                        question.save(err => {
                          db.close()

                          if (err) {
                            throw err
                          } else {
                            redis.emit(`questions ${object.action}`, question)

                            resolve(question)
                          }
                        })
                      })
                      .catch(err => {
                        db.close()
                        reject({
                          error: err,
                          code: 500
                        })
                      })
                    break
                  case 'reply':
                    question.reply = object.data
                    question.replier_uuid = object.replier_uuid
                    question.replied_at = new Date()
                    break
                  case 'abort':
                    question.reply = object.data
                    question.replier_uuid = object.replier_uuid
                    question.replied_at = new Date()
                    break
                  case 'unlink':
                    similar.deleteByQuestionId(question.id)
                      .then(() => {
                        question.save(err => {
                          db.close()

                          if (err) {
                            throw err
                          } else {
                            redis.emit(`questions ${object.action}`, question)

                            resolve(question)
                          }
                        })
                      })
                      .catch(err => {
                        db.close()
                        reject({
                          error: err,
                          code: 500
                        })
                      })
                    break
                }

                if (object.action !== 'link' && object.action !== 'unlink') {
                  question.save(err => {
                    db.close()

                    if (err) {
                      reject({
                        error: err,
                        code: 500
                      })
                    } else {
                      redis.emit(`questions ${object.action}`, question)

                      resolve(question)
                    }
                  })
                }
              } else {
                db.close()

                reject({
                  error: err,
                  code: 404
                })
              }
            }
          })
        }
      })
    }
  })
})
