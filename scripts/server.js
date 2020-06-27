const express = require('express')

const app = express()
const port = 4000

app.get('/', (req, res) => res.redirect(301, '/destiny-child-mods-archive'))

app.use('/destiny-child-mods-archive', express.static('docs'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))