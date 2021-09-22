class PageRequest {
    constructor(page = 0, size = 10) {
        this.page = page
        this.size = size
    }

    fromRequest(request) {
        this.page = request.query.page | 0
        this.size = request.query.size | 10
    }

    toPaginate() {
        return {
            offset: this.page * this.size,
            limit: this.size
        }
    }
}

module.exports = PageRequest