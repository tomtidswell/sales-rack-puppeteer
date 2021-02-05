const fetch = require('node-fetch')
const { fetchConfig } = require('./lib/config')

// const retailer = 'marksandspencer'
// const retailer = 'johnlewis'
const retailer = process.argv[2]
if(!retailer) {
  console.log('Retailer argument required')
  return
}

const Scrape = {
  'marksandspencer': require('./retailers/marksandspencer'),
  'johnlewis': require('./retailers/johnlewis'),
  // 'dunelm': 
}
if (!Scrape[retailer]) {
  console.log('Could not determine retailer scraper')
  return
}

const retailerSites = {
  'marksandspencer': { 'site': 'https://www.marksandspencer.com', whitelist: [] },
  'johnlewis': { 'site': 'https://www.johnlewis.com', whitelist: ['document', 'script'] },
  'dunelm': { 'site': 'https://www.dunelm.com', whitelist: [] }
}
if (!retailerSites[retailer]) {
  console.log('Could not determine retailer config')
  return
}

// const configItems = [{
//   retailer: 'johnlewis',
//   category: 'tableware',
//   page: '/browse/clearance/home-garden-offers/tableware-offers/_/N-5nhq',
//   privacySelector: "button[data-test='allow-all']",
//   gridItemSelector: "div[data-test='component-grid-container'] > div[data-test='component-grid-column']",
// }]

;(async ()=>{
  const configItems = await fetchConfig(retailer)
  if (!configItems && !configItems.length) throw new Error('No config')

  for (const config of configItems) {
    const enhancedConfig = {...config, ...retailerSites[retailer]}
    // console.log(enhancedConfig)
    const scrape = new Scrape[retailer](enhancedConfig)
    // await scrape.begin()
  }
})()