const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HTMLPlugin = require('html-webpack-plugin')

const resolve = file => path.resolve(__dirname, '..', file)

module.exports = {
  entry: [
    '@babel/polyfill',
    resolve('src/index.js')
  ],
  output: {},
  resolve: {
    extensions: ['.mjs', '.js', '.vue'],
    alias: {
      '@': resolve('src'),
      '#': resolve('assets/styles'),
      'img': resolve('assets/images')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpg|gif|svg|png)$/,
        loader: 'file-loader',
        options: {
          filename: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HTMLPlugin({
      filename: process.env.HTML_FILENAME,
      template: resolve('build/index.template.html'),
      inject: true
    })
  ]
}