var path = require('path')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')

var config = require('../config')

exports.resolve = function(dir) {
  return path.join(__dirname, '..', dir)
}

exports.assetsPath = function(_path) {
  var assetsSubDirectory = config.base.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.styleLoaders = function(options) {
  var output = []
  output.push({
    test: /\.(css|less)$/,
    exclude: /node_modules/,
    use: [
      options.extract ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[path]-[local]-[hash:base64:5]'
        }
      },
      { loader: 'postcss-loader' },
      { loader: 'less-loader' }
    ]
  })

  output.push({
    test: /\.css$/,
    include: /node_modules/,
    use: [options.extract ? MiniCssExtractPlugin.loader : 'style-loader', { loader: 'css-loader' }]
  })

  return output
}
