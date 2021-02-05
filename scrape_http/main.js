const fetch = require('node-fetch')

class DataScraper {
  constructor(config) {
    this.config = config
    this.scrapedProducts = []
    this.mappedProducts = []
    this.filteredProducts = []
    this.enhancedProducts = []
    this.submitSuccesses = []
    this.submitFailures = []
  }
  async begin() {
    await this.scrape()
    if (!this.scrapedProducts.length) {
      console.log('Quitting - no scraped products found')
      return
    }
    this.map()
    this.filter()
    this.enhance()
    // console.log('Final products', this.enhancedProducts)
    await this.upload()
    await this.saveStats()
    console.log('Successes', this.submitSuccesses.length)
    console.log('Failures', this.submitFailures)
    console.log('DONE')
  }
  async scrape() { console.log('Implement scrape') }
  map() {
    this.mappedProducts = this.scrapedProducts.map(p => this.mapProduct(p))
    console.log(this.mappedProducts[0], 'First mapped product')
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
    console.log(this.enhancedProducts[0], 'First enhanced product')
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
    if (res.status === 202) {
      console.log('SUCCESS', p.name)
      this.submitSuccesses.push({ ...data, status: res.status })
    }
    else {
      console.log('FAILURE', p.name, )
      this.submitFailures.push({ ...data, status: res.status })
    }
  }
  async saveStats() {
    const body = {
      "retailer": this.config.retailer,
      "category": this.config.category,
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

module.exports = DataScraper



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