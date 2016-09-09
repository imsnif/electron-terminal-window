'use strict'

const { BrowserWindow } = require('electron')

module.exports = function TerminalWindow (opts = {}) {
  console.log('opts:', opts)
  const win = new BrowserWindow(opts)
  win.loadURL(`file://${__dirname}/index.html`)
  // Open the DevTools.
  win.webContents.openDevTools()
  return win
}
