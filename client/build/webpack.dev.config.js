const merge = require('webpack-merge')
const webpack = require('webpack')

const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})