const electron = require('electron-prebuilt')
const Application = require('spectron').Application
const test = require('tape')

const istanbul = require('istanbul')
const collector = new istanbul.Collector()
const reporter = new istanbul.Reporter()

async function getCoverage (app) {
  await app.webContents.executeJavaScript(`
    const ipcRenderer = require('electron').ipcRenderer
    ipcRenderer.send('report', window.__coverage__)
  `)
  const coverage = await app.electron.remote.getGlobal('__coverage__')
  collector.add(coverage)
}

module.exports = async function createApp (t) {
  try {
    const app = new Application({
      path: electron,
      args: [ `${__dirname}/../runner` ],
      nodeIntegration: true
    })
    await app.start()
    await app.client.waitUntilWindowLoaded()
    await app.browserWindow.isVisible()
    await new Promise((resolve) => setTimeout(resolve, 500)) // allow pty time to load
    return (process.env.coverage
      ? Object.assign({}, app, {stop: async () => {
        await getCoverage(app)
        return app.stop()
      }})
      : app
    )
  } catch (e) {
    t.fail('failed to create app:', e.message)
  }
}

test.onFinish(() => {
  if (process.env.coverage) {
    reporter.addAll([ 'text', 'html', 'lcov' ])
    reporter.write(collector, false, function () {
        console.log('All reports generated')
    })
  }
})
