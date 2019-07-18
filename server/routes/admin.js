const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

require('../models/Admin.js')
const Admin = mongoose.model('Admin')

const msg = require('../utils').msg
const checkGodToken = require('../utils').checkGodToken

module.exports = api => {
    api.get('/all_admin', (req, res) => {
        if (!req.query.secret) return res.send(msg('secret key is required'))
        else if (req.query.secret !== process.env.SECRET_KEY) return res.send(msg('Invalid Secret Key'))
        Admin.find({}, (err, data) => res.send(data))
    })

    api.post('/login', (req, res) => {
        if (!req.body.username || !req.body.password) return res.send(msg('missing field'))
        Admin.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] }, async (err, admin) => {
            if (admin == null) return res.json(msg('Tài khoản không tồn tại', 400))
            const isValid = admin.isValidPassword(req.body.password)
            var clientToken = ''
            if (isValid) {
                await jwt.sign({ data: admin }, process.env.SECRET_KEY, (err, token) => {
                    if (err) console.log(err)
                    clientToken = token
                })
            }
            req.session.jwt = clientToken
            req.session.save()
            let text = isValid ? 'Đăng nhập thành công' : 'Mật khẩu không chính xác'
            let status = isValid ? 200 : 406
            res.json(msg(text, status, { token: clientToken }))
        })
    })

    api.post('/new_admin', (req, res) => {
        if (!req.body.username || !req.body.password || !req.body.email || !req.body.godToken)
            return res.send(msg('missing field'))
        else if (!checkGodToken(req.body.godToken)) return res.send(msg('Invalid God Token'))
        const account = new Admin(req.body)
        account.setPassword(req.body.password)
        account
            .save()
            .then(data => res.send(data))
            .catch(err => res.send(err))
    })

    api.delete('/logout', (req, res) => {
        delete req.session.jwt
        res.send(msg('logout successfully'))
    })

    api.delete('/delete_admin', (req, res) => {
        if (!req.body.username || !req.body.password) return res.send(msg('missing field'))
        Admin.findOneAndDelete(
            { $or: [{ username: req.body.username }, { email: req.body.username }] },
            (err, admin) => {
                if (admin == null) return res.json(msg('Tài khoản không tổn tại', 402))
                const isValid = admin.isValidPassword(req.body.password)
                if (isValid) {
                    res.send(msg('Deleted', 200, admin))
                    return true
                }
            }
        )
    })
}
