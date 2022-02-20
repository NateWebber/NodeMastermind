const express = require('express')
const app = express()
const port = 3000
const site = require('./site')

app.set('view engine', 'jade')
app.set('views', __dirname + '/views')

app.use(express.static(__dirname + '/public'))


app.get('/', site.index)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})