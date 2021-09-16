var express = require('express')
var router = express.Router()
var Article = require('../domain/Article')

router.get('/', (req, res) => {
    Article.find({})
        .then(result => res.json(result))
})

module.exports = router