const Application = require('spectron').Application
const electron = require('electron-prebuilt')
const fs = require('fs')

const test = require('tape')

test('can create terminal window', async t => {
  t.plan(1)
  try {
    const app = new Application({
      path: electron,
      args: [ `${__dirname}/../runner` ]
    })
    await app.start()
    await app.client.waitUntilWindowLoaded()
    await app.browserWindow.isVisible()
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 500) // allow pty time to load
    })
    const capturedBuf = await app.browserWindow.capturePage()
    const truth = fs.readFileSync(`${__dirname}/../screenshots/term-initial.png`)
    const matchesScreenshot = Buffer.compare(capturedBuf, truth) === 0
    t.ok(matchesScreenshot, 'terminal window appears as expected')
    app.stop()
  } catch (e) {
    t.fail(e)
    app.stop()
  }
})
