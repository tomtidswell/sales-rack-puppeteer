const puppeteer = require('puppeteer')
const express = require('express')
const app = express()
const { fetchConfig } = require('./lib/config')
const Scrape = require('./lib/scrapeFunctions')

const retailer = 'marksandspencer'


// const url = 'https://www.marksandspencer.com/l/offers/sale/home-sale'
// const url = 'https://www.marksandspencer.com/cabin-4-wheel-hard-suitcase-with-security-zip/p/hbp22462792?color=CRANBERRY'

const retailerSites = {
  'marksandspencer': { 'site': 'https://www.marksandspencer.com', whitelist: ['document', 'script', 'xhr', 'fetch', 'image'] },
  'johnlewis': { 'site': 'https://www.johnlewis.com', whitelist: [] },
  'dunelm': { 'site': 'https://www.dunelm.com', whitelist: [] }
}


const scrapePage = async config => {
  console.log(config)
  if(!config) return
  const browser = await puppeteer.launch()//{headless: false})
  const {
    // retailer,
    // category,
    whitelist,
    pageUrl,
    privacySelector,
    gridItemSelector,
    paginationSelector
  } = config
  
  const startTime = new Date()
  const page = await browser.newPage()
  // intercept all image loads and kill them - this should really speed up the page
  await Scrape.interceptRequests(page, whitelist)
  await Scrape.navigateTo(page, pageUrl)    
  if (privacySelector) await Scrape.handlePrivacy(page, privacySelector)
  if (paginationSelector) await Scrape.handleOnPagePagination(page, paginationSelector)
  // await scrollTopToBottom(page)
  // await waitMilliseconds(page, 3000)

  console.log('Fetching items')
  const items = await Scrape.fetchGridItems(page, gridItemSelector).catch(err=>console.log('Error:',err)) 
  console.log('Items:', items)
  // await page.screenshot({ path: `./screenshots/${new Date().getTime()}.png`})
  await browser.close()
  const timeDiff = new Date(new Date() - startTime)
  return {
    runtime: timeDiff.getUTCSeconds(),
    count: items ? items.length : 0,
    items
  }
}


const scrapeRetailer = async () => {
  const retailerConfig = await fetchConfig(retailer)
  if (!retailerConfig) throw new Error('No config') 
  const results = []
  for (const config of retailerConfig){
    config.whitelist = retailerSites[retailer].whitelist
    config.pageUrl = `${retailerSites[retailer].site}${config.page}`
    const pageResults = await scrapePage(config).catch(err=>{
      throw new Error('Scrape error', err) 
    })
    console.log('Page results',pageResults)
    results.push(pageResults)
  }
  console.log('All results',results)
  return results
}





app.use('/scr',(req,res)=>{
  scrapeRetailer()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err))

})

app.use('*',(req,res)=>{
  res.sendStatus(404)
})



app.listen(7000, () => console.log(`Listening on port ${7000}`))