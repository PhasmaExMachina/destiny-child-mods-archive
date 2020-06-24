const fs = require('fs'),
      path = require('path'),
      mergeDirs = require('merge-dirs').default

const docsPath = path.join(__dirname, '../docs'),
      docsDataPath = path.join(docsPath, 'data'),
      srcPath = path.join(__dirname, '../src'),
      srcDataPath = path.join(srcPath, 'data')

fs.rmdirSync(path.join(docsPath, 'static'), {recursive: true})
fs.readdirSync(docsPath).forEach(file => {
  if(file.match(/^precache/)) {
    fs.unlinkSync(path.join(docsPath, file))
  }
})
mergeDirs(path.join(__dirname, '../build'), docsPath, 'overwrite')
fs.copyFileSync(path.join(srcDataPath, 'mods.json'), path.join(docsDataPath, 'mods.json'))
fs.copyFileSync(path.join(srcDataPath, 'characters.json'), path.join(docsDataPath, 'characters.json'))