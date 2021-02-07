const keywords = {
  "duvet": "bedding",
  "towel": "textiles",
  "suitcase": "luggage",
  "light": "lighting",
  "throw": "textiles",

}

const maps = [
  { word: "duvet", category: "bedding" },
  { word: "pillow", category: "bedding" },
  { word: "sheet", category: "bedding" },
  { word: "bedding", category: "bedding" },
  { word: "mattress", category: "bedding" },
  { word: "towel", category: "textiles" },
  { word: "throw", category: "textiles" },
  { word: "suitcase", category: "luggage" },
  { word: "light", category: "lighting" },
  { word: "lamp", category: "lighting" },
  { word: "chandelier", category: "lighting" },
  { word: "fridge", category: "kitchen" },
  { word: "roast", category: "kitchen" },
  { word: "meat thermometer", category: "kitchen" },
  { word: "carving", category: "kitchen" },
  { word: "ricer", category: "kitchen" },
  { word: "saucepan", category: "kitchen" },
  { word: "frying pan", category: "kitchen" },
  { word: "casserole", category: "kitchen" },
  { word: "gravy boat", category: "tableware" },
  { word: "platter", category: "tableware" },
  { word: "dinner set", category: "tableware" },
  { word: "placemat", category: "tableware" },
  { word: "table runner", category: "tableware" },
  { word: "tablecloth", category: "tableware" },
  { word: "jigsaw puzzle", category: "games" },
  { word: "pedestal mat", category: "bathroom" },
  { word: "bath mat", category: "bathroom" },
  { word: "rug", category: "rugs" },
  { word: "curtain", category: "curtains" },
  { word: "cushion", category: "cushions" },
  { word: "christmas", category: "christmas" },
  { word: "advent", category: "christmas" },
  { word: "stocking", category: "christmas" },
  { word: "wreath", category: "christmas" },
  { word: "game", category: "games" },
  { word: "bbq", category: "garden" },
  { word: "face covering", category: "accessories" }
]

const identifyCategory = (name) => {
  for (let i in maps){
    if (name.toLowerCase().includes(maps[i].word))
      return maps[i].category
  }
}

module.exports = {identifyCategory}