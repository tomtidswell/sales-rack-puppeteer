function parsePrice(text='') {
    text = text.replace('&pound;', '£')
    let result = /(?<=£)(?<price>[0-9.]+)/.exec(text)
    const price = (result && result.groups) ? parseFloat(result.groups.price).toFixed(2) : null
    if (isRange(text)) return { price, priceRange: text }
    if (price) return { price }
    return {}
}

const isRange = (text='') => text.includes('-')

const parsePriceSentence = (string = '') => {
    let prices = string.match(/[\d\.]+/g) || []
    return {
        prices,
        count: prices.length,
        first: prices[0],
        last: prices[prices.length - 1],
    }
}

function parseDiscount(text='') {
    let result = /(?<discount>\d{1,2})(?=%)/.exec(text)
    return (result && result.groups) ? result.groups.discount : 0
}

module.exports = {
    parsePrice,
    parseDiscount,
    parsePriceSentence
}
