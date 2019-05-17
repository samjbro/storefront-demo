import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from './build/webpack.dev.config'

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: '/'
})
const hotMiddleware = webpackHotMiddleware(compiler)
app.use(devMiddleware)
app.use(hotMiddleware)

app.get('*', (req, res, next) => {
  const filename = path.join(compiler.outputPath, process.env.HTML_FILENAME)
  devMiddleware.waitUntilValid(() => {
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) { return next(err) }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Client dev server listening on port ${PORT}`)
})