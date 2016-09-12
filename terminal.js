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
  document.getElementById('terminal-container').style.height = `${height - 2}px` // TODO: exact number
  document.getElementById('terminal-container').style.width = `${width - 2}px`
  term.fit()
}

function attachTerminals(term, ptyTerm, opts) {
  ptyTerm.once('data', function (data) {
    // first time
    ipcRenderer.send('terminalLoaded')
  })
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
  const term = new Terminal(Object.assign({}, termOpts, opts))
  term.open(terminalContainer);
  const ptyTerm = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash',
    process.env.testing ? ['--noprofile', '--norc'] : [],
    Object.assign({}, ptyOpts(term), opts)
  )
  attachTerminals(term, ptyTerm, opts)
}
