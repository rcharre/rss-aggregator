const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    tags: [String],
    parsing: {
        articleQuery: { type: String, required: true },
        dateParser: {},
        titleQuery: { type: String, required: true },
        authorQuery: String,
        urlQuery: { type: String, required: true }
    }
})

module.exports = mongoose.model('Source', schema)