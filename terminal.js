'use strict'

const pty = require('pty.js')
const Terminal = require('xterm')
const termFitter = require('./node_modules/xterm/addons/fit/fit.js')
const { ipcRenderer } = require('electron')

const termOpts = {
  cursorBlink: false
}

function createTerm (terminalContainer, opts) {
  const term = new Terminal(Object.assign({}, termOpts, opts))
  term.open(terminalContainer)
  fitTerminal(term, opts.width, opts.height)
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

function fitTerminal (term, width, height) {
  document.getElementById('terminal-container').style.height = `${height - 2}px` // TODO: exact number
  document.getElementById('terminal-container').style.width = `${width - 2}px`
  term.fit()
}

function attachTerminals(term, ptyTerm, opts) {
  ptyTerm.on('data', function(data) {
    term.write(data);
  })
  term.on('data', function(data) {
    ptyTerm.write(data);
  })
  term.on('resize', (opts) => {
    ptyTerm.resize(opts.cols, opts.rows)
  })
  ipcRenderer.on('termResize', (event, opts) => {
    fitTerminal(term, opts.width, opts.height)
  })
}

module.exports = function createTerminal(terminalContainer, opts = {}) {
  const termEmulator = createTerm(terminalContainer, opts)
  const ptyTerm = createPtyTerm(opts, termEmulator.cols, termEmulator.rows)
  attachTerminals(termEmulator, ptyTerm, opts)
  return {
    resize: (width, height) => fitTerminal(termEmulator, width, height)
  }
}
