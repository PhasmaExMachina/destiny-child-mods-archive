const fs = require('fs'),
      path = require('path'),
      characters = require('../src/data/characters.json')

fs.mkdirSync(path.join(__dirname, '../tmp'), {recursive: true})

const missing = {}

Object.keys(characters).sort().forEach(code => {
  Object.keys(characters[code].variants).forEach(variantId => {
    characters[code].variants[variantId].mods.forEach(hash => {
      if(!fs.existsSync(path.join(__dirname, '../docs/characters/' + code + '_' + variantId + '/' + hash + '/static.png')) &&
         fs.existsSync(path.join(__dirname, '../docs/characters/' + code + '_' + variantId + '/' + hash + '/model.json'))
      ) {
        missing[code] = missing[code] || {}
        missing[code].variants = missing[code].variants || {}
        missing[code].variants[variantId] = missing[code].variants[variantId] || {}
        missing[code].variants[variantId].mods = missing[code].variants[variantId].mods || []
        missing[code].variants[variantId].mods.push(hash)
      }
      else {
        try {
          fs.unlinkSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + hash + '/preview-cropped.png'))
        } catch(e) {}
        try {
          fs.unlinkSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + hash + '/preview.png'))
        } catch(e) {}
      }
    })
  })
})

fs.writeFileSync(path.join(__dirname, '../tmp/missing-previws.json'), JSON.stringify(missing, null, 2))