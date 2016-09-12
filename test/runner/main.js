const { app, BrowserWindow } = require('electron')
const TerminalWindow = require('../..')

app.on('ready', () => {
  const win = new TerminalWindow({id: 1, height: 600, width: 800})
  console.log('win is:', win)
  win.on('show', () => console.log('showing win in main'))
})
