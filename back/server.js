const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const databaseConfig = require('./src/config/database/database')

const app = express()
const port = 8080

const SourceService = require('./src/services/SourceService')
const articleController = require('./src/controllers/ArticleController')

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test')
  await databaseConfig()
  app.use(cors())
  app.use('/articles', articleController)
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })

  const sourceService = new SourceService()
}

main()
