const mongoose = require('mongoose')
const Source = require('./src/domain/Source')
const SourceService = require('./src/services/SourceService')

let sourceService = new SourceService()
let source = new Source({
    name: 'Le Monde - international',
    url: "https://www.lemonde.fr/international/",
    parsing: {
        articleQuery: ".thread",
        titleQuery: '.teaser__title',
        urlQuery: '.teaser__link',
        authorQuery: '.meta__author'
    }
})

async function main() {
    await mongoose.connect('mongodb://localhost:27017/test')
    await sourceService._extract(source)
}

main()
