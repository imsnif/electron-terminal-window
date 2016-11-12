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

  let proposeGeometry = function (term) {
    let parentElementStyle = window.getComputedStyle(term.element.parentElement)
    let parentElementHeight = parseInt(parentElementStyle.getPropertyValue('height'))
    let parentElementWidth = parseInt(parentElementStyle.getPropertyValue('width'))
    let elementStyle = window.getComputedStyle(term.element)
    let elementPaddingVer = parseInt(elementStyle.getPropertyValue('padding-top')) + parseInt(elementStyle.getPropertyValue('padding-bottom'))
    let elementPaddingHor = parseInt(elementStyle.getPropertyValue('padding-right')) + parseInt(elementStyle.getPropertyValue('padding-left'))
    let availableHeight = parentElementHeight - elementPaddingVer
    let availableWidth = parentElementWidth - elementPaddingHor
    let subjectRow = term.rowContainer.firstElementChild
    let contentBuffer = subjectRow.innerHTML
    let characterHeight
    let rows
    let characterWidth
    let cols
    let geometry

    subjectRow.style.display = 'inline'
    subjectRow.innerHTML = 'W' // Common character for measuring width, although on monospace
    characterWidth = subjectRow.getBoundingClientRect().width
    subjectRow.style.display = '' // Revert style before calculating height, since they differ.
    characterHeight = parseInt(subjectRow.offsetHeight)
    subjectRow.innerHTML = contentBuffer

    rows = parseInt(availableHeight / characterHeight)
    cols = parseInt(availableWidth / characterWidth) - 1

    geometry = {cols: cols, rows: rows}
    return geometry
  }
  return {
    resize: () => {
      let termSize = proposeGeometry(termEmulator)
      termEmulator.destroy()
      ptyTerm.removeAllListeners('data')
      termEmulator = createTerm(terminalContainer, Object.assign({}, termSize, {rows: termSize.rows + 1, cols: termSize.cols + 1}))
      termEmulator.write(terminalBuffer.get())
      ptyTerm.resize(termSize.cols, termSize.rows)
      attachTerminals(termEmulator, ptyTerm, termSize)
    }
  }
}
