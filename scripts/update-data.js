const fs = require('fs'),
      path = require('path'),
      md5File = require('md5-file').sync,
      characters = require('../src/data/characters.json'),
      mods = require('../src/data/mods.json'),
      modders = require('../src/data/modders.json'),
      modelInfoGlobal = require('../docs/data/model_info.global.json'),
      modelInfoKr = require('../docs/data/model_info.kr.json'),
      modelInfoJp = require('../docs/data/model_info.jp.json')
// Object.keys(characters).forEach(code => {
//   characters[code] = characters[code] || {}
//   characters[code].code = characters[code].code || code
//   characters[code].variants = characters[code].variants || {}
//   // characters[code].variants[variant] = characters[code].variants[variant] || {}
//   // characters[code].variants[variant].mods = characters[code].variants[variant].mods || []
// })

// update mod hashes seen
const charactersPath = path.join(__dirname, '../docs/characters')
fs.readdirSync(charactersPath).forEach(charDir => {
  const [code, variant] = charDir.split('_'),
  charPath = path.join(charactersPath, charDir)
  fs.readdirSync(charPath).forEach(modHash => {
    // characters[code] = characters[code] || {}
    // characters[code].code = characters[code].code || code
    // characters[code].variants = characters[code].variants || {}
    // characters[code].variants[variant] = characters[code].variants[variant] || {}
    // characters[code].variants[variant].mods = characters[code].variants[variant].mods || []
    // if(!characters[code].variants[variant].mods.find(hash => hash == modHash)) {
    //   characters[code].variants[variant].mods.push({hash: modHash})
    // }
    // modHashes.pck[modHash] = modHashes.pck[modHash] || {code, variant, created: Date.now()}
    const modPath = path.join(charPath, modHash)
    if(code.match(/^s(c|m)/) && fs.existsSync(path.join(modPath, '00000002'))) {
      fs.renameSync(path.join(modPath, '00000002'), path.join(modPath, 'physics.json'))
    }
    // const textureHash = code + '_' + variant + '-' + fs.readdirSync(modPath).reduce((acc, file) => {
    //   if(file.match(/^texture.+\.png/)) acc += md5File(path.join(modPath, file))
    //   return acc
    // }, '')
    // if(fs.existsSync(path.join(modPath, 'static.png')))
    //   fs.unlinkSync(path.join(modPath, 'static.png'))
    // modHashes.texture[textureHash] = true
  })
})

// const findVariant = (hash, character) => {
//   var variant
//   Object.keys(character.variants).forEach(vid => {
//     if(character.variants[vid].mods.indexOf(hash) > -1)
//       variant = vid
//   })
//   return variant
// }

// const findChild = hash => {
//   var character
//   Object.keys(characters).forEach(code => {
//     Object.keys(characters[code].variants).forEach(variant => {
//       if(characters[code].variants[variant].mods.indexOf(hash) > -1)
//         character = characters[code]
//     })
//   })
//   return character
// }

// Object.keys(modHashes.pck).forEach(hash => {
//   const character = findChild(hash)
//   if(character) {
//     const variant = findVariant(hash, character)

// // Object.keys(modHashes.pck).forEach(hash => {
// //   const {variant, code} = modHashes.pck[hash] || {}
// //   if(code) {
//     // const variant = findVariant(hash, character)
//     // modHashes.pck[hash] = {
//     //   code: character.code,
//     //   variant,
//     //   created: fs.statSync(path.join(__dirname, '../docs/characters/' + character.code + '_' + variant + '/' + hash))
//     // }
//     const stat = fs.statSync(path.join(__dirname, '../docs/characters/' + character.code + '_' + variant + '/' + hash))
//     const created = new Date(stat.birthtime).getTime()
//     console.log(modHashes.pck[hash])
//     modHashes.pck[hash] = typeof modHashes.pck[hash] == 'object' ? modHashes.pck[hash] : {code: character.code, variant, created}
//     modHashes.pck[hash].created = created
//   }
// })

// clear out modder mods to rebuild them from scratch each time
Object.keys(modders).forEach(modder => {
  modders[modder].mods = []
})

Object.keys(characters).forEach(code => {
  characters[code].numMods = 0
  Object.keys(characters[code].variants).forEach(variant => {
    characters[code].variants[variant].mods = characters[code].variants[variant].mods || []
    characters[code].numMods += characters[code].variants[variant].mods.length
    // characters[code].variants[variant].mods = characters[code].variants[variant].mods.map(hash => hash)
    // characters[code].variants[variant].mods = characters[code].variants[variant].mods
    // update modders
    characters[code].variants[variant].mods.forEach(hash => {
      const mod = Object.assign({}, mods[hash], {hash})
      if(mod.modder) {
        modders[mod.modder] = modders[mod.modder] || {}
        modders[mod.modder].mods = modders[mod.modder].mods || []
        modders[mod.modder].profile = modders[mod.modder].profile || ""
        if(modders[mod.modder].mods.indexOf(hash) < 0) modders[mod.modder].mods.push(hash)
      }
    })
  })
})
// fs.writeFileSync(path.join(__dirname, '../src/data/mods.json'), JSON.stringify(mods, null, 2))
// fs.writeFileSync(path.join(__dirname, '../seen/textures.json'), JSON.stringify(textures, null, 2))

// merge model infos
const modelInfo = {}
const regions = ['global', 'kr', 'jp']
;[modelInfoGlobal, modelInfoKr, modelInfoJp].forEach((info, i) => {
  const region = regions[i]
  Object.keys(info).forEach(codeAndVariant => {
    modelInfo[codeAndVariant] = modelInfo[codeAndVariant] || info[codeAndVariant]
    const [_, code, variant] = codeAndVariant.match(/([a-z][a-z]?\d\d\d)_(\d\d)/)
    characters[code] = characters[code] || {code, mods: []}
    characters[code].regions = characters[code].regions || []
    if(characters[code].regions.indexOf(region) < 0) {
      characters[code].regions.push(region)
    }
    characters[code].variants = characters[code].variants || {}
    characters[code].variants[variant] = characters[code].variants[variant] || {}
    characters[code].variants[variant].regions = characters[code].variants[variant].regions || []
    if(characters[code].variants[variant].regions.indexOf(region) < 0) {
      characters[code].variants[variant].regions.push(region)
    }
  })
})
fs.writeFileSync(path.join(__dirname, '../docs/data/model_info.merged.json'), JSON.stringify(modelInfo, null, 2))
fs.writeFileSync(path.join(__dirname, '../src/data/characters.json'), JSON.stringify(characters, null, 2))
fs.writeFileSync(path.join(__dirname, '../src/data/modders.json'), JSON.stringify(modders, null, 2))