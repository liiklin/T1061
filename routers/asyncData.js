const joi = require('joi')
const curl = require('curl-cmd')
const series = require('async/series')
const logger = require('tracer').console()
const namespace = require('restify-namespace')
const exec = require('child_process').exec
const group = require('../db/group')

module.exports = server => {
    namespace(server, '/api/:version/online/async', () => {
        server.get('/', (req, res, next) => {
            group.find()
                .then(results => {
                    let port = process.env.PORT || 8001
                    results.forEach(result => {
                        let options = {
                                host: 'localhost',
                                port: port,
                                method: 'PATCH',
                                path: '/api/' + req.params.version + '/online/groups/' + result.id + '/answers'
                            },
                            cmd = curl.cmd(options)
                        console.log(cmd)
                        exec(cmd, function(err, stdout, stderr) {
                            if (err) {
                                console.log('get weather api error:' + stderr)
                            } else {
                                var data = JSON.parse(stdout)
                                console.log(data)
                            }
                        })
                    })
                    res.json({
                        action: "success"
                    })

                    return next()
                })
                .catch(err => {
                    logger.error('GET /async', err)

                    res.send(500, {
                        message: 'server error'
                    })
                })
        })
    })
}
