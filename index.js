
const MarksAndSpencerScraper = require('./data_scraper/marksandspencer')


const retailer = 'marksandspencer'
const scrape = new MarksAndSpencerScraper(retailer)

scrape.begin()

