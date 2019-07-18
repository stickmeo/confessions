module.exports = (text, status=200, data=undefined) => {
	return {
		message: text,
		status: status,
		data: data
	}
}