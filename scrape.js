const fetch = require('node-fetch')
const _ = require('lodash')

const { parsePrice } = require('./lib/parse')

class Scraper {
  constructor(retailer) {
    this.retailer = retailer
    this.settings = []
    this.scrapedProducts = []
    this.mappedProducts = []
    this.filteredProducts = []
    this.enhancedProducts = []
    this.submitSuccesses = []
    this.submitFailures = []
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
  async begin(){
    await this.getSettings()
    if (!this.settings.length) {
      console.log('Quitting - no settings found')
      return
    }
    await this.scrape()
    if (!this.scrapedProducts.length) {
      console.log('Quitting - no scraped products found')
      return
    }
    this.map()
    this.filter()
    this.enhance()
    await this.upload()
    await this.saveStats()
    console.log('Successes', this.submitSuccesses.length)
    console.log('Failures', this.submitFailures.length)
  }
  async getSettings() {
    this.settings = await this.getData(`https://sharp-turing-d1c0f9.netlify.app/api/scrapesettings?retailer=${this.retailer}`)
  }
  async scrape() { console.log('Implement scrape') }
  map() {
    this.mappedProducts = this.scrapedProducts.map(p => this.mapProduct(p))
    // console.log(this.mappedProducts[0], 'First mapped product')
    console.log(this.mappedProducts.length, 'Mapped products')
  }
  mapProduct(p) { return p }
  filter() {
    this.filteredProducts = this.mappedProducts.filter(p => this.filterProduct(p))
    // console.log(this.filteredProducts[0], 'First filtered product')
    console.log(this.filteredProducts.length, 'Filtered products')
  }
  filterProduct(p) { return p }
  enhance() { 
    this.enhancedProducts = this.filteredProducts.map(p => this.enhanceProduct(p))
    // console.log(this.enhancedProducts[0], 'First enhanced product')
    console.log(this.enhancedProducts.length, 'Enhanced products')
  }
  enhanceProduct(p) { return p }
  async upload() {
    for (const i in this.enhancedProducts) {
      await this.uploadProduct(this.enhancedProducts[i])   
    }
  }
  async uploadProduct(p) {
    const res = await fetch('https://sharp-turing-d1c0f9.netlify.app/api/products', {
      method: 'put',
      body: JSON.stringify(p),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    if (res.status === 202) this.submitSuccesses.push({ ...data, status: res.status })
    else this.submitFailures.push({ ...data, status: res.status })
  }
  async saveStats() {
    const body = {
      "retailer": this.retailer,
      "category": this.settings[0].category,
      "totalProducts": this.scrapedProducts.length,
      "success": this.submitSuccesses.length,
      "failure": this.submitFailures.length,
    }
    const res = await fetch('https://sharp-turing-d1c0f9.netlify.app/api/scrapes', {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.status === 201) console.log('Saved stats')
    else console.log('Error saving stats')
  }
}

class MarksAndSpencerScraper extends Scraper {
  constructor(retailer) {
    super(retailer)
    this.site = "https://www.marksandspencer.com"
  }
  async paginate(url) {
    let allData = []
    let i = 0
    let count = 0
    do {
      i += 1
      const data = await this.getData(`${this.site}${url}&page=${i}`)
      if (data.abort) break
      count = data.count
      allData = [ ...allData, ..._.flatten(data.tiles)]
    } while (allData.length < count || i > 9)
    this.scrapedProducts = allData
  }
  async scrape() {
    console.log('SCRAPING M&S')
    console.log(this.settings)
    if(!this.settings || !this.settings[0]) return
    await this.paginate(this.settings[0].page)
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
    if (!item.isSale) return false
    return true
  }
  enhanceProduct(item) {
    const category = this.settings[0].category
    return {
      name: item.title,
      url: `${this.site}${item.url}`,
      badge: item.badge,
      price: item.reducedPrice.price,
      prevPrice: item.prevPrice.price,
      image: item.image,
      source: this.settings[0].page,
      retailer: this.retailer,
      category
    }
  }
  

}


const retailer = 'marksandspencer'
const x = new MarksAndSpencerScraper(retailer)

x.begin()



// name: { type: String, required: true },
// url: { type: String, required: true, unique: true },
// price: { type: String, required: false },
// prevPrice: { type: String, required: false },
// priceRange: { type: String, required: false },
// "disc%": { type: Number, required: false, default: 0 },
// "disc£": { type: Number, required: false, default: 0 },
// badge: { type: String, required: false },
// // prices: { type: mongoose.Schema.ObjectId, ref: 'Prices' },
// image: { type: String },
// source: { type: String },
// retailer: { type: String },
// category: { type: String },


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