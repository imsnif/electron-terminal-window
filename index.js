'use strict'

const { BrowserWindow, ipcMain} = require('electron')

module.exports = function TerminalWindow (opts = {}) {
  const win = new BrowserWindow(Object.assign({}, opts, {show: false, frame: false}))
  win.loadURL(`file://${__dirname}/index.html`)
  win.webContents.executeJavaScript(
    `require('./terminal.js')(
      window.document.getElementById('terminal-container'), {
        width: ${opts.width},
        height: ${opts.height}
      }
    )`
  )
  win.show()
  return win
}
