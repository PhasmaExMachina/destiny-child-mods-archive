const fs = require('fs'),
      path = require('path'),
      gm = require('gm'),
      characters = require('../src/data/characters.json')

fs.mkdirSync(path.join(__dirname, '../tmp'), {recursive: true})

const missingCropped = [],
      missingCroppedThumb = []

Object.keys(characters).sort().forEach(model => {
  Object.keys(characters[model].variants).sort().forEach(variantId => {
    characters[model].variants[variantId].mods.forEach(modHash => {
      if(fs.existsSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + modHash + '/preview.png'))) {
        if(!fs.existsSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + modHash + '/preview-cropped.png'))) {
          missingCropped.push(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + modHash + '/preview.png'))
        }
        if(!fs.existsSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + modHash + '/preview-cropped-thumb.png'))) {
          missingCroppedThumb.push(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + modHash + '/preview.png'))
        }
      }
    })
  })
})

const processCropped = i => {
  const previewPath = missingCropped[i]
  gm(previewPath)
    .trim()
    .write(previewPath.replace('preview.png', 'preview-cropped.png'), e => {
      if(e) { throw e }
      else {
        console.log('cropped', previewPath)
        if(i < missingCropped.length - 2) processCropped(i + 1)
      }
    })
}
if(missingCropped.length) processCropped(0)

const processCroppedThumb = i => {
  const previewPath = missingCroppedThumb[i]
  gm(previewPath)
    .trim()
    .scale(400, 400)
    .compress('LZW')
    .write(previewPath.replace('preview.png', 'preview-cropped-thumb.png'), e => {
      if(e) { throw e }
      else {
        console.log('cropped-thumb', previewPath)
        if(i < missingCroppedThumb.length - 2) processCroppedThumb(i + 1)
      }
    })
}
if(missingCroppedThumb.length) processCroppedThumb(0)

