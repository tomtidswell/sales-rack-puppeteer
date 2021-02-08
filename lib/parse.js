function parsePrice(text='') {
    text = text.replace(/&pound;/g, '£')
    let result = /£?(?<price>[0-9.]+)/.exec(text)
    const price = (result && result.groups) ? parseFloat(result.groups.price).toFixed(2) : null
    if (isRange(text)) return { price, priceRange: text }
    if (price) return { price }
    return {}
}

const isRange = (str='') => str.includes('-')

const parsePriceSentence = (str = '') => {
    str = str.replace(/&pound;/g, '')
    str = str.replace(/£/g, '')
    // console.log(str)
    let prices = str.match(/[\d.\s-]{2,}/g) || []
    prices = prices.map(p=>p.trim())
    return {
        prices,
        containsRange: isRange(str),
        count: prices.length,
        first: prices[0],
        last: prices[prices.length - 1],
    }
}

function parseDiscount(text='') {
    let result = /(?<discount>\d{1,2})(?=%)/.exec(text)
    return (result && result.groups) ? result.groups.discount : 0
}

function addDiscounts(priceData = {}) {
    if (!priceData || !priceData.price || !priceData.prevPrice) return priceData
    return {
        ...priceData,
        'disc£': parseFloat((priceData.prevPrice - priceData.price).toFixed(2)),
        'disc%': Math.round(100 * priceData.price / priceData.prevPrice),
    }
}

module.exports = {
    parsePrice,
    parseDiscount,
    parsePriceSentence,
    addDiscounts
}
