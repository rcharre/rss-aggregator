const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    name: { type: String, required: true },
    executed: { type: Boolean, required: true },
})

module.exports = mongoose.model('DatabaseChangelog', schema)