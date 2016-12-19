const orm = require('orm')
const redis = require('./redis')
const db_url = process.env.DB_URL
const GroupsSchema = {
  id: Number,
  name: String,
  url: String
}

exports.find = () => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Groups = db.define('groups', GroupsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          Groups.find((err, results) => {
            if (err) {
              db.close()
              reject(err)
            } else {
              db.close()
              resolve(results)
            }
          })
        }
      })
    }
  })
})

exports.findOneById = id => new Promise((resolve, reject) => {
  orm.connect(db_url, (err, db) => {
    if (err) {
      reject(err)
    } else {
      const Groups = db.define('groups', GroupsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        } else {
          Groups.find({ id }, 1, (err, results) => {
            if (err) {
              reject(err)
            } else {
              if (results.length) {
                db.close()
                resolve(results[0])
              } else {
                db.close()
                reject('not_found')
              }
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
      const Groups = db.define('groups', GroupsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject(err)
        }

        Groups.create(object, err => {
          if (err) {
            db.close()
            reject(err)
          }

          Groups.one(object, (err, result) => {
            if (err) {
              db.close()
              reject(err)
            } else {
              redis.emit('groups create', result)

              db.close()
              resolve(result)
            }
          })
        })
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
      const Groups = db.define('groups', GroupsSchema)

      db.sync(err => {
        Groups.one({ id }, (err, group) => {
          if (err) {
            db.close()
            reject({
              error: err,
              code: 500
            })
          } else {
            if (group) {
              Object.keys(object).forEach(key => {
                group[key] = object[key]
              })

              group.save(err => {
                if (err) {
                  db.close()
                  reject({
                    error: err,
                    code: 500
                  })
                } else {
                  redis.emit('groups create', group)

                  db.close()
                  resolve(group)
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
      const Groups = db.define('groups', GroupsSchema)

      db.sync(err => {
        if (err) {
          db.close()
          reject({
            error: err,
            code: 500
          })
        } else {
          Groups.find({ id }, 1, (err, results) => {
            if (err) {
              db.close()
              reject({
                error: err,
                code: 500
              })
            } else {
              if (results.length) {
                Groups.find({ id }).remove(err => {
                  if (err) {
                    reject({
                      error: err,
                      code: 500
                    })
                  } else {
                    redis.emit('groups create', { id })

                    db.close()
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