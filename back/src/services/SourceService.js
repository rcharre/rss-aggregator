const puppeteer = require('puppeteer')
const Article = require('../domain/Article')
const Source = require('../domain/Source')

class SourceService {
    constructor() {
        setInterval(() => {
            this.startExtraction()
        }, 1800000)
    }

    async startExtraction() {
        Source.find({})
            .then(sources => {
                sources.forEach(source => this._extract(source))
            })
    }

    async _extract(source) {
        console.log("Start extraction of source " + source.name)
        let result = []
        let browser = await puppeteer.connect({
            browserWSEndpoint: 'ws://localhost:3000'
        })

        let pages = await browser.pages
        let page = pages.length > 0 ? pages[0] : await browser.newPage()

        await page.goto(source.url)
        try {
            let articles = await page.evaluate(this._extractFromPage, source.parsing)
            for (const scrappedArticle of articles) {
                const existing = await Article.findOne({
                    url: scrappedArticle.url
                })
                if (!!existing) continue
                let article = new Article({
                    ...scrappedArticle,
                    source: source
                })
                await article.save()
                result.push(article)
                console.log("Added article " + article.title)
            }
            console.log("Extraction finished successfully, added " + result.length + " articles")
        } catch (e) {
            console.error(e)
        }

        browser.close()
        return result
    }

    async _extractFromPage(parsing) {
        const elements = [...document.querySelectorAll(parsing.articleQuery)]
        let result = []
        for (el of elements) {
            let article = {
                title: el.querySelector(parsing.titleQuery)?.textContent,
                url: el.querySelector(parsing.urlQuery)?.getAttribute('href'),
                authors: [...el.querySelectorAll(parsing.authorQuery)]?.map(authorEl => authorEl?.textContent),
            }
            result.push(article)
        }
        return result
    }
}
module.exports = SourceService