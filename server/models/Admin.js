const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')

const AdminSchema = mongoose.Schema(
    {
        username: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            index: true,
        },
        displayname: {
            type: String,
            default: 'New Admin',
        },
        hash: {},
    },
    { timestamps: true }
)

mongoose.set('useCreateIndex', true)

AdminSchema.methods.setPassword = function(password) {
    this.hash = bcrypt.hashSync(password, 10)
}

AdminSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.hash)
}

AdminSchema.plugin(uniqueValidator, { message: 'is already taken' })

mongoose.model('Admin', AdminSchema)
