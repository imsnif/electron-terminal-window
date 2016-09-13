'use strict'

const { BrowserWindow } = require('electron')

module.exports = function TerminalWindow (opts = {}) {
  const win = new BrowserWindow(Object.assign({}, opts, {show: false}))
  win.loadURL(`file://${__dirname}/index.html`)
  win.on('resize', () => win.webContents.executeJavaScript('terminal.resize()'))
  win.webContents.executeJavaScript(
    `const terminal = require('./terminal.js')(
      window.document.getElementById('terminal-container')
    )`
  )
  win.show()
  return win
}
