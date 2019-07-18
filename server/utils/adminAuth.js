const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

require('../models/Admin.js')
const Admin = mongoose.model('Admin')

module.exports = (req, res, next) => {
	const bearerHeader = req.headers.authorization? req.headers.authorization.split(' ')[1] : undefined
	const token = req.session.jwt || bearerHeader
	if (token) {
		jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
			if (err) return console.log(err)
			let { username, hash, email } = data.data
			Admin.findOne({ $or: [{username: username}, {email: email}] }, async (err, admin) => {
				if (admin == null) return res.redirect('/login')
				else if (admin.hash === hash) return next()
				else return res.redirect('/login')
			})
		})
	}
	else res.redirect('/login')
}