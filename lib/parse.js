function parsePrice(text='') {
    text = text.replace('&pound;', '£')
    const isRange = text.includes('-')
    let result = /(?<=£)(?<price>[0-9.]+)/.exec(text)
    const price = (result && result.groups) ? parseFloat(result.groups.price).toFixed(2) : null
    if (isRange) return { price, priceRange: text }
    if (price) return { price }
    return {}
}

function parseDiscount(text='') {
    let result = /(?<discount>\d{1,2})(?=%)/.exec(text)
    return (result && result.groups) ? result.groups.discount : 0
}

module.exports = {
    parsePrice,
    parseDiscount
}
