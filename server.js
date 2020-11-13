// 自己搭建webpack - dev - server服务器
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.test.config.js');
const app = express()
const compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, {
    publicPath: '/',
    open: true
}))
app.listen(3000, () => {
    console.log("监听3000")
})