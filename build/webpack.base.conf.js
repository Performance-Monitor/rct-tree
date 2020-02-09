var os = require('os')
var path = require('path')
var HappyPack = require('happypack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

var utils = require('./utils')
var config = require('../config')

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    alias: {
      '@': utils.resolve('src'),
      '@store': utils.resolve('src/store'),
      '@library': utils.resolve('src/library'),
      '@modules': utils.resolve('src/modules'),
      '@style': utils.resolve('src/style'),
      '@components': utils.resolve('src/components')
    }
  },

  entry: {
    app: './src/main/index.tsx'
  },

  output: {
    path: config.base.assetsRoot,
    publicPath: config.base.assetsPublicPath,
    filename: utils.assetsPath('js/[name].[hash]p.js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash]p.js')
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'happypack/loader?id=tsx',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },

  plugins: [
    new ProgressBarPlugin(),
    new HappyPack({
      id: 'tsx',
      threadPool: happyThreadPool,
      use: [
        { loader: 'babel-loader' },
        {
          loader: 'ts-loader',
          options: { transpileOnly: true, happyPackMode: true }
        }
      ]
    }),
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true
    }),
    new HtmlWebpackPlugin({
      title: config.base.title,
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/templates/index.ejs'),
      inject: true
    })
  ],

  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
