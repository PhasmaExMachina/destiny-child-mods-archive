const fs = require('fs'),
      path = require('path'),
      mergeDirs = require('merge-dirs').default,
      characters = require('../src/data/characters.json'),
      modders = require('../src/data/modders.json')

const docsPath = path.join(__dirname, '../docs'),
      docsDataPath = path.join(docsPath, 'data'),
      srcPath = path.join(__dirname, '../src'),
      srcDataPath = path.join(srcPath, 'data')

// copy buid to docs
fs.rmdirSync(path.join(docsPath, 'static'), {recursive: true})
fs.readdirSync(docsPath).forEach(file => {
  if(file.match(/^precache/)) {
    fs.unlinkSync(path.join(docsPath, file))
  }
})
mergeDirs(path.join(__dirname, '../build'), docsPath, 'overwrite')
fs.copyFileSync(path.join(srcDataPath, 'mods.json'), path.join(docsDataPath, 'mods.json'))
fs.copyFileSync(path.join(srcDataPath, 'characters.json'), path.join(docsDataPath, 'characters.json'))

const copyIndexHtmlToDocs = p => {
  fs.mkdirSync(path.join(docsPath, p), {recursive: true})
  fs.copyFileSync(path.join(__dirname, '../docs/index.html'), path.join(docsPath, p, 'index.html'))
}

copyIndexHtmlToDocs('childs')
copyIndexHtmlToDocs('modders')

// create child HTML files
Object.keys(characters).forEach(code => {
  Object.keys(characters[code].variants).forEach(variant => {
    const codePath = path.join(__dirname, '../docs/characters/' + code),
          variantPath = path.join(codePath, variant)
          fs.mkdirSync(variantPath, {recursive: true})
    copyIndexHtmlToDocs('characters/' + code + '/' + variant)
    copyIndexHtmlToDocs('characters/' + code)
  })
})

// create modder HTML files
Object.keys(modders).forEach(modder => {
  modder = encodeURIComponent(modder)
  const modderPath = path.join(__dirname, '../docs/modders/' + modder)
  fs.mkdirSync(modderPath, {recursive: true})
  copyIndexHtmlToDocs('modders/' + modder)
})
