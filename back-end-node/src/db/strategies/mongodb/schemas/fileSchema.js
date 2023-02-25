const Mongoose = require('mongoose')

const FileSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
    },
    key: {
        type: String,
    },
    url: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//mocha workaround
module.exports = Mongoose.models.file || Mongoose.model('file', FileSchema)