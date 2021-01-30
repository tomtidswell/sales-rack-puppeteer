const fetch = require('node-fetch')

const fetchConfig = async retailer => {
  const res = await fetch(`https://sharp-turing-d1c0f9.netlify.app/api/scrapesettings?retailer=${retailer}`)
  return await res.json()
  // console.log(config)
}

module.exports = {fetchConfig}