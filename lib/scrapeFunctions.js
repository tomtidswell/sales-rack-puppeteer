
const fetchGridItems = async (page, selector) => {
  return await page.$$(selector, options => {
    return options.map(option => option)
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

module.exports = { 
  fetchGridItems,
  handlePrivacy,
  handleOnPagePagination
}