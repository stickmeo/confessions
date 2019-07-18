const mongoose = require('mongoose')

const PendingCfsSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

mongoose.model('PendingCfs', PendingCfsSchema)
