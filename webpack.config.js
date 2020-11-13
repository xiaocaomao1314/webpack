const path = require('path')
const webpack = require('webpack')
const htmlPlugin = require('html-webpack-plugin')
console.log(__dirname)
    // const entry = {
    //     a: './src/a.js',
    //     index: './src/index.js'
    // }

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        // chunkFilename: "boundle_[name].js", //切割成块文件
        // publicPath: "/dist/" //打包时候静态文件指向路径  以及webpack.dev.server 禁止使用
    },
    // 针对 内存
    devServer: {

        //我们在这里对webpack-dev-server进行配置
        // contentBase: path.join(__dirname, "src"), //指向index.html位置  //设置托管目录
        open: true, //自动打开浏览器
        compress: true, //http技术 对文件压缩
        port: 8010, //端口号设置
        // 开启热模块配合使用
        hot: true, //开启热模块 自动刷新编译  不需要重新打包 哪里修改 哪里就局部同步 热加载
        hotOnly: true, //即使HMR不生效，浏览器也不自动刷新。
    },
    // 插件
    plugins: [
        // 热模块
        new webpack.HotModuleReplacementPlugin(),
        // 打包生产html5文件 其中包括使用 script 标签的 body 中的所有 webpack 包。 只需添加插件到你的 webpack 配置如下
        new htmlPlugin({
            filename: 'index.html', //在导出到目录下生产的html5文件  默认文件名为index.html
            template: path.join(__dirname, 'index.html') //以这个以某某html5文件为模板生产对应的html5文件
        })
    ],
    mode: 'development',
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                options: {
                    limit: 3000,
                    name: '[name].[hash:8].[ext]'
                }
            }
        ]
    }
}