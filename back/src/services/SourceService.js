const Article = require('../domain/Article')
const Source = require('../domain/Source')
const ExtractionRequestPublisher = require('../rabbitmq/publishers/ExtractionRequestPublisher')
const ExtractionResultConsumer = require('../rabbitmq/consumers/ExtractionResultConsumer')
const { json } = require('express')

class SourceService {
    constructor() {
        this.extractionRequestPublisher = new ExtractionRequestPublisher('amqp://localhost')
        this.etractionResultConsumer = new ExtractionResultConsumer('amqp://localhost', this._handleResult)

        setInterval(this.startExtraction, 1800000)
        this.startExtraction()
    }

    async startExtraction() {
        Source.find({})
            .then(sources => { sources.forEach(this._extract.bind(this)) })
    }

    async _extract(source) {
        return this.extractionRequestPublisher.publish(Buffer.from(JSON.stringify(source)))
    }

    async _handleResult(message) {
        try {
            let result = JSON.parse(message.content.toString())
            if (!!result.error) {
                throw result.error
            } else {
                console.log('Received result for source ' + result.source.name)
                for (let scrappedArticle of result.articles) {
                    let existing = await Article.findOne({ url: scrappedArticle.url })
                    if (!existing) {
                        let article = new Article({
                            ...scrappedArticle,
                            source: result.source
                        })
                        console.log(`Saving new article from ${result.source.name} : ${article.title}`)
                        article.save()
                    }
                }
                console.log('Finished to write new articles for source ' + result.source.name)
            }
        } catch (e) {
            console.error('Error while reading scrapped articles : ' + e)
        }
    }
}

module.exports = SourceService