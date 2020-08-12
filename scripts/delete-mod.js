const fs = require('fs'),
      path = require('path'),
      rimraf = require("rimraf"),
      characters = require('../src/data/characters.json'),
      mods = require('../src/data/mods.json'),
      modders = require('../src/data/modders.json')

const hash = process.argv[2]

console.log('Deleting', hash)

const mod = mods[hash],
      character = characters[mod.code],
      variant = character.variants[mod.variant]

variant.mods.splice(variant.mods.indexOf(hash), 1)
delete mods[hash]

Object.keys(modders).forEach(modder => {
  if(modders[modder].mods.indexOf(hash) > -1)
    modders[modder].mods.splice(modders[modder].mods.indexOf(hash), 1)
  if(modders[modder].modsUsingAssets.indexOf(hash) > -1)
    modders[modder].modsUsingAssets.splice(modders[modder].modsUsingAssets.indexOf(hash), 1)
})

rimraf.sync(path.join(__dirname, '../docs/characters/' + mod.code + '_' + mod.variant + '/' + hash))
fs.writeFileSync(path.resolve(__dirname, '../src/data/mods.json'), JSON.stringify(mods, null, 2))
fs.writeFileSync(path.resolve(__dirname, '../src/data/characters.json'), JSON.stringify(characters, null, 2))
fs.writeFileSync(path.resolve(__dirname, '../src/data/modders.json'), JSON.stringify(modders, null, 2))