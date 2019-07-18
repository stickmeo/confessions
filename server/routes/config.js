const fs = require('fs')
const jwt = require('jsonwebtoken')

const msg = require('../utils').msg
const adminAuth = require('../utils').adminAuth

module.exports = api => {
    api.get('/config', adminAuth, (req, res) => {
        let file = JSON.parse(fs.readFileSync('server/config.json', 'utf-8'))
        file.pageToken = ''
        res.send(file)
    })

    api.post('/gen_god_token', (req, res) => {
        let expired = parseInt(req.body.expired) || 60 * 30
        if (!req.body.secret) return res.send(msg('missing field'))
        jwt.sign({ data: true }, process.env.SECRET_KEY, { expiresIn: expired }, (err, token) => {
            const godTokens = JSON.parse(fs.readFileSync('server/godTokens.json'))
            godTokens.push(token)
            fs.writeFileSync('server/godTokens.json', JSON.stringify(godTokens))
            res.json(msg('Done', 200, { token: token, expired: expired }))
        })
    })

    api.put('/change_config', adminAuth, (req, res) => {
        if (!req.body) return res.send(msg('missing field'))
        fs.readFile('server/config.json', 'utf-8', (err, file) => {
            let data = JSON.parse(file)
            for (let key in req.body) {
                if (req.body[key]) data[key] = req.body[key]
            }
            fs.writeFile('server/config.json', JSON.stringify(data, null, 4), err => {
                console.log('Config is changed')
                res.send(msg('Config is changed'))
            })
        })
    })
}
