const orm = require('orm')
const db_url = process.env.DB_URL
const similarsSchema = {
  id: Number,
  question_id: String,
  answer_id: String,
  created_at: Date
}

exports.findByQuestionId = question_id => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Similars = db.define('similars', similarsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          Similars.one({ question_id }, (err, result) => {
            db.close()

            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        }
      })
    }
  })
})

exports.findByAnswerId = answer_id => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Similars = db.define('similars', similarsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          Similars.find({ answer_id }, (err, result) => {
            db.close()

            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        }
      })
    }
  })
})

exports.update = (question_id, answer_id) => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Similars = db.define('similars', similarsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          Similars.one({ question_id, answer_id }, (err, similar) => {
            if (err) {
              db.close()
              reject(err)
            } else {
              if (similar) {
                similar.answer_id = answer_id

                similar.save(err => {
                  db.close()

                  if (err) {
                    reject(err)
                  } else {
                    resolve(similar)
                  }
                })
              } else {
                const newRecord = {
                  question_id,
                  answer_id,
                  created_at: new Date()
                }

                Similars.create(newRecord, (err, result) => {
                  db.close()

                  if (err) {
                    reject(err)
                  } else {
                    resolve(result)
                  }
                })
              }
            }
          })
        }
      })
    }
  })
})

exports.deleteByQuestionId = question_id => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      db.sync(err => {
        const Similars = db.define('similars', similarsSchema)

        if (err) {
          db.close()
          reject(err)
        } else {
          Similars.find({ question_id }).remove(err => {
            db.close()
            
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        }
      })
    }
  })
})