"use strict";

var base = require('./webpack.base.config');

var path = require('path');

var webpack = require('webpack');

var _require = require("webpack-merge"),
    merge = _require.merge;

var _require2 = require('clean-webpack-plugin'),
    CleanWebpackPlugin = _require2.CleanWebpackPlugin; // 进行css压缩


var CssMinimizerPlugin = require('optimize-css-assets-webpack-plugin'); // 进行js压缩


var TerserPlugin = require('terser-webpack-plugin'); //htmlPlugin打包生产的html文件动态的引入其他的js文件


var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

console.log(TerserPlugin, "js压缩是否生效"); // webpacl - merge 合并到生产模式下
// npm install webpack - merge--save - dev

module.exports = merge(base, {
  output: {
    filename: "[name].[contenthash:8].js",
    publicPath: "./" //打包时候静态文件指向路径  

  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.(htm|html)$/i,
      loader: 'html-withimg-loader'
    }]
  },
  // 进行压缩
  optimization: {
    // minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
  },
  plugins: [// 可以打包后在bundle.js文件加上版权信息
  // new webpack.BannerPlugin("小伟子配置webpack"),
  // dist目录删除后再生成  

  /* dll文件包含的库生产后 最好不要再进行清除 */
  // new CleanWebpackPlugin({
  //     dry: false,
  //     cleanStaleWebpackAssets: true
  // }),
  // 定义环境变量 书写 'true'  '123' '"搜索"
  new webpack.DefinePlugin({
    ENVIRONMENT: '"production"'
  }), // 关联dll文件 这样节省打包时间  库打包后生成的dll文件进行关联
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "../dist/mainifest.json") //关联dll文件 这样节省打包时间

  }), // 配置动态的引入其他js文件
  // new AddAssetHtmlPlugin({ filepath: path.resolve(__dirname, '../dist/vue_dll.js') }),
  new AddAssetHtmlPlugin({
    filepath: path.resolve(__dirname, '../dist/react_dll.js')
  })]
});