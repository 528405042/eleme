var express = require('express')
var port = process.env.PORT || 3000
var app = express()
var router = express.Router()
router.get('/', function (req, res, next) {
  req.url = '/index.html'
  next()
})
var eleData = require('./data.json')

var seller = eleData.seller

var goods = eleData.goods

var ratings = eleData.ratings

var apiRouter = express.Router()

app.use('/api', apiRouter)

apiRouter.get('/seller', function (req, res) {
  res.json({
    error: 0,
    data: seller
  })
})
apiRouter.get('/goods', function (req, res) {
  res.json({
    error: 0,
    data: goods
  })
})
apiRouter.get('/ratings', function (req, res) {
  res.json({
    error: 0,
    data: ratings()
  })
})
app.use(router)
app.use(express.static('./dist'))
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var url = 'http://localhost:' + port
  console.log(`listening at ${url}`)
})
