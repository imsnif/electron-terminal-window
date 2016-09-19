const fs = require('fs')
const createApp = require('../util/create-app')
const test = require('tape')

test('can create terminal window', async t => {
  t.plan(1)
  const app = await createApp(t)
  try {
    const capturedBuf = await app.browserWindow.capturePage()
    const truth = fs.readFileSync(`${__dirname}/../screenshots/term-initial.png`)
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
    const truth = fs.readFileSync(`${__dirname}/../screenshots/resizedWindow.png`)
    const matchesScreenshot = Buffer.compare(capturedBuf, truth) === 0
    await app.stop()
    t.ok(matchesScreenshot, 'terminal resized as expected')
  } catch (e) {
    await app.stop()
    t.fail(e)
  }
})
