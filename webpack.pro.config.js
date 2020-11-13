// 生产版本
const path = require('path')
const webpack = require('webpack')
const htmlPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
    // 打包后 dist目录删除后 再生成新的dist 保证打包后的目录的干净
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 未被打包的静态文件拷贝到dist目录下
const CopyPlugin = require('copy-webpack-plugin');

console.log(__dirname)
    // const entry = {
    //     a: './src/a.js',
    //     index: './src/index.js'
    // }

module.exports = {
        // entry: ["./src/main.js", "@babel/polyfill"],
        // 多页面打包
        entry: {
            main: ["./src/main.js", "@babel/polyfill"],
            other: ["./src/other.js", "@babel/polyfill"]
        },
        output: {
            path: path.join(__dirname, "dist"),
            filename: "[name].js",
            // chunkFilename: "boundle_[name].js", //切割成块文件
            publicPath: "/dist/" //打包时候静态文件指向路径  
        },
        /**
         *  @开发使用
         */
        // // 针对 内存  
        // devServer: {

        //     //我们在这里对webpack-dev-server进行配置
        //     // contentBase: path.join(__dirname, "src"), //指向index.html位置  //设置托管目录
        //     open: true, //自动打开浏览器
        //     compress: true, //http技术 对文件压缩
        //     port: 8010, //端口号设置
        //     // 开启热模块配合使用
        //     hot: true, //开启热模块 自动刷新编译  不需要重新打包 哪里修改 哪里就局部同步 热加载
        //     hotOnly: true, //即使HMR不生效，浏览器也不自动刷新。
        // },
        // 插件
        plugins: [
            // 热模块
            /**
             *  @开发使用
             */
            // new webpack.HotModuleReplacementPlugin(),
            // 打包生产html5文件 其中包括使用 script 标签的 body 中的所有 webpack 包。 只需添加插件到你的 webpack 配置如下
            new htmlPlugin({
                filename: 'index.html', //在导出到目录下生产的html5文件  默认文件名为index.html
                template: path.join(__dirname, 'index.html'), //以这个以某某html5文件为模板生产对应的html5文件
                inject: 'body',

                chunks: ['main', 'other'] //和入口的key值进行对应
            }),
            new htmlPlugin({
                filename: 'other.html', //在导出到目录下生产的html5文件  默认文件名为index.html
                template: path.join(__dirname, 'other.html'), //以这个以某某html5文件为模板生产对应的html5文件
                inject: 'body',

                chunks: ['other'] //和入口的key值进行对应
            }),
            // 可以打包后在bundle.js文件加上版权信息
            new webpack.BannerPlugin("小伟子配置webpack"),
            // dist目录删除后再生成
            new CleanWebpackPlugin({
                dry: false,
                cleanStaleWebpackAssets: true
            }),
            //第三方库引用挂载 最好不要挂载到全局变量上及window上面
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery' //这是node_modules下面去找
            })
            // 拷贝被打包的文件到某个地方
            // new CopyPlugin(
            //     [{
            //         from: path.join(__dirname, 'assets'),
            //         to: 'assets', //和output的path下队友 意思就是再dist目录新建assets文件
            //         noErrorOnMissing: true
            //     }],
            // options: {
            //     concurrency: 100,
            // },
            // ),
        ],
        mode: 'production',
        module: {
            rules: [{
                    test: /\.css$/, //以.css结尾
                    // css - loader  解析css文件
                    //style - loader 把css结果放到Html文件中 使其生效 动态加载到html中 
                    use: ['style-loader', 'css-loader'] //使用style-loader css-loader进行对css处理  从右到左管道形式进行处理
                        //style以内联格式动态展示
                },
                { //以.less结尾的文件 管道形式从右到左less-loader解析成为css  css-loader解析css文件 style-loader把
                    //文件.less文件放到html中
                    test: /\.less$/,
                    use: ['style-loader', 'css-loader', 'less-loader'],
                },
                { //以.less结尾的文件 管道形式从右到左less-loader解析成为css  css-loader解析css文件 style-loader把
                    //文件.less文件放到html中
                    test: /\.sass$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
                {
                    // 对于图片的地址url-loader基于file-loader 那么url-loader安装必须也要安装file-loader
                    /**
                     * url-loader好处是可以配置一些参数  优化
                     * file-loader是只能使用file-loader
                     */
                    test: /\.(png|jpg|jpeg|gif|bmp)$/,
                    use: {
                        loader: 'url-loader', //使用的依赖
                        options: {
                            limit: 5 * 1024, //基本是限制5kb  5kb以上的图片用web路径 以下用base64
                            outputPath: 'images', //设置图片存放的目录位置 打包存放在dist目录下
                            name: "[name]-[hash:2].[ext]", //图片格式为图片原名|两位哈希.图片格式
                            esModule: false //命令启用CommonJS模块语法：
                        }
                    }
                },
                {
                    // 针对字体图标 
                    // bootstrap使用 字体图标引入 import 'bootstrap/dist/css/bootstrap.css'
                    // <span class="glyphicon glyphicon-option-horizontal"></span>
                    test: /\.(woff|woff2|svg|ttf|eot)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name]-[hash:4].[ext]' //字体图片设置名字以及存储位置 fonts文件下 字体命名-哈希前4位.字体格式
                        }
                    }

                }, {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-proposal-class-properties', "@babel/plugin-transform-runtime"]
                        }
                    },
                    exclude: /node_modules/ //移除对node_modules目录下的js文件处理
                },
                {
                    test: /\.(htm|html)$/i,
                    loader: 'html-withimg-loader'
                }
            ]
        }
    }
    /* ---------------------------------------------------------------------------------- */
    /**
     * 插件
     * @1  npm run build 打包后 dist目录进行更新 先删除 再生成
     *  new CleanWebpackPlugin({
            dry: false,                 //设置为true  模拟删除
            cleanStaleWebpackAssets: true   //未有的文件删除
        })  

       @2   CopyWebpackPlugin对于一些静态文件 未被打包的文件copy到打包的目的地 
               index.html  文件和图片引入路径最好是绝对路径 更多应用在视频 音频 这类文件
               指的是未被打包的静态文件 不会再dist目录的index.html找到
               npm install --save-dev copy-webpack-plugin@4.6.0
               配置CopyWebpackPlugin
                  from 定义要拷贝的源文件 from： __dirname + '/src/components'
                  to 定义要拷贝到的目标文件夹 to: __dirname + '/dist'
                  toType file 或者 dir 可选， 默认是文件
                  force 强制覆盖前面的插件 可选， 默认是文件
                  context 可选， 默认base context可用specific context
                   flatten 只拷贝指定的文件 可以用模糊匹配
                   ignore 忽略拷贝指定的文件 可以模糊匹配

         @3   webpack.BannerPlugin(版权信息) 可以在bundle.js文件内添加些版权信息 

         @4  
        *
        / */
    /* ------------------------------------------------------------------------------------------------------------ */
    /**
     * 依赖
     * @1     html-withimg-loader解决 index.html文件里面 引入图片路径问题 相对路径引入
                  在npm run build更好的解决 
                      {
                          test: /\.(htm|html)$/i,
                          loader: 'html-withimg-loader'
                       }
     */
    /* -------------------------------------------------------------------------------------------------------------- */
    /**
     * 多页面打包 入口多个js引入 自定义key值  输出output:{} 多个创建html文件  每个html文件规定引入不一样的html文件
     */

/**
 * 注意 webpack打包是把各个模块进行闭包打包 不是全局
 *  @3
 */