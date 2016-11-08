function getBufferSize () {
    // 10 times max window size with all characters
  return Math.floor(((window.screen.width * window.screen.width) / 17) * 10)
}
module.exports = function () {
  const maxBufferSize = getBufferSize()
  let termBuff = ''
  return {
    addData: function (data) {
      const trimLeft = termBuff.length + data.length - maxBufferSize
      if (trimLeft > 0) {
        termBuff = termBuff.slice(trimLeft)
        termBuff += data
      } else {
        termBuff += data
      }
    },
    get: function () {
      return termBuff
    }
  }
}
