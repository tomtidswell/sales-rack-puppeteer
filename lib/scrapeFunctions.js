const fetchGridItems = async (page, selector) => {
  return await page.$$eval(selector, elements => {
    return elements.map(el => {
      return el.innerHTML
    })
  })
}

const handlePrivacy = async (page, selector) => {
  const privacy = await page.$(selector)
  if (!privacy) return false
  // const inner = await privacy.evaluate(node => node.innerText)
  // console.log(inner)
  await privacy.click()
}

const clickOnPagePagination = async (page, selector) => {
  const privacy = await page.$(selector)
  if (!privacy) return false
  // console.log('Pagination', await privacy.evaluate(node => node.innerText))
  await privacy.click()
  return true
}

const handleOnPagePagination = async (page, selector) => {
  let onPagePagination = true
  while (onPagePagination === true) {
    onPagePagination = await clickOnPagePagination(page, selector)
    await page.waitForTimeout(2000)
  }
}

const interceptRequests = async (page, whitelist) => {
  await page.setRequestInterception(true)
  page.on('request', req => {
    const type = req.resourceType()
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
    await page.evaluate('window.scrollBy(0,600)')
    portion = scrolledTo / pageHeight
    console.log(portion)
  } while (portion < 0.99)
}

const waitMilliseconds = async (page, time) => {
  await page.waitForTimeout(time)
}

const navigateTo = async (page, url) => {
  console.log('Navigating to', url)
  await page.goto(url, { waitUntil: 'networkidle0' })
}

module.exports = { 
  fetchGridItems,
  handlePrivacy,
  handleOnPagePagination,
  interceptRequests,
  scrollTopToBottom,
  waitMilliseconds,
  navigateTo
}