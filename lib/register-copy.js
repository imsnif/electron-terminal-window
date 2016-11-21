const { clipboard } = require('electron')
const rendererVal = require('electron-renderer-value')
const electronLocalShortcut = require('electron-localshortcut')

module.exports = function (win) {
  electronLocalShortcut.register(win, 'Ctrl+Shift+C', () => {
    rendererVal(win.webContents, 'window.getSelection().toString()')
    .then(selection => {
      clipboard.writeText(selection)
    })
  })
}
