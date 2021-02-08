const fetch = require('node-fetch')
const DataScraper = require('../scrape_http/main')
const { parsePrice, addDiscounts } = require('../lib/parse')
const { identifyCategory } = require('../lib/category')
const _ = require('lodash')

class MarksAndSpencerScraper extends DataScraper {
  constructor(retailer) {
    super(retailer)
  }
  async getData(url) {
    try {
      const res = await fetch(url)
      return await res.json()
    } catch (error) {
      console.log('Triggered:', error.message)
      return { abort: true }
    }
  }
  async paginate(url) {
    let allData = []
    let i = 0
    let count = 0
    do {
      i += 1
      const data = await this.getData(`${url}&page=${i}`)
      if (data.abort) break
      count = data.count
      allData = [ ...allData, ..._.flatten(data.tiles)]
    } while (allData.length < count || i > 9)
    this.scrapedProducts = allData
  }
  async scrape() {
    console.log('SCRAPING M&S')
    console.log(this.config)
    console.log(`${this.config.site}${this.config.page}`)
    if(!this.config) return
    await this.paginate(`${this.config.site}${this.config.page}`)
  }
  mapProduct(item) {
    const { title, url, price: sourcePrice, image, promotionText: badge, rating, swatchList } = item.data

    return {
      title, url, badge, sourcePrice,
      isSale: sourcePrice.saleFlag,
      retailPrice: parsePrice(sourcePrice.retail),
      salePrice: parsePrice(sourcePrice.sale),
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
    const category = identifyCategory(item.title) || this.config.category
    
    const { retailPrice, salePrice } = item
    
    let prices = {
      price: salePrice.price || retailPrice.price
    }
    // only add a previous price if it exists, and if its different from the current price
    if (retailPrice.price && prices.price !== retailPrice.price) prices.prevPrice = retailPrice.price
    // add a price range only if one exists
    if (salePrice.priceRange || retailPrice.priceRange) prices.priceRange = salePrice.priceRange || retailPrice.priceRange
    // only calculate discounts if a price and prev price exist
    if (prices.price && prices.prevPrice) prices = addDiscounts(prices)
    
  
    console.log('----')
    console.log('Parsed sale', salePrice)
    console.log('Parsed retail', retailPrice)
    console.log('Output', prices)
    return {
      name: item.title,
      url: `${this.config.site}${item.url}`,
      badge: item.badge,
      // price: item.currentPrice.price,
      // priceRange: item.currentPrice.priceRange,
      // prevPrice: item.prevPrice.price,
      // 'disc£': item.prevPrice.price,
      // 'disc%': item.prevPrice.price,
      image: item.image,
      source: this.config.page,
      retailer: this.config.retailer,
      category
    }
  }
}

module.exports = MarksAndSpencerScraper







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