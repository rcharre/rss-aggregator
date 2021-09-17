const Article = require('../domain/Article')
const Source = require('../domain/Source')
const ExtractionRequestPublisher = require('../rabbitmq/publishers/ExtractionRequestPublisher')
const ExtractionResultConsumer = require('../rabbitmq/consumers/ExtractionResultConsumer')
const { json } = require('express')

class SourceService {
    constructor() {
        this.extractionRequestPublisher = new ExtractionRequestPublisher('amqp://localhost')
        this.etractionResultConsumer = new ExtractionResultConsumer(
            'amqp://localhost',
            message => this._handleResult(JSON.parse(message.content.toString())))

        setInterval(this.startExtraction, 1800000)
        this.startExtraction()
    }

    async startExtraction() {
        Source.find({})
            .then(sources => { sources.forEach(this._extract) })
    }

    async _extract(source) {
        this.extractionRequestPublisher.publish(Buffer.from(JSON.stringify(source)))
    }

    _handleResult(articles) {

    }
}

module.exports = SourceService