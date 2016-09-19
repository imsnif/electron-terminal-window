'use strict'

const { app } = require('electron')

const TerminalWindow = require('../../lib')

app.on('ready', () => {
  TerminalWindow({
    id: 1,
    height: 400,
    width: 600,
    frame: false
  })
})
