
const DataScraper = require('../scrape_http/main')
const PuppeteerScraper = require('../scrape_puppeteer/scrape')
const { parsePrice, parsePriceSentence } = require('../lib/parse')
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const _ = require('lodash')

class JohnLewisScraper extends DataScraper {
  constructor(config) {
    super(config)
  }
  async scrape() {
    console.log('SCRAPING JL')
    console.log(this.config)
    if(!this.config) return

    const products = await PuppeteerScraper(this.config)
    console.log(products.count)
    console.log(products.runtime)
    // console.log(products.items)
    this.scrapedProducts = products.items
  }
  mapProduct(p) {
    const dom = new JSDOM(p)
    const nameEl = dom.window.document.querySelector('div[data-test="product-title"]')
    const urlEl = dom.window.document.querySelector('a.product__image')
    const priceEl = dom.window.document.querySelector('div[class*="product-card__price"]')
    const badgeEl = dom.window.document.querySelector('p[class*="promo-messages"]')
    const imageEl = dom.window.document.querySelector('a.product__image img')
    return {
      name: nameEl ? nameEl.textContent : '',
      url: urlEl ? urlEl.href : '',
      price: priceEl ? priceEl.textContent : '',
      badge: badgeEl ? badgeEl.textContent : '',
      image: imageEl ? imageEl.src : '',
      source: this.config.page,
      retailer: this.config.retailer,
      category: this.config.category
    }
  }
  filterProduct(item) {
    if (!item.name) return false
    return true
  }
  enhanceProduct(item) {
    const price = parsePriceSentence(item.price)
    console.log(price)
    const product = {
      name: item.name,
      url: `${this.config.site}${item.url}`,
      badge: item.badge,
      price: price.last,
      prevPrice: price.first !== price.last ? price.first : '',
      image: `https:${item.image}`,
      source: this.config.page,
      retailer: this.config.retailer,
      category: this.config.category
    }
    return product
  }
}

module.exports = JohnLewisScraper

