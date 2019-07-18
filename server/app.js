// ===============Library===============
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const favicon = require('serve-favicon')
const cors = require('cors')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')

// ===============Config===============
require('dotenv').config()
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100
})
const app = express()
const api = express.Router()
const PORT = process.env.PORT || 3000

// ===============Database===============
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.then(() => console.log('MongoDB connected'))
.catch(e => console.log(e))

// ===============Middlewares===============
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 2592000000, secure: false } // a month
}))
app.use('/api', api)
app.use('/api/', apiLimiter)
app.use(express.static(`${__dirname}/../client/dist`))
app.use(favicon(__dirname + '/favicon.png'))
api.use(cors())
api.use(bodyParser.json())

// ===============Routes===============
// Client
require('./routes/client')(app)

// Server
require('./routes/admin')(api)
require('./routes/confession')(api)
require('./routes/config')(api)

api.get('/', (req, res) => {
	res.json({ msg:'App is running...' })
})

api.get('/session', (req, res) => {
	res.json(req.session)
})

// ===============Listen===============
app.listen(PORT, () => {
    console.log(`Magic is happening on port ${PORT}...`)
})