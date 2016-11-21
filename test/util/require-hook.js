'use strict'
const istanbul = require('istanbul')
const hook = istanbul.hook
const instrumenter = new istanbul.Instrumenter()
const myMatcher = function (file) { return !/node_modules|register-copy/g.test(file) } // temporary until we get rid of this horrid hack
const myTransformer = function (code, file) { return instrumenter.instrumentSync(code.toString(), file) }

hook.hookRequire(myMatcher, myTransformer)
