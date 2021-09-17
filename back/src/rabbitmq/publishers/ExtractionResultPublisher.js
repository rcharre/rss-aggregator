const Publisher = require('./Publisher')

class ExtractionResultPublisher extends Publisher {
    constructor(host) {
        super('extraction_results', host)
    }
}

module.exports = ExtractionResultPublisher