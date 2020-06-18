const fs = require('fs'),
      path = require('path'),
      md5File = require('md5-file').sync,
      characters = require('../src/data/characters.json'),
      modHashes = require('../data/mod-hashes.json')

Object.keys(characters).forEach(code => {
  characters[code] = characters[code] || {}
  characters[code].code = characters[code].code || code
  characters[code].variants = characters[code].variants || {}
  // characters[code].variants[variant] = characters[code].variants[variant] || {}
  // characters[code].variants[variant].mods = characters[code].variants[variant].mods || []
})


// update mod hashes seen
const charactersPath = path.join(__dirname, '../docs/characters')
fs.readdirSync(charactersPath).forEach(charDir => {
  const [code, variant] = charDir.split('_'),
  charPath = path.join(charactersPath, charDir)
  fs.readdirSync(charPath).forEach(modHash => {
    characters[code] = characters[code] || {}
    characters[code].code = characters[code].code || code
    characters[code].variants = characters[code].variants || {}
    characters[code].variants[variant] = characters[code].variants[variant] || {}
    characters[code].variants[variant].mods = characters[code].variants[variant].mods || []
    if(characters[code].variants[variant].mods.indexOf(modHash) < 0) {
      characters[code].variants[variant].mods.push(modHash)
    }
    modHashes.pck[modHash] = true
    const modPath = path.join(charPath, modHash)
    if(code.match(/^sc/) && fs.existsSync(path.join(modPath, '00000002'))) {
      fs.renameSync(path.join(modPath, '00000002'), path.join(modPath, 'physics.json'))
    }
    const textureHash = fs.readdirSync(modPath).reduce((acc, file) => {
      if(file.match(/^texture.+\.png/)) acc += md5File(path.join(modPath, file))
      return acc
    }, '')
    modHashes.texture[textureHash] = true
  })
})

fs.writeFileSync(path.join(__dirname, '../src/data/characters.json'), JSON.stringify(characters, null, 2))
fs.writeFileSync(path.join(__dirname, '../data/mod-hashes.json'), JSON.stringify(modHashes, null, 2))