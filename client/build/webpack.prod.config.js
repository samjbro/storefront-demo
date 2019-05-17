const merge = require('webpack-merge')
const path = require('path')

const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'bundle.js'
  }
})