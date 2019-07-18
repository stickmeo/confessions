const mongoose = require('mongoose')

const ApprovedCfsSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    upload_timestamp: {
        type: Date,
        required: true,
    },
    approved_timestamp: {
        type: Date,
        default: Date.now,
    },
    order: {
        type: String,
        required: true
    }
})

mongoose.model('ApprovedCfs', ApprovedCfsSchema)
