import Service from "./Service"

export default class ArticleService extends Service {
    constructor(http) {
        super(http, 'articles')
    }
}