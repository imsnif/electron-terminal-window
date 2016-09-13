const Application = require('spectron').Application
const electron = require('electron-prebuilt')
const fs = require('fs')

const test = require('tape')

const app = new Application({
  path: electron,
  args: [ `${__dirname}/../runner` ]
})

test('can create terminal window', async t => {
  t.plan(1)
  try {
    await app.start()
    await app.client.waitUntilWindowLoaded()
    await app.browserWindow.isVisible()
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 500) // allow pty time to load
    })
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
  try {
    await app.start()
    await app.client.waitUntilWindowLoaded()
    await app.browserWindow.isVisible()
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 500) // allow pty time to load
    })
    await app.browserWindow.setSize(200, 200)
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 100) // allow time to resize
    })
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
