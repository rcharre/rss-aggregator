export default class Service {
    constructor(http, collectionName) {
        this.http = http
        this.collectionName = collectionName
    }

    findAll(page = 0, size = 10) {
        return this.http.get(`${this.collectionName}/?page=${page}&size=${size}`)
    }
}