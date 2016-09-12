const { app, BrowserWindow } = require('electron')
const TerminalWindow = require('../..')

app.on('ready', () => {
  const win = new TerminalWindow({id: 1, height: 400, width: 600})
  // win.webContents.openDevTools()
})
