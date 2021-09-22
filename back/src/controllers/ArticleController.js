const express = require('express')
const router = express.Router()
const Article = require('../domain/Article')
const PageRequest = require('../config/pagination/PageRequest')

router.get('/', (req, res) => {
    let pagination = new PageRequest()
    pagination.fromRequest(req)

    Article.paginate({}, pagination.toPaginate())
        .then(result => res.json(result))
})

module.exports = router