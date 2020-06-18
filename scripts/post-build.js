const fs = require('fs'),
      path = require('path'),
      mergeDirs = require('merge-dirs').default

const docsPath = path.join(__dirname, '../docs')

fs.rmdirSync(path.join(docsPath, 'static'), {recursive: true})
fs.readdirSync(docsPath).forEach(file => {
  if(file.match(/^precache/)) {
    fs.unlinkSync(path.join(docsPath, file))
  }
})
mergeDirs(path.join(__dirname, '../build'), docsPath, 'overwrite')