#!/usr/bin/env node


var fs = require('fs')
var util = require('util')

var MAX_LENGTH = 100
var PATTERN = /^(?:fixup!\s*)?(\w*)(\(([\w\$\.\*/-]*)\))?\: (.*)$/
var IGNORED = /^WIP\:/
var TYPES = {
  amend: true,
  feat: true,
  fix: true,
  docs: true,
  style: true,
  refactor: true,
  perf: true,
  test: true,
  chore: true,
  revert: true
}


function displayError () {
  // gitx does not display it
  // http://gitx.lighthouseapp.com/projects/17830/tickets/294-feature-display-hook-error-message-when-hook-fails
  // https://groups.google.com/group/gitx/browse_thread/thread/a03bcab60844b812
  console.error('INVALID COMMIT MSG: ' + util.format.apply(null, arguments))
}


var validateMessage = function(message) {
  var isValid = true

  if (IGNORED.test(message)) {
    console.log('Commit message validation ignored.')
    return true
  }

  if (message.length > MAX_LENGTH) {
    displayError('is longer than %d characters !', MAX_LENGTH)
    isValid = false
  }

  var match = PATTERN.exec(message)

  if (!match) {
    displayError('does not match "<type>(<scope>): <subject>" ! was: ' + message)
    return false
  }

  var type = match[1]
  var scope = match[3]
  var subject = match[4]

  if (!TYPES.hasOwnProperty(type)) {
    displayError('"%s" is not allowed type !', type)
    return false
  }

  // Some more ideas, do want anything like this ?
  // - allow only specific scopes (eg. fix(docs) should not be allowed ?
  // - auto correct the type to lower case ?
  // - auto correct first letter of the subject to lower case ?
  // - auto add empty line after subject ?
  // - auto remove empty () ?
  // - auto correct typos in type ?
  // - store incorrect messages, so that we can learn

  return isValid
}

function firstLineFromBuffer (buffer) {
  return buffer.toString().split('\n').shift()
}
