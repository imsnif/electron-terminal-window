module.exports = function() {
	const maxBufferSize = 1000 // FIXME: determine buffer size
	let termBuff = ''
	return {
		addData: function(data) { // FIXME: performance
			const trimLeft = termBuff.length + data.length - maxBufferSize
			if (trimLeft > 0) {
				termBuff = termBuff.slice(trimLeft)
				termBuff += data
			} else {
				termBuff += data
			}
		},
		get: function() {
			return termBuff
		}
	}
}