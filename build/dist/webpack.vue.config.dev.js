"use strict";

//这个地方专门打包框架的地方  因为框架的代码不会变化 避免项目打包的时候 把框架再进行一次打包
var path = require('path');

var webpack = require('webpack'); // 把vue的库抽取成dll
//DllPlugin 插件产生关联
//在打包的配置文件加上
// new webpack.DllReferencePlugin({
//     manifest: path.resolve(__dirname, "../dist/mainifest.json") //关联dll文件 这样节省打包时间
// })
// 联系后生成的dll文件没有动态的添加到html文件中 在打包的文件中动态的引入
// npm i add-asset-html-webpack-plugin -D
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// plugins: [
//         new HtmlWebpackPlugin(), 之后引入
//         new AddAssetHtmlPlugin({ filepath: require.resolve('./some-file') }),
//     ],


module.exports = {
  mode: "production",
  entry: {
    vue: ['vue/dist/vue.js', 'vue-router']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]_dll.js',
    library: '[name]_dll' //暴露对象到全局 使用

  },
  plugins: [new webpack.DllPlugin({
    name: '[name]_dll',
    //公开dll函数的名称 和 output.library保持一致
    path: path.resolve(__dirname, '../dist/mainifest.json') //mainifest.json生产的文件夹及名字  清单文件 有联系

  })]
};