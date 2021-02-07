function parsePrice(text='') {
    text = text.replace('&pound;', '£')
    let result = /(?<=£)(?<price>[0-9.]+)/.exec(text)
    const price = (result && result.groups) ? parseFloat(result.groups.price).toFixed(2) : null
    if (isRange(text)) return { price, priceRange: text }
    if (price) return { price }
    return {}
}

const isRange = (str='') => str.includes('-')

const parsePriceSentence = (str = '') => {
    str = str.replace(/&pound;/g, '')
    str = str.replace(/£/g, '')
    console.log(str)
    let prices = str.match(/[\d.\s-]{2,}/g) || []
    prices = prices.map(p=>p.trim())
    return {
        prices,
        isRange: isRange(str),
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
