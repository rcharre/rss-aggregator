const puppeteer = require('puppeteer')
const ExtractionRequestConsumer = require('./src/rabbitmq/consumers/ExtractionRequestConsumer')
const ExtractionResultPublisher = require('./src/rabbitmq/publishers/ExtractionResultPublisher')

const amqpHost = 'amqp://localhost'

const extractionResultPublisher = new ExtractionResultPublisher(amqpHost)

async function extract(source) {
    console.log("Start extraction of source " + source.name)
    let browser = await puppeteer.connect({
        browserWSEndpoint: 'ws://localhost:3000'
    })

    let pages = await browser.pages
    let page = pages.length > 0 ? pages[0] : await browser.newPage()

    await page.goto(source.url)
    try {
        let articles = await page.evaluate(extractFromPage, source.parsing)
        for (const scrappedArticle of articles) {
            const existing = await Article.findOne({
                url: scrappedArticle.url
            })
            if (!!existing) continue
            scrappedArticle.source = source
            extractionResultPublisher.publish(scrappedArticle)
        }
    } catch (e) {
        console.error(e)
    }
    browser.close()
}

async function extractFromPage(parsing) {
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

function main() {
    const extractionRequestConsumer = new ExtractionRequestConsumer(
        amqpHost,
        message => {
            extract(JSON.parse(message.content.toString()))
        }
    )
}

main()