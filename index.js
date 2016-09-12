'use strict'

const { BrowserWindow, ipcMain} = require('electron')

module.exports = function TerminalWindow (opts = {}) {
  const win = new BrowserWindow(Object.assign({}, opts, {show: false}))
  win.loadURL(`file://${__dirname}/index.html`)
  ipcMain.once('terminalLoaded', () => {
    win.webContents.send('termResize', {width: opts.width, height: opts.height})
    win.show()
  })
  // Open the DevTools.
  // win.webContents.openDevTools()
  return win
}
