'use strict'

const { BrowserWindow } = require('electron')
const registerCopy = require('./lib/register-copy')

module.exports = function TerminalWindow (opts = {}) {
  const win = new BrowserWindow(Object.assign({}, opts, {show: false}))
  win.loadURL(`file://${__dirname}/lib/index.html`)
  win.on('resize', () => win.webContents.executeJavaScript('terminal.resize()'))
  win.webContents.executeJavaScript(
    `const terminal = require('./terminal.js')(
      window.document.getElementById('terminal-container')
    )`
  )
  win.on('focus', () => {
    win.webContents.executeJavaScript(
      `document.querySelectorAll('#top, #bottom, #left, #right')
        .forEach(function(e) { e.style.background = "red"  })`
    )
  })
  win.on('blur', () => {
    win.webContents.executeJavaScript(
      `document.querySelectorAll('#top, #bottom, #left, #right')
        .forEach(function(e) { e.style.background = "green"  })`
    )
  })
  win.show()
  registerCopy(win)
  return Object.assign(win, {constructor: TerminalWindow}) // TODO: fix this
}
