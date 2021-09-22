const puppeteer = require('puppeteer')
const ExtractionRequestConsumer = require('./src/rabbitmq/consumers/ExtractionRequestConsumer')
const ExtractionResultPublisher = require('./src/rabbitmq/publishers/ExtractionResultPublisher')

const amqpHost = 'amqp://localhost'
const browserHost = 'ws://localhost:3000'

const extractionResultPublisher = new ExtractionResultPublisher(amqpHost)

async function extract(source) {
    console.log("Start extraction of source " + source.name)
    let result = {
        articles: [],
        source: source,
        error: null
    }

    let browser = await puppeteer.connect({ browserWSEndpoint: browserHost })
    try {
        let pages = await browser.pages
        let page = pages.length > 0 ? pages[0] : await browser.newPage()

        await page.goto(source.url)
        result.articles = await page.evaluate(extractFromPage, source.parsing)
        console.log(`Finished extraction for source ${source.name}`)

    } catch (e) {
        console.error(e)
        result.error = e
    } finally {
        browser.close()
        extractionResultPublisher.publish(JSON.stringify(result))
    }

}

async function extractFromPage(parsing) {
    const elements = [...document.querySelectorAll(parsing.articleQuery)].reverse()
    let result = []
    for (el of elements) {
        window.scrollTo(el.offsetLeft, el.offsetTop)
        let article = {
            title: el.querySelector(parsing.titleQuery)?.textContent,
            url: el.querySelector(parsing.urlQuery)?.getAttribute('href'),
            authors: [...el.querySelectorAll(parsing.authorQuery)]?.map(authorEl => authorEl?.textContent),
            imageUrl: parsing.imageUrlQuery ? el.querySelector(parsing.imageUrlQuery)?.getAttribute('src') : null
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