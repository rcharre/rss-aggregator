const Publisher = require('./Publisher')

class ExtractionRequestPublisher extends Publisher {
    constructor(host) {
        super('extraction_requests', host)
    }
}

module.exports = ExtractionRequestPublisher