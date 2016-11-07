'use strict'

const { BrowserWindow } = require('electron')

module.exports = function TerminalWindow (opts = {}) {
  const win = new BrowserWindow(Object.assign({}, opts, {show: false}))
  win.loadURL(`file://${__dirname}/lib/index.html`)
  win.on('resize', () => {
    let size = win.getSize()
    const cols = Math.floor(size[0] / 17) // FIXME: magic number should be based on font-size
    const rows = Math.floor(size[1] / 17)
    win.webContents.executeJavaScript(`terminal.resize({rows:${rows}, cols:${cols}})`)
  })
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
  return Object.assign(win, {constructor: TerminalWindow}) // TODO: fix this
}
