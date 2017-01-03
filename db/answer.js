const orm = require('orm')
const uuidV4 = require('uuid/v4')
const redis = require('./redis')
const question = require('./question')
const similar = require('./similar')
const db_url = process.env.DB_URL
const AnswersSchema = {
  id: Number,
  group_id: Number,
  question: String,
  answer: String,
  chlo2u_uuid: String,
  uuid: String
}

exports.findById = id => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Answers = db.define('answers', AnswersSchema)

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

          Answers.one(query, (err, answer) => {
            if (err) {
              db.close()
              reject(err)
            } else {
              if (answer) {
                similar.findByAnswerId(answer.id)
                  .then(results => {
                    const id = []

                    results.forEach(item => id.push(item.question_id))

                    return question.findAndNotLinks(id)
                  })
                  .then(links => {
                    if (links.length) {
                      answer.links = links
                    }

                    db.close()
                    resolve(answer)
                  })
                  .catch(err => {
                    db.close()
                    reject(err)
                  })
              } else {
                reject()
              }
            }
          })
        }
      })
    }
  })
})

exports.findByIdAndNotLinks = id => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Answers = db.define('answers', AnswersSchema)

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

          Answers.one(query, (err, answer) => {
            db.close()

            if (err) {
              reject(err)
            } else {
              resolve(answer)
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
      const Answers = db.define('answers', AnswersSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          Answers.find({ group_id }, (err, results) => {
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

exports.createItem = (group_id, data) => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Answers = db.define('answers', AnswersSchema)
      const newRecord = {
        group_id,
        question: data.name,
        answer: data.content,
        chlo2u_uuid: data.id,
        uuid: uuidV4()
      }

      Answers.create(newRecord, (err, result) => {
        db.close()

        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    }
  })
})

exports.createBeforeUpdate = (group_id, data) => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Answers = db.define('answers', AnswersSchema)
      const id = []
      const promises = []
      const AnswerObj = {}

      data.forEach(item => id.push(item.id.toString()))

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          Answers.find({ chlo2u_uuid: id }, (err, answers) => {
            if (Array.isArray(answers)) {
              answers.forEach((item, index) => AnswerObj[item.chlo2u_uuid] = index)
            }

            data.forEach(item => {
              if (AnswerObj[item.id] >= 0) {
                answers[AnswerObj[item.id]].question = item.name
                answers[AnswerObj[item.id]].answer = item.content

                promises.push(new Promise((resolve, reject) => {
                  answers[AnswerObj[item.id]].save(err => {
                    if (err) {
                      reject(err)
                    } else {
                      resolve(answers[AnswerObj[item.id]])
                    }
                  })
                }))
              } else {
                promises.push(exports.createItem(group_id, item))
              }
            })

            Promise.all(promises)
              .then(results => {
                redis.emit('answers sync', results)

                db.close()
                resolve(results)
              })
              .catch(err => {
                db.close()
                reject(err)
              })
          })
        }
      })
    }
  })
})
