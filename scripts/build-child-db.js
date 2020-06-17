const fs = require('fs'),
      path = require('path')

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
      childSkills = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/child_skills.json'), 'utf-8')).child_skills,
      characterDb = Object.keys(characterSkinData).reduce((db, id) => {
        db[id] = db[id] || {}
        db[id].variants = getVariants(characterSkinData[id]).reduce((acc, v) => {
          const [_, code, variantNum] = v.view_idx.match(/^([^_]+)_(.+)$/)
          db[id].code = code
          acc[variantNum] = v
          return acc
        }, {})
        return db
      }, {})

console.log('childSkills', childSkills)

Object.keys(characterDb).forEach(id => {
  const nameData = childNames[characterDb[id].code]
  if(nameData) {
    characterDb[id].name = nameData.name
    Object.keys(nameData.variants).forEach(variantNum => {
      if(characterDb[id].variants[variantNum]) {
        // characterDb[id].variants[variantNum] = characterDb[id].variants[variantNum] || {}
        characterDb[id].variants[variantNum].title = nameData.variants[variantNum].title
      }
    })
  }
})


const characters = Object.keys(characterDb).reduce((acc, id) => {
  if(characterDb[id].code) {
    acc[characterDb[id].code] = characterDb[id]
    acc[characterDb[id].code].id = id
  }
  return acc
}, {})

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


