const { ObjectId } = require('bson')
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

const schema = new Schema({
    title: { type: String, required: true },
    authors: [String],
    url: { type: String, required: true },
    scrappedDate: { type: Date, default: Date.now },
    imageUrl: String,
    source: { type: ObjectId, required: true }
})
schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Article', schema)