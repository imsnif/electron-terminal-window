const test = require('tape')
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')

function stubRegisterCopy (writeText, rendererVal, localShortcut) {
  return proxyquire('../../lib/register-copy', {
    'electron': {clipboard: {writeText}},
    'electron-renderer-value': rendererVal,
    'electron-localshortcut': {register: localShortcut}
  })
}

test('copies text to clipboard when Ctrl+Shift+C is pressed', t => {
  t.plan(1)
  const writeText = sinon.spy()
  const resolveSelection = Promise.resolve('selection')
  const rendererVal = sinon.stub().withArgs(
    'webContents',
    'window.getSelection().toString()'
  ).returns(resolveSelection)
  const win = {webContents: 'webContents'}
  const localShortcut = sinon.stub().withArgs(win, 'Ctrl+Shift+C').callsArg(2)
  stubRegisterCopy(writeText, rendererVal, localShortcut)(win)
  resolveSelection.then(() => {
    t.ok(writeText.calledWith('selection'), 'text copied to clipboard')
  })
})
