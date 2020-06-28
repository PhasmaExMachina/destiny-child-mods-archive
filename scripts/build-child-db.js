const fs = require('fs'),
      path = require('path'),
      characters = require('../src/data/characters.json')

const getVariants = v => {
  return v.reduce
    ? v.reduce((acc, o) => {
      const keys = Object.keys(o)
      if(!Array.isArray(o) && keys.length > 0) {
        keys.forEach(k => acc.push(o[k]))
      }
      else return acc.concat(o)
      return acc
    }, [])
    : []
}


const characterSkinData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/dump/CHARACTER_SKIN_DATA.json'), 'utf-8')),
      childNames = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/extracted_child_names.json'), 'utf-8')),
      childSkills = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/child_skills.json'), 'utf-8')).child_skills

Object.keys(characterSkinData).forEach(id => {
  Object.keys(characterSkinData).forEach(code => {
    getVariants(characterSkinData[code]).forEach(v => {
      const [_, code, variantNum] = v.view_idx.match(/^([^_]+)_(.+)$/)
      characters[code] = characters[code] || {}
      characters[code].variants = characters[code].variants || {}
      characters[code].code = code
      characters[code].variants[variantNum] = Object.assign(characters[code].variants[variantNum], v)
    }, {})
  }, {})
})

console.log('childSkills', childSkills)

Object.keys(characters).forEach(id => {
  const nameData = childNames[characters[id].code]
  if(nameData) {
    characters[id].name = nameData.name
    Object.keys(nameData.variants).forEach(variantNum => {
      if(characters[id].variants[variantNum]) {
        // characters[id].variants[variantNum] = characters[id].variants[variantNum] || {}
        characters[id].variants[variantNum].title = nameData.variants[variantNum].title
      }
    })
  }
})


// const characters = Object.keys(characters).reduce((acc, id) => {
//   if(characters[id].code) {
//     acc[characters[id].code] = characters[id]
//     acc[characters[id].code].id = id
//   }
//   return acc
// }, {})

childSkills.forEach(s => {
  delete s.id
  if(!characters[s.model_id]) {
    characters[s.model_id] = s
    characters[s.model_id].variants = {}
  }
  else {
    Object.assign(characters[s.model_id], s)
  }
})

fs.writeFileSync(path.resolve(__dirname, '../src/data/characters.json'), JSON.stringify(characters, null, 2))


