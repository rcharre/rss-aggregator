const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = 8080

const SourceService = require('./src/services/SourceService')
const articleController = require('./src/controllers/ArticleController')

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test')
  app.use('/articles', articleController)
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

  const sourceService = new SourceService()
}

main()
