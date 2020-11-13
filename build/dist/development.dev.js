"use strict";

var _require = require('webpack-merge'),
    merge = _require.merge;

var base = require('./webpack.base.config');

var path = require('path');

var webpack = require('webpack');

module.exports = merge(base, {
  // 针对 内存
  devServer: {
    // publicPath: "/", // 内存中的index.html在哪个地方引用
    //我们在这里对webpack-dev-server进行配置
    // contentBase: path.join(__dirname, "src"), //指向index.html位置  //设置托管目录 去访问的html文件
    open: true,
    //自动打开浏览器
    compress: true,
    //http技术 对文件压缩
    port: 8010,
    //端口号设置
    // 开启热模块配合使用
    hot: true,
    //开启热模块 自动刷新编译  不需要重新打包 哪里修改 哪里就局部同步 热加载
    hotOnly: true,
    //即使HMR不生效，浏览器也不自动刷新。
    // 反向代理
    // webpack-dev-server服务器向远程服务器发送请求 得到数据转发给客服端
    // 客服端请求只填写参数 不需要填写请求地址
    // 简单的反向代理
    // proxy: {
    //     '/api': 'http://localhost:9998'
    // }
    proxy: {
      /*客服端发送的/api/list请求到webpack-dev-server
                 服务器  webpack-dev-server进行转发请求到http://localhost:9998所支配的服务器 
                 原理:  客服端请求的地址是没有请求地址协议 域名 端口 webpack-dev-server服务器看到了/api开头
                 的请求 就转发请求跨域的请求地址 默认为进行拼 目标地址+ 接客服端请求的地址*/
      '/api': {
        target: 'http://localhost:9998',
        pathRewrite: {
          /* 如果后端请求地址只有一级 重写路径  */

          /* 原理是：转发拼接好的路径 会把^/api开头的一级路由去掉 变成  'http://localhost:9998/list',*/
          // '^/api': '/api',
          // 默认情况下， 将不接受在HTTPS上运行带有无效证书的后端服务器。 如果您想修改配置， 如下所示：
          secure: false,
          changeOrigin: true //主机头的起源保持默认进行代理时，可以设置changeOrigin以true覆盖此行为

        }
      }
    }
  },
  plugins: [// 热模块
  new webpack.HotModuleReplacementPlugin(), // 定义环境变量 书写 'true'  '123' '"搜索"'
  new webpack.DefinePlugin({
    ENVIRONMENT: '"development"'
  })],
  mode: "development",
  devtool: 'cheap-module-eval-source-map'
});