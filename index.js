const puppeteer = require('puppeteer')

const { fetchGridItems, handlePrivacy, handleOnPagePagination } =require('./lib/scrapeFunctions')
const url = 'https://www.marksandspencer.com/l/offers/sale/home-sale'
// const url = 'https://www.marksandspencer.com/cabin-4-wheel-hard-suitcase-with-security-zip/p/hbp22462792?color=CRANBERRY'


const interceptRequests = async page => {
  await page.setRequestInterception(true)
  page.on('request', req=>{
    const whitelist = ['document', 'script', 'xhr', 'fetch', 'image']
    const type = req.resourceType()
    // console.log(type)
    whitelist.includes(type) ? req.continue() : req.abort()
  })
}



const scrollTopToBottom = async page => {
  await page.evaluate('window.scrollTo(0,0)')
  let pageHeight = 0
  let scrolledTo = 0
  let portion = 0
  do {
    pageHeight = await page.evaluate('document.body.clientHeight')
    scrolledTo = await page.evaluate('pageYOffset')
    await page.evaluate('window.scrollBy(0,400)')
    portion = scrolledTo / pageHeight
    console.log(portion)
  } while (portion < 0.99)
}


puppeteer.launch()//{headless: false})
  .then(async browser => {
    const page = await browser.newPage()
    await interceptRequests(page)
    await page.goto(url, {waitUntil: 'networkidle0'})
    // const html = await page.content()
    
    // intercept all image loads and kill them - this should really speed up the page

    await handlePrivacy(page, '.privacy_prompt_footer #consent_prompt_submit')

    await handleOnPagePagination(page, 'div.grid__load-more > a')

    await scrollTopToBottom(page)
    
    await page.waitForTimeout(5000)

    const items = await fetchGridItems(page, 'ul.grid > li')
    console.log('Found', items.length, 'products')

    
    
    const time = new Date().getTime()
    await page.screenshot({ path: `./screenshots/${time}.png`})
    await browser.close()
  })

// console.log('hello')