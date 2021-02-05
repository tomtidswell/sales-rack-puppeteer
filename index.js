const fetch = require('node-fetch')
const { fetchConfig } = require('./lib/config')
const jsdom = require("jsdom")

const scrapeRetailer = require('./scrape_puppeteer/scrape')

const { JSDOM } = jsdom

const retailer = 'johnlewis'


// const MarksAndSpencerScraper = require('./retailers/marksandspencer')
// const scrape = new MarksAndSpencerScraper(retailer)

const JohnLewisScraper = require('./retailers/johnlewis')

// const config = await fetchConfig(retailer)
const config = [{
  retailer: 'johnlewis',
  category: 'tableware',
  page: '/browse/clearance/home-garden-offers/tableware-offers/_/N-5nhq',
  privacySelector: "button[data-test='allow-all']",
  gridItemSelector: "div[data-test='component-grid-container'] > div[data-test='component-grid-column']",
}]
if (!config) throw new Error('No config') 

const scrape = new JohnLewisScraper(config)
scrape.begin()

const begin = async () => {

  const products = await scrapeRetailer(config)
  console.log(products.count)
  console.log(products.runtime)
  products.items.forEach((p,i)=>{
    if (i===0) console.log(p)
    const dom = new JSDOM(p)
    // const element = dom.window.document.querySelector("section[data-test='product-card']")
    const nameEl = dom.window.document.querySelector('div[data-test="product-title"]')
    const urlEl = dom.window.document.querySelector('a.product__image')
    const priceEl = dom.window.document.querySelector('div[class*="product-card__price"]')
    const badgeEl = dom.window.document.querySelector('p[class*="promo-messages"]')
    const imageEl = dom.window.document.querySelector('a.product__image img')
    const product = {
      name: nameEl ? nameEl.textContent : '',
      url: urlEl ? urlEl.href : '',
      price: priceEl ? priceEl.textContent : '',
      badge: badgeEl ? badgeEl.textContent : '',
      image: imageEl ? imageEl.src : '',
      source: config[0].page,
      retailer: config[0].retailer,
      category: config[0].category
    }
    console.log(product)

  })

}

// begin()



// source: { type: String },
// retailer: { type: String },
// category: { type: String },






// const fetchHtml = async ()=>{
//   const x = await fetch("https://www.johnlewis.com/browse/special-offers/home-garden-offers/tableware-offers/_/N-ej3", {
//     "headers": {
//       "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//       "accept-language": "en-GB,en;q=0.9,de;q=0.8,es;q=0.7",
//       "cache-control": "max-age=0",
//       "if-none-match": "W/\"3e411-mrQyivuly3BbUbWopSvqzE5DlEI\"",
//       "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
//       "sec-ch-ua-mobile": "?0",
//       "sec-fetch-dest": "document",
//       "sec-fetch-mode": "navigate",
//       "sec-fetch-site": "same-origin",
//       "sec-fetch-user": "?1",
//       "upgrade-insecure-requests": "1",
//       "cookie": "mt.v=5.2057623289.1570474782896; testVersion=versionA; LBNSC_ID=:storeb22:j03:store22; JSESSIONID=00005dACF8mIIYxR1fKAzaovonA:storeb22; ens_safAttr=81; ens_session=1; _abck=D097A1A84A0E8F226A3EBB2569635CC1~0~YAAQDyYRAoumzER2AQAA2qJ4rwVV+Leuev6PONJi496E6bBHv4eQDS4FYzuVSwtPpgwT0tZLNrhWZjzyLPOwNKxOWi6NvVjbxEKsSmcYk2W04l4tHCKXTCxzIKefJ1ZpVkQhNlUp0AIXrv9YIhjFuPBQyzPH12xnQTCfdMPTaAjyeQ0iNqraW9hoiGh0L2pQIjvlysrZCqNgldGzEaWXqt3bRcLMoJMp0x0sDTRraBCZYU7bcNnocSx0jeUQQ33xFQPv0IM7UFSHMEIuR3XvJ/tc82mE52UJAAJTt3m3cvmgR0UozKWuPKWczKWRTPd+trbsyzVQHvacwOh8M8UExaM8l5Z1pqBOGQ==~-1~||-1||~-1; JOHNLEWIS_ENSIGHTEN_PRIVACY_BANNER_VIEWED=1; JOHNLEWIS_ENSIGHTEN_PRIVACY_Advertising=1; JOHNLEWIS_ENSIGHTEN_PRIVACY_Analytics=1; JOHNLEWIS_ENSIGHTEN_PRIVACY_Essentials=1; JOHNLEWIS_ENSIGHTEN_PRIVACY_Functional=1; JOHNLEWIS_ENSIGHTEN_PRIVACY_Personalisation=1; s_fid=0CE7B38DCBEBB905-2E63659B777D0164; s_emuid=E963AFA5A5E94C3792FB9DEA174E1CE5; s_emcid=JLE2767_CL_20201226_; s_cc=true; ensRRCookie=; sessionId=0ff7aa5c-edd0-4bc7-9a8a-c0499f510997; ensCustomFindingMethod=; ensnav=; recentSearchTerms=YmJxIGJydXNofmJicX5jdXNoaW9ufnJ1Zw==; rr_rcs=eF5jYSlN9kgxMje3tDRJ0zU0NDLQNUk2T9G1NEsx17VMNU1MNU40TE2zMODKLSvJTOEzsjTVNdQ1BACCbg4W; s_campaignm=localhost%3A8080; ABSHPB=1; bm_sz=3BB8C316123A44F4158BEA5E30EA424D~YAAQptLeraKwh2R3AQAAoNNUbgrFQ1ZEs2Ub7FCTizu3/5hRwsEwWM46XA5/18SC0AO5YINRX4uxwhJ+d511j8zOFInKSWZt8snvrwhZCwJyJUle/hsNiyMEHMqUwuBT5gheLIDwC6tYx60K/ZOlSGieKhb0N3suCakygyVltZNX1CeSMZWTL7LU8rtXLfZnFLjr; s_dfa=johnlewisonejlprod; recentlyViewedItems=prod:1535177sku:233746509isRoman:false%2Cprod:4273043sku:238065888isRoman:false%2Cprod:2359132sku:234875242isRoman:false%2Cprod:112586sku:232272854isRoman:false%2Cprod:1925402sku:234355263isRoman:false; ensFindingMethod=%7B%22method%22%3A%22internal%20link%22%7D; ensSearchEventData=; ecos.dt=1612463868071; ensReferringPageType=category%20page%7Cproduct%20list%20page%20grid; s_intcmp=ic_20210125_tableware_cp_fur_a_ab; gpv_pn=jl%3Aspecial%20offers%3Ahome%20%26%20garden%20offers%3Atableware%20offers%3Agrid; s_sq=%5B%5BB%5D%5D; s_ppvl=jl%253Aspecial%2520offers%253Ahome%2520%2526%2520garden%2520offers%253Atableware%2520offers%253Agrid%2C23%2C23%2C1001%2C1476%2C1001%2C1920%2C1080%2C1%2CL; bm_mi=7E0C0424B8270297753BE9F89185CCC7~cxYgInONpM20RK0sp/6A1DW876DgKfF4OoricZ2wgPgSKerJIMGOhyEFKNU3t06uSsoB2nBTfNCtkQ6/BP1xqYYrAN0Qlc9lJW7GfrsF0w3qzDYXnPlETtNSDDD9ycXYZc4isvTQD9bwe/juOGNlYroNMHlCL8COQFgg7SiGkbisfHLbpF0oZ50MhFDZiUwBJbV+ffsRUCD6m9jTFbDLdf5RGiy/h2JYchIA9csLJHH+E5mjngy6EHzMrEWI1Y5e5odggCDRFosRI6mfxlJxq+Mz61RHXjXEagi9vb+ysIJjU7JSpA4hEsrysQOH1k0G; bm_sv=9A5FD8C61302B92C10C46CF946830286~VHPfpeiKWIFGs8rzm+9M0XhOfirM9QZVoua1Jq7e28dzq7KrSiPsOA83prBFRkhW2fg9AlxWVxpyYk68bak1g1G2udDaPIBqSbuSCUxH9Lpl95LE6Oz+2l08j+5q7vaE6eLTnvJ8/OME0yt3zMGO0YduMlvL6o9rtlfErwEfb98=; ak_bmsc=B97295B17445BD4F5CE9651BBDE9FD7BADDED2A680670000AC3E1C609166D851~plVX8+QHsyVgl7aD/rfnYRD7nnYfjl87+QbIiOEE9qOJj5YVqUQ0Id1FOu57HpX4zneoIrbIbM+Y35k+YR/CmZa/MYxk1fgxnN4/btdZGVAWt4377T/3jGlrTT2xTPYNtIUYRuxDWGpTBJwYE0jrwSe4jlp8L2lSlj0kpml0rjbRNnPIa8ymN1PyZGeCzgUjLETDlfn7YIPkMmfZW2T/qrS27ZGAY70r5kdCoKbgavoSR6+D4tl0Z7lZSU5MWR88Bs+9EojqrfPeCBTQzBTim4W44Wtg5Fx5Ngnb77/gH2i9oAr38dL5XUBtKW/K0RrdnWAC9GyMvtXUwbIhr3FNvDSNEjYwe/NQwpVNIEMFDvzb4=; s_ppv=jl%253Aspecial%2520offers%253Ahome%2520%2526%2520garden%2520offers%253Atableware%2520offers%253Agrid%2C23%2C41%2C2566%2C892%2C1001%2C1920%2C1080%2C1%2CLP"
//     },
//     "referrerPolicy": "strict-origin-when-cross-origin",
//     "body": null,
//     "method": "GET",
//     "mode": "cors"
//   })
//   return await x.text()
// }

// const scrape = async () => {
//   const html = await fetchHtml()
//   console.log(html)
//   const dom = new JSDOM(html)
//   const elements = dom.window.document.querySelectorAll("section[data-test='product-card']")

//   elements.forEach(el=> {
//     console.log(el.innerHTML)
//   })
//   console.log(elements.length)
  
// }

// scrape()