const puppeteer = require('puppeteer')
const ScrapeFunc = require('../lib/scrapeFunctions')

// const retailer = 'johnlewis'
// const retailerSites = {
//   'marksandspencer': { 'site': 'https://www.marksandspencer.com', whitelist: ['document', 'script', 'xhr', 'fetch', 'image'] },
//   'johnlewis': { 'site': 'https://www.johnlewis.com', whitelist: ['document', 'script'] },
//   'dunelm': { 'site': 'https://www.dunelm.com', whitelist: [] }
// }
// const scrapeRetailer = async (config) => {
//   config.whitelist = retailerSites[retailer].whitelist
//   config.pageUrl = `${retailerSites[retailer].site}${config.page}`
//   const results = await scrapePage(config).catch(err => {
//     throw new Error('Scrape error', err)
//   })
//   return results
// }

const scrapePage = async config => {
  console.log('Puppeteer scraping:', config.page)
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
  await ScrapeFunc.interceptRequests(page, whitelist)
  await ScrapeFunc.navigateTo(page, `${config.site}${config.page}`)    
  // if (privacySelector) await ScrapeFunc.handlePrivacy(page, privacySelector)
  // if (paginationSelector) await ScrapeFunc.handleOnPagePagination(page, paginationSelector)
  await ScrapeFunc.scrollTopToBottom(page)
  // await ScrapeFunc.waitMilliseconds(page, 3000)

  console.log('Fetching items')
  const items = await ScrapeFunc.fetchGridItems(page, gridItemSelector).catch(err=>console.log('Error:',err)) 
  console.log('Items:', items.length)
  // await page.screenshot({ path: `./screenshots/${new Date().getTime()}.png`})
  await browser.close()
  const timeDiff = new Date(new Date() - startTime)
  return {
    runtime: timeDiff.getUTCSeconds(),
    count: items ? items.length : 0,
    items
  }
}


module.exports = scrapePage
