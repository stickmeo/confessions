const mongoose = require('mongoose')
const axios = require('axios')
const rateLimit = require('express-rate-limit')
const fs = require('fs')

require('../models/PendingCfs')
require('../models/ApprovedCfs')
const PendingCfs = mongoose.model('PendingCfs')
const ApprovedCfs = mongoose.model('ApprovedCfs')

const adminAuth = require('../utils').adminAuth
const msg = require('../utils').msg

const postConfessionLimiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 5 minutes
	max: 10
});

module.exports = api => {
    api.get('/pending', adminAuth, (req, res) => {
        PendingCfs.find({}, (err, data) => {
            res.json(data)
        })
    })

    api.get('/approved', adminAuth, (req, res) => {
        ApprovedCfs.find({}, (err, data) => res.json(data))
    })

    api.get('/delete_all', (req, res) => {
        if (!req.query.secret) return res.send(msg('secret key is required'))
        else if (req.query.secret !== process.env.SECRET_KEY) return res.send(msg('secret key is invalid'))
        ApprovedCfs.deleteMany({}, err => true)
        PendingCfs.deleteMany({}, err => true)
        res.send(msg('done'))
    })

    api.post('/new_pending', postConfessionLimiter, (req, res) => {
        if (!req.body.content) return res.send(msg('content cannot be empty', 400))
        let newCfs = new PendingCfs({
            content: req.body.content.trim(),
        })
        newCfs
            .save()
            .then(data => console.log('New Confession added'))
            .catch(e => console.log(e))
        res.send(msg('Done'))
    })

    api.post('/post_cfs', adminAuth, async (req, res) => {
        let config = JSON.parse(fs.readFileSync('server/config.json', 'utf-8'))
        try {
            await axios.post(
                `https://graph.facebook.com/${config.pageId}/feed?access_token=${config.pageToken}`,
                { message: req.body.format }
            )
            await ApprovedCfs.collection.insertMany(
                req.body.raw.map(each => ({
                    content: each.content,
                    upload_timestamp: each.timestamp,
                    order: each.order
                }))
            )
            await PendingCfs.deleteMany({ _id: req.body.raw.map(each => each._id) }, (err, data) => true)
            res.send(true)
        } catch (err) {
            res.send('Failed')
        }
    })

    api.delete('/delete_cfs', adminAuth, (req, res) => {
        if (!req.body._id) return res.send(msg('_id cannot be empty', 400))
        PendingCfs.deleteOne({ _id: req.body._id }, (err, data) => {
            if (err) res.json({ msg: 'error' })
            res.json({ msg: 'success' })
        })
    })
}
