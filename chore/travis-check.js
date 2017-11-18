'use strict'
// Import util and promisify exec method
const util = require('util')
console.log('util', util)
const exec = util.promisify(require('child_process').exec)
// Import path and create path to the dist folder
const path = require('path')
const distPath = path.join(__base, 'dist')
// Stor the value of the job state you want to check.
// In this case we want to check if the job state is "passed"
const validState = 'passed'

// Export the function as module
module.exports = travisCheck

function travisCheck () {
  // checks the status of the last build of the current repository
  // --no-interactive disables the interactive mode
  // source: https://github.com/travis-ci/travis.rb/blob/master/README.md
  return exec('travis status --no-interactive', {cwd: distPath})
      .then((result) => {
        // Check if the job state is "passed"
        if (result.stdout === validState) {
          return Promise.resolve(result)
        } else {
          return Promise.reject(result)
        }
      })
  )
}
