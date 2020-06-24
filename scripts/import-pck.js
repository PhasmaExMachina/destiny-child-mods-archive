const { isBoolean } = require('util')

const fs = require('fs'),
      path = require('path'),
      {execSync} = require('child_process'),
      md5File = require('md5-file').sync,
      characters = require('../src/data/characters.json'),
      modHashes = require('../data/mod-hashes.json')

const importPckPath = path.resolve(__dirname, '../import-pck'),
      toolsPath = path.resolve(__dirname, '../tools/Destiny Child PCK Manager v1_0_1')
      tmpPath = path.join(importPckPath, 'tmp'),
      run = (cmd, global) => execSync(
        cmd,
        {stdio: 'inherit', st: 'inherit', env: {KEY_REGION: global ? 'global' : 'kr'}}
      )

fs.readdirSync(importPckPath).forEach(file => {
  const [_, characterId, variant] = file.match(/^([^_]+)_(\d\d).*\.pck$/) || []
  if(characterId) {
    const inputFilePath = path.join(importPckPath, file),
          hash = md5File(inputFilePath),
          pckBase = `${characterId}_${variant}`,
          outputPath = path.join(__dirname, `../docs/characters/${characterId}_${variant}/${hash}`),
          tmpFilePath = path.join(tmpPath, pckBase + '.pck'),
          live2dPath = tmpFilePath.replace(/\.pck$/, '')
    if(!modHashes.pck[hash]) {
      console.log('-------processing', file, md5File(inputFilePath))
      modHashes.pck[hash] = {code: characterId, variant, created: Date.now()} // save that we've seen this mod
      fs.mkdirSync(tmpPath, {recursive: true}) // create temp directory if it doesn't exist
      fs.renameSync(inputFilePath, tmpFilePath) // rename input file to plain pck base and move to temp
      let isGlobal = false

      try {

        // extract live2d
        run(`python "${path.join(toolsPath, '../pck-tools/pckexe.py')}" -u -m ${tmpFilePath}`) // create universal version
        if(!fs.existsSync(path.join(live2dPath, 'model.json'))) {
          isGlobal = true
          fs.rmdirSync(live2dPath, {recursive: true})
          run(`python "${path.join(toolsPath, '../pck-tools/pckexe.py')}" -u -m ${tmpFilePath}`, true) // create universal version
        }

        // check for mod dupe
        const textureHash = characterId + '_' + variant + '-' + fs.readdirSync(live2dPath).reduce((acc, file) => {
          if(file.match(/^texture.+\.png/)) acc += md5File(path.join(live2dPath, file))
          return acc
        }, '')
        if(!modHashes.texture[textureHash]) {
          modHashes.pck[hash] = true
          fs.mkdirSync(outputPath, {recursive: true})
          fs.readdirSync(live2dPath).forEach(fileToMove => {
            fs.renameSync(path.join(live2dPath, fileToMove), path.join(outputPath, fileToMove))
          })
          console.log('Live2D extracted. Encryption was', isGlobal ? 'GLOBAL' : 'KR')

          // clean up temp folder
          fs.rmdirSync(live2dPath, {recursive: true})

          // create universal pck
          console.log('\nRepacking ', file, 'as universal...\n')
          run(`python "${path.join(toolsPath, '../pck-tools/pckexe.py')}" -u ${tmpFilePath}`, isGlobal) // create universal version
          run(`python "${path.join(toolsPath, '../pck-tools/pckexe.py')}" -p ${live2dPath}/_header`) // create universal version
          fs.renameSync(path.join(live2dPath, pckBase + '.pck'), path.join(outputPath, pckBase + '.pck'))

          characters[characterId] = characters[characterId] || {}
          characters[characterId].code = characters[characterId].code || characterId
          characters[characterId].variants = characters[characterId].variants || {}
          characters[characterId].variants[variant] = characters[characterId].variants[variant] || {}
          characters[characterId].variants[variant].mods = characters[characterId].variants[variant].mods || []
          characters[characterId].variants[variant].mods.push({
            hash,
            created: Date.now()
          })
          characters[characterId].numMods = characters[characterId].numMods || 0
          characters[characterId].numMods++
          fs.unlinkSync(tmpFilePath)
        }
      }
      catch(e) {
        console.warn('error parsing', characterId, variant, file)
      }

    }
    else fs.unlinkSync(inputFilePath)
  }
  fs.rmdirSync(tmpPath, {recursive: true})
})

fs.writeFileSync(path.join(__dirname, '../src/data/characters.json'), JSON.stringify(characters, null, 2))
fs.writeFileSync(path.join(__dirname, '../data/mod-hashes.json'), JSON.stringify(modHashes, null, 2))