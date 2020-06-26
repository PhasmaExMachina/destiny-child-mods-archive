var fetch = require('node-fetch'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    file = fs.createWriteStream("file.jpg"),
    https = require('https'),
    downloaded = require('../seen/arsylk.json')

fetch('https://arsylk.pythonanywhere.com/apk/view_models?page=1')
    .then(res => res.text())
    .then(body => {
      const promises = []
      const $ = cheerio.load(body)
      $('.with_id').each((i, el) => {
        const id = $(el).find('td').first().text(),
              code = $(el).find('td').eq(1).text()
        if(!downloaded[id]) {
          promises.push(fetch('https://arsylk.pythonanywhere.com//api/get_model_file/' + id)
            .then(res => {
              downloaded[id] = true
              console.log('downloading ID', id)
              const fileStream = fs.createWriteStream(path.join(__dirname, '../import-pck', code + '-' + id + '.pck'))
              return res.body.pipe(fileStream)
            }))
        }
      })
      return Promise.all(promises)
    })
    .then(() => {
      fs.writeFileSync(path.join(__dirname, '../seen/arsylk.json'), JSON.stringify(downloaded, null, 2))
    })
