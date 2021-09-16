const { ObjectId } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    title: { type: String, required: true },
    authors: [String],
    url: { type: String, required: true },
    scrappedDate: { type: Date, default: Date.now },
    source: { type: ObjectId, required: true }
})

module.exports = mongoose.model('Article', schema)