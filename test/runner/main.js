'use strict'

require('../util/require-hook')

const { app, ipcMain } = require('electron')

const TerminalWindow = require('../../lib')
const path = require('path')

app.on('ready', () => {
  TerminalWindow({
    id: 1,
    height: 400,
    width: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, '../util/require-hook.js')
    }
  })
  ipcMain.on('report', (e, coverage) => {
    global.__coverage__ = Object.assign({}, global.__coverage__, coverage)
  })
})
