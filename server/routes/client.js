const path = require('path')

const adminAuth = require('../utils').adminAuth

module.exports = app => {
    app.get('/admin*', adminAuth, (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'), err => {
            if (err) {
                res.status(500).send(err)
            }
        })
    })

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'), err => {
            if (err) {
                res.status(500).send(err)
            }
        })
    })
}
