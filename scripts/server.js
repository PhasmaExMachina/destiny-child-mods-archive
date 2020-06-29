const express = require('express'),
      httpProxy = require('http-proxy')


const app = express()
const port = 4000

var proxy = httpProxy.createProxyServer({});

app.use('/destiny-child-mods-archive/*', express.static('docs'))

app.get('*', (req, res) => {
  proxy.weg(req, res. {
    target: 'http://localhost:3000'
  })
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))