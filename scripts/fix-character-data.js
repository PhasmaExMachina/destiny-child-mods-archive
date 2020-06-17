const fs = require('fs'),
      path = require('path'),
      characters = require('../src/data/characters.json')

Object.keys(characters).forEach(code => {
  characters[code] = characters[code] || {}
  characters[code].code = characters[code].code || code
  characters[code].variants = characters[code].variants || {}
  characters[code].variants[variant] = characters[code].variants[variant] || {}
  characters[code].variants[variant].mods = characters[code].variants[variant].mods || []
})

fs.writeFileSync(path.join(__dirname, '../src/data/characters.json'), JSON.stringify(characters, null, 2))