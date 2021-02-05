const puppeteer = require('puppeteer')
const ScrapeFunc = require('../lib/scrapeFunctions')

const retailer = 'johnlewis'


// const url = 'https://www.marksandspencer.com/l/offers/sale/home-sale'
// const url = 'https://www.marksandspencer.com/cabin-4-wheel-hard-suitcase-with-security-zip/p/hbp22462792?color=CRANBERRY'

const retailerSites = {
  'marksandspencer': { 'site': 'https://www.marksandspencer.com', whitelist: ['document', 'script', 'xhr', 'fetch', 'image'] },
  'johnlewis': { 'site': 'https://www.johnlewis.com', whitelist: ['document', 'script'] },
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
  await ScrapeFunc.interceptRequests(page, whitelist)
  await ScrapeFunc.navigateTo(page, pageUrl)    
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


const scrapeRetailer = async (configs) => {
  const results = []
  for (const config of configs){
    config.whitelist = retailerSites[retailer].whitelist
    config.pageUrl = `${retailerSites[retailer].site}${config.page}`
    const pageResults = await scrapePage(config).catch(err=>{
      throw new Error('Scrape error', err) 
    })
    console.log('Page results',pageResults.length)
    results.push(pageResults)
    break
    // merge results back together
  }
  // console.log('All results',results.length)
  // console.log('All results',results.length)
  return results[0]
}



module.exports = scrapeRetailer

// app.use('/scr',(req,res)=>{
//   scrapeRetailer()
//     .then(result => res.status(200).json(result))
//     .catch(err => res.status(500).json(err))

// })

// app.use('*',(req,res)=>{
//   res.sendStatus(404)
// })


// const serverlessMode = true

// if (serverlessMode) module.exports.handler = serverless(app)
// else app.listen(7000, () => console.log(`Listening on port ${7000}`))