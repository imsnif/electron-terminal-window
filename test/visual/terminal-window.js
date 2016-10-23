const fs = require('fs')
const createApp = require('../util/create-app')
const test = require('tape')
const env = process.env.ENVNAME || 'linux'

test('can create terminal window', async t => {
  t.plan(1)
  const app = await createApp(t)
  try {
    await app.webContents.sendInputEvent({
      type: 'keyDown',
      keyCode: 'enter'
    })
    await new Promise((resolve) => setTimeout(resolve, 100))
    // allow time for new terminal line
    const capturedBuf = await app.browserWindow.capturePage()
    fs.writeFileSync(`${__dirname}/../screenshots/${env}/debug1.png`, capturedBuf)
    const truth = fs.readFileSync(`${__dirname}/../screenshots/${env}/term-initial.png`)
    const matchesScreenshot = Buffer.compare(capturedBuf, truth) === 0
    await app.stop()
    t.ok(matchesScreenshot, 'terminal window appears as expected')
  } catch (e) {
    await app.stop()
    t.fail(e)
  }
})

test('can resize terminal window', async t => {
  t.plan(1)
  const app = await createApp(t)
  try {
    await app.browserWindow.setSize(200, 200)
    await new Promise((resolve) => setTimeout(resolve, 100)) // allow time to resize
    const capturedBuf = await app.browserWindow.capturePage()
    fs.writeFileSync(`${__dirname}/../screenshots/${env}/debug2.png`, capturedBuf)
    const truth = fs.readFileSync(`${__dirname}/../screenshots/${env}/resizedWindow.png`)
    const matchesScreenshot = Buffer.compare(capturedBuf, truth) === 0
    await app.stop()
    t.ok(matchesScreenshot, 'terminal resized as expected')
  } catch (e) {
    await app.stop()
    t.fail(e)
  }
})

test('window changes border color on blur', async t => {
  t.plan(1)
  const app = await createApp(t)
  try {
    await app.browserWindow.blur()
    await new Promise((resolve) => setTimeout(resolve, 100)) // allow time to blur
    const capturedBuf = await app.browserWindow.capturePage()
    fs.writeFileSync(`${__dirname}/../screenshots/${env}/debug3.png`, capturedBuf)
    const truth = fs.readFileSync(`${__dirname}/../screenshots/${env}/term-blurred.png`)
    const matchesScreenshot = Buffer.compare(capturedBuf, truth) === 0
    await app.stop()
    t.ok(matchesScreenshot, 'changed border color')
  } catch (e) {
    await app.stop()
    t.fail(e)
  }
})
