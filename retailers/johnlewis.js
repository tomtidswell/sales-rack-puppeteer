
const DataScraper = require('../scrape_http/main')
const PuppeteerScraper = require('../scrape_puppeteer/scrape')
const { parsePrice } = require('../lib/parse')
const _ = require('lodash')

class JohnLewisScraper extends DataScraper {
  constructor(config) {
    super(config)
    this.site = "https://www.johnlewis.com"
  }
  async scrape() {
    console.log('SCRAPING JL')
    console.log(this.config)
    if(!this.config || !this.config[0]) return

    const products = await PuppeteerScraper(this.config)
    console.log(products.count)
    console.log(products.runtime)
    console.log(products.items)
    this.scrapedProducts = []//products.items
  }
  mapProduct(item) {
    const { title, url, price: sourcePrice, image, promotionText: badge, rating, swatchList } = item.data
    return {
      title, url, badge, sourcePrice,
      isSale: sourcePrice.saleFlag,
      prevPrice: parsePrice(sourcePrice.retail),
      reducedPrice: parsePrice(sourcePrice.sale),
      image: _.get(image, 'urls.base'),
      rating: _.get(rating, 'percentage'),
      variants: _.get(swatchList, 'available')
    }
  }
  filterProduct(item) {
    // if (!item.isSale) return false
    return true
  }
  enhanceProduct(item) {
    const category = this.config[0].category
    return {
      name: item.title,
      url: `${this.site}${item.url}`,
      badge: item.badge,
      price: item.reducedPrice.price,
      prevPrice: item.prevPrice.price,
      image: item.image,
      source: this.config[0].page,
      retailer: this.config[0].retailer,
      category
    }
  }
}

module.exports = JohnLewisScraper







// M&S sample json 
// template = {
//   title: 'Percale Flat Sheet',
//   brand: '',
//   wineAwardUrl: false,
//   productAwards: false,
//   productId: 'P22319604',
//   upc: '05994533',
//   promotionText: 'Sale on selected items',
//   isSalePrice: true,
//   outOfStock: false,
//   swatchList: { available: 13, swatches: [Array] },
//   price: {
//     retail: '',
//     sale: '&pound;7.00 - £19.50',
//     perUnit: '',
//     saleFlag: true
//   },
//   rating: { percentage: 88.6, text: '4.43' },
//   url: '/percale-flat-sheet/p/hbp22319604?color=WHITE',
//   badge: null,
//   image: { urls: [Object] }
// }