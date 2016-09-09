'use strict'

const pty = require('pty.js')
const Terminal = require('xterm')
const termFitter = require('./node_modules/xterm/addons/fit/fit.js')
const { ipcRenderer } = require('electron')

const termOpts = {
  cursorBlink: false
}

function ptyOpts (term) {
  return {
    name: 'xterm-color',
    cols: term.cols,
    rows: term.rows,
    cwd: process.env.PWD,
    env: process.env
  }
}

function fitTerminal (term, width, height) {
  window.term = term
  term.resize(
    Math.floor(width / 8),
    Math.floor(height / 17)
  )
  console.log('after term.cols:', term.cols)
  console.log('after term.rows:', term.rows)
}

function attachTerminals(term, ptyTerm) {
  ptyTerm.on('data', function(data) {
    term.write(data);
  })
  term.on('data', function(data) {
    ptyTerm.write(data);
  })
  term.on('resize', (opts) => {
    console.log('resizing pty:', opts.cols, opts.rows)
    ptyTerm.resize(opts.cols, opts.rows)
    console.log(ptyTerm)
  })
}

module.exports = function createTerminal(terminalContainer, opts = {}) {
  const term = new Terminal(Object.assign({}, termOpts, opts))
  term.open(terminalContainer);
  const ptyTerm = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash',
    [],
    Object.assign({}, ptyOpts(term), opts)
  )
  attachTerminals(term, ptyTerm)
  ipcRenderer.on('termResize', (event, opts) => {
    document.getElementById('terminal-container').style.height = `${opts.height - 2}px` // TODO: exact number
    document.getElementById('terminal-container').style.width = `${opts.width - 2}px`
    console.log(document.getElementById('terminal-container').style.width)
    term.fit()
  })
}
