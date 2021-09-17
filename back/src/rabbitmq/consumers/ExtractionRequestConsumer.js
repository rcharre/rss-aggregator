const Consumer = require("./Consumer")

class ExtractionRequestConsumer extends Consumer {
    constructor(host, consumer) {
        super('extraction_requests', host, consumer)
    }
}

module.exports = ExtractionRequestConsumer