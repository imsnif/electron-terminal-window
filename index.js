'use strict'

const { BrowserWindow, ipcMain} = require('electron')

module.exports = function TerminalWindow (opts = {}) {
  const win = new BrowserWindow(Object.assign({}, opts, {show: false}))
  win.loadURL(`file://${__dirname}/index.html`)
  win.on('resize', function () {
    const bounds = win.getBounds()
    win.webContents.executeJavaScript(
      `terminal.resize(${bounds.width}, ${bounds.height})`
    )
  })
  win.webContents.executeJavaScript(
    `const terminal = require('./terminal.js')(
      window.document.getElementById('terminal-container'), {
        width: ${opts.width},
        height: ${opts.height}
      }
    )`
  )
  win.show()
  // win.webContents.openDevTools()
  return win
}
