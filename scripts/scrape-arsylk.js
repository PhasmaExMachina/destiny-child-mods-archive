var fetch = require('node-fetch'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    file = fs.createWriteStream("file.jpg"),
    https = require('https'),
    downloaded = require('../seen/arsylk.json')

const fetchPage = (number = 1) => {
  console.log('Scraping Arsylyk page ', number)
  return fetch('https://arsylk.pythonanywhere.com/apk/view_models?page=' + number)
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
}

fetchPage(1)
  .then(() => fetchPage(2))
  .then(() => fetchPage(3))
  .then(() => fetchPage(4))
  .then(() => fetchPage(5))
  .then(() => fetchPage(6))
  .then(() => fetchPage(7))
  .then(() => fetchPage(8))
  .then(() => fetchPage(9))
  .then(() => fetchPage(10))
  .then(() => fetchPage(11))
  .then(() => fetchPage(12))
  .then(() => fetchPage(13))
  .then(() => fetchPage(14))
  .then(() => fetchPage(15))
  .then(() => fetchPage(16))
  .then(() => fetchPage(17))
  .then(() => fetchPage(18))
  .then(() => fetchPage(19))
  .then(() => fetchPage(20))
