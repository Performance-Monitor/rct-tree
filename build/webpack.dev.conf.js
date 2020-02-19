var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },

  entry: {
    app: ['webpack-hot-middleware/client?path=__hmr', './src/main/index.tsx']
  },

  module: {
    rules: [...utils.styleLoaders({})]
  },

  devtool: '#cheap-module-eval-source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
