var path = require('path')
var express = require('express')
var webpack = require('webpack')
var devMiddleware = require('webpack-dev-middleware')
var hotMiddleware = require('webpack-hot-middleware')
var webpackConfig = require('./webpack.dev.conf')

var config = require('../config')
var port = config.dev.port

var app = express()
var compiler = webpack(webpackConfig)

var webpackDevMiddleware = devMiddleware(compiler, {
  logLevel: 'silent',
  publicPath: webpackConfig.output.publicPath
})

var webpackHotMiddleware = hotMiddleware(compiler, {
  log: false,
  heartbeat: 2000,
  path: '/__hmr'
})

app.use(webpackDevMiddleware)

app.use(webpackHotMiddleware)

app.use('/ping', function(req, res) {
  res.sendStatus(200)
})

var staticPath = path.posix.join(
  config.dev.assetsPublicPath,
  config.base.assetsSubDirectory
)
app.use(staticPath, express.static('./static'))

webpackDevMiddleware.waitUntilValid(() => {
  console.log(`> Listening at ${config.dev.host}:${config.dev.port} \n`)
})
app.listen(port)
