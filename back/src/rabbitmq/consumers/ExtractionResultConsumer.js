const Consumer = require("./Consumer")

class ExtractionResultConsumer extends Consumer {
    constructor(host, consumer) {
        super('extraction_results', host, consumer)
    }
}

module.exports = ExtractionResultConsumer