"use strict";

// 这个文件是进行分析
// webpack - bundle - analyzer
// 先生成 stats.json文件
// package.json配置
// webpack--profile--json > stats.json  --config ./build/production.js    指定好配置文件
// webpack - bundle - analyzer工具进行分析
//  npm install--save - dev webpack - bundle - analyzer
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// module.exports = {
//     plugins: [
//         new BundleAnalyzerPlugin()
//     ]
// }
// 启动这个配置文件
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [new BundleAnalyzerPlugin()]
};