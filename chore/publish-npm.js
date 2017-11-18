'use strict'
// Import util and promisify exec method
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const path = require('path')
const base = path.join(__base, 'chore', 'scripts', 'tasks')

const travisCheck = require(path.join(base, 'travis-check'))
/**/
process.env.DEBUG = true

return Promise.resolve()
    .then(() => travisCheck())
    .then(() =>  exec('npm publish', {cwd: path.join(config.libPath, 'dist')}))
.catch((err) => console.info('release error'.red, err.red))
