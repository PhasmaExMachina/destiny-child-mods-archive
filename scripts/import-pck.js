const { isBoolean } = require('util')

const fs = require('fs'),
      path = require('path'),
      {execSync} = require('child_process'),
      md5File = require('md5-file').sync,
      characters = require('../src/data/characters.json'),
      mods = require('../src/data/mods.json'),
      pckSeen = require('../seen/pck.json'),
      texturesSeen = require('../seen/textures.json'),
      fixed = {}

const importPckPath = path.resolve(__dirname, '../import-pck'),
      toolsPath = path.resolve(__dirname, '../tools/Destiny Child PCK Manager v1_0_1')
      tmpPath = path.join(importPckPath, 'tmp'),
      run = (cmd, global) => execSync(
        cmd,
        {
          // stdio: 'inherit',
          env: {KEY_REGION: global ? 'global' : 'kr'}
        }
      )

fs.readdirSync(importPckPath).forEach(file => {
  const [_, code, variant] = file.match(/^([^_]+)_(\d\d).*\.pck$/) || []
  if(code) {
    characters[code] = characters[code] || {}
    characters[code].code = characters[code].code || code
    characters[code].variants = characters[code].variants || {}
    characters[code].variants[variant] = characters[code].variants[variant] || {}
    characters[code].variants[variant].mods = characters[code].variants[variant].mods || []
    const inputFilePath = path.join(importPckPath, file),
          hash = md5File(inputFilePath),
          pckBase = `${code}_${variant}`,
          outputPath = path.join(__dirname, `../docs/characters/${code}_${variant}/${hash}`),
          tmpFilePath = path.join(tmpPath, pckBase + '.pck'),
          live2dPath = tmpFilePath.replace(/\.pck$/, '')
    if(!pckSeen[hash] && characters[code].variants[variant].mods.indexOf(hash) < 0) {
      console.log('-------processing', file, md5File(inputFilePath))
      pckSeen[hash] = true // save that we've seen this mod
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
        const textureHash = code + '_' + variant + '-' + fs.readdirSync(live2dPath).reduce((acc, file) => {
          if(file.match(/^texture.+\.png/)) acc += md5File(path.join(live2dPath, file))
          return acc
        }, '')
        if(!texturesSeen[textureHash]) {
          texturesSeen[textureHash] = true

          characters[code].variants[variant].mods.push(hash)
          characters[code].numMods = characters[code].numMods || 0
          characters[code].numMods++
          mods[hash] = Object.assign({}, mods[hash], {
            code: code,
            variant,
            created: Date.now()
          })

           // check for required files
          const assertFileFound = requiredFile => {
            if(!fs.existsSync(path.join(live2dPath, requiredFile))) {
              console.error('Missing ' + requiredFile + ' file for ', file, 'extracted to', path.join(live2dPath, pckBase + '_idle.mtn'))
              process.exit(1)
            }
          }
          assertFileFound('model.json')
          assertFileFound('character.dat')
          const model = JSON.parse(fs.readFileSync(path.join(live2dPath, 'model.json')))
          Object.keys(model.motions).forEach(f => {
            const fileToCheck = pckBase + '_' + f + '.mtn'
            if(!fs.existsSync(path.join(live2dPath, fileToCheck))) {
              fixed[file] = fixed[file] || {}
              fixed[file].missing = fixed[file].missing || []
              fixed[file].missing.push(fileToCheck)
              fixed[file].fixedPckUrl = `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${code}_${variant}/${hash}/${code}_${variant}.pck`
              console.error(path.join(live2dPath, fileToCheck))
              fs.copyFileSync(
                path.join(__dirname, '../docs/characters/' + code + '_' + variant + '/' + characters[code].variants[variant].mods[0], fileToCheck),
                path.join(live2dPath, fileToCheck)
              )
              if(fs.existsSync(path.join(live2dPath, '00000001'))) fs.unlinkSync(path.join(live2dPath, '00000001'))
              if(fs.existsSync(path.join(live2dPath, '00000002'))) fs.unlinkSync(path.join(live2dPath, '00000002'))
            }
          })

          // move from temp to final destination
          fs.mkdirSync(outputPath, {recursive: true})
          fs.readdirSync(live2dPath).forEach(fileToMove => {
            fs.renameSync(path.join(live2dPath, fileToMove), path.join(outputPath, fileToMove))
          })
          console.log('Live2D extracted. Encryption was', isGlobal ? 'GLOBAL' : 'KR')

          // create universal pck
          console.log('\nRepacking ', file, 'as universal...\n')
          run(`python "${path.join(toolsPath, '../pck-tools/pckexe.py')}" -u ${tmpFilePath}`, isGlobal) // create universal version
          run(`python "${path.join(toolsPath, '../pck-tools/pckexe.py')}" -p ${live2dPath}/_header`) // create universal version
          fs.renameSync(path.join(live2dPath, pckBase + '.pck'), path.join(outputPath, pckBase + '.pck'))

          // clean up temp folder
          fs.rmdirSync(live2dPath, {recursive: true})
          fs.unlinkSync(tmpFilePath)
        }
        else {
          console.log('Mod already found for texture hash', textureHash)
        }
      }
      catch(e) {
        console.error(e)
        console.warn('error parsing', code, variant, file)
      }

    }
    else fs.unlinkSync(inputFilePath)
  }
  fs.rmdirSync(tmpPath, {recursive: true})
})

fs.writeFileSync(path.join(__dirname, '../src/data/mods.json'), JSON.stringify(mods, null, 2))
fs.writeFileSync(path.join(__dirname, '../src/data/characters.json'), JSON.stringify(characters, null, 2))
fs.writeFileSync(path.join(__dirname, '../seen/pck.json'), JSON.stringify(pckSeen, null, 2))
fs.writeFileSync(path.join(__dirname, '../seen/textures.json'), JSON.stringify(texturesSeen, null, 2))
if(Object.keys(fixed).length > 0) {
  fs.writeFileSync(path.join(__dirname, '../import-pck/fixed.json'), JSON.stringify(fixed, null, 2))
  console.warn('\nSOME FILES HAD TO BE FIXED! See import-pck/fixed.json\n')
}