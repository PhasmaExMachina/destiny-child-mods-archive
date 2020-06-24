const fs = require('fs'),
      path = require('path'),
      gm = require('gm'),
      characters = require('../src/data/characters.json')

fs.mkdirSync(path.join(__dirname, '../tmp'), {recursive: true})

const missingCroppedThumb = []

Object.keys(characters).sort().forEach(model => {
  Object.keys(characters[model].variants).sort().forEach(variantId => {
    characters[model].variants[variantId].mods.forEach(hash => {
      if(fs.existsSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + hash + '/preview.png')) &&
        !fs.existsSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + hash + '/static.png'))
      ) {
          missingCroppedThumb.push(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + hash + '/preview.png'))
      }
    })
  })
})

const processCroppedThumb = i => {
  const previewPath = missingCroppedThumb[i]
  gm(previewPath)
    .trim()
    .filter('Point')
    .scale(350, 350)
    .dither(false)
    .colors(100)
    .quality(90)
    .write(previewPath.replace('preview.png', 'static.png'), e => {
      if(e) { throw e }
      else {
        console.log('cropped-thumb', previewPath)
        if(i < missingCroppedThumb.length - 2) processCroppedThumb(i + 1)
      }
    })
}
if(missingCroppedThumb.length) processCroppedThumb(0)

