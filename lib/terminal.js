'use strict'

require('../node_modules/xterm/addons/fit/fit.js') // mixin

const pty = require('pty.js')
const Terminal = require('xterm')
const terminalBuffer = require('./terminal-buffer')()

const termOpts = {
  cursorBlink: false
}

function createTerm (terminalContainer, opts) {
  const term = new Terminal(Object.assign({}, termOpts, opts))
  term.open(terminalContainer)
  term.fit()
  return term
}

function createPtyTerm (opts, cols, rows) {
  const ptyTerm = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash',
    process.env.testing ? ['--noprofile', '--norc'] : [],
    Object.assign({}, ptyOpts(cols, rows), opts)
  )
  return ptyTerm
}

function ptyOpts (cols, rows) {
  return {
    name: 'xterm-color',
    cols: cols,
    rows: rows,
    cwd: process.env.PWD,
    env: process.env
  }
}

function attachTerminals (term, ptyTerm, opts) {
  ptyTerm.on('data', function (data) {
    terminalBuffer.addData(data)
    term.write(data)
  })
  term.on('data', function (data) {
    ptyTerm.write(data)
  })
}

module.exports = function createTerminal (terminalContainer, opts = {}) {
  let termEmulator = createTerm(terminalContainer, opts)
  const ptyTerm = createPtyTerm(opts, termEmulator.cols, termEmulator.rows)
  attachTerminals(termEmulator, ptyTerm, opts)
  return {
    resize: (size) => {
      console.log('size: ' + JSON.stringify(size))
      termEmulator.destroy()
      ptyTerm.resize(size.cols, size.rows)
      termEmulator = createTerm(terminalContainer, size)
      attachTerminals(termEmulator, ptyTerm, size)
      console.log(terminalBuffer.get())
      termEmulator.write(terminalBuffer.get())
    }
  }
}
