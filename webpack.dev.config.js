// 开发版本const path = require('path')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
    // 内存和dist生产index.html文件 并且自动导入打包好的bundle.js文件
const htmlPlugin = require('html-webpack-plugin')
    // 打包后 dist目录删除后 再生成新的dist 保证打包后的目录的干净
    // 推荐mode:production使用
    //const { CleanWebpackPlugin } = require('clean-webpack-plugin');
console.log(__dirname)
    // const entry = {
    //     a: './src/a.js',
    //     index: './src/index.js'
    // }

module.exports = {
        entry: ["./src/main.js", "@babel/polyfill"],
        output: {
            path: path.join(__dirname, "dist"),
            filename: "bundle.js",
            // chunkFilename: "boundle_[name].js", //切割成块文件
            // publicPath: "/dist/" //打包时候静态文件指向路径  禁止开发使用
        },
        // 针对 内存
        devServer: {
            // publicPath: "/", // 内存中的index.html在哪个地方引用
            //我们在这里对webpack-dev-server进行配置
            // contentBase: path.join(__dirname, "src"), //指向index.html位置  //设置托管目录 去访问的html文件
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
            //内存中以某某html文件为模块 生产新的index.html文件 并且自动导入内存中的bundle.js文件
            new htmlPlugin({
                filename: 'index.html', //在导出到目录下生产的html5文件  默认文件名为index.html
                template: path.join(__dirname, 'index.html') //以这个以某某html5文件为模板生产对应的html5文件
            }),
            // 第三方库进行注册挂载到$或jQuery上面 在模块页面可以使用
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            })
            // 推荐mode:production使用
            // new CleanWebpackPlugin()
        ],
        // 设置开发模式
        mode: 'development',
        // 设置依赖图片  样式 高级语法js
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
                }, {
                    // 对于图片的地址url-loader基于file-loader 那么url-loader安装必须也要安装file-loader
                    /**
                     * url-loader好处是可以配置一些参数  优化  配置 limit
                     * file-loader是只能使用file-loader  配置 outputPath name
                     */
                    test: /\.(png|jpg|jpeg|gif|bmp)$/,
                    use: {
                        loader: 'url-loader', //使用的依赖
                        options: {
                            limit: 5 * 1024, //基本是限制5kb  5kb以上的图片用web路径 以下用base64
                            outputPath: 'images', //设置图片存放的目录位置 用了webpack-dev-server 图片目录在内存中生存 并且存放图片
                            name: "[name]-[hash:4].[ext]", //设置图片的名称 默认为hash格式的名字 [name]图片原名称 hash解析后的 ext代表图片格式jpg,png等
                            // [hash:4] 代表hash只有前面四个展示 最好越长越好
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
                            name: 'fonts/[name].[ext]'
                        }

                    }
                },
                {
                    //处理js高级语法 es6 es7转换为es5以下 支持老版浏览器
                    // npm i babel-loader @babel/core @babel/preset-env --save-dev
                    //babel-loader相当于@bebl/core和@babel/preset-env的桥梁
                    //@babel/core 核心
                    //@babel/preset-env  语法 预设 就是把高级语法转为老版本浏览器识别的js语法
                    /**
                     * 预设 @babel/preset-env
                               @babel/preset-flow
                               @babel/preset-react
                               @babel/preset-typescript
                     */
                    /**
                     * 配置  options:{presets:['@babel/env']} 这是env预设 多个预设 这是其中一个预设
                     * 
                     */
                    /**
                     * 插件 解决更高级语法 插件多个
                     * plugins:['@babel/plugin-proposal-class-properties']
                     */
                    /**
                     * 插件大全  
                     * @babel/plugin-proposal-class-properties  解决语法有class类高级语法
                     */
                    /**
                     * 对于一些js文件的语法不进行转换或解析
                     * exclude:/node_modules/
                     */
                    /**
                     * 对于es6的生产器generator语法  保存状态 
                     * 格式 function* 函数(){
                     *              yield 输出的语句
                     *              yield  输出的语句
                     *               yield 输出的语句 
                     * return 
                     * }          
                     * 函数调用() 》返回的是一个Generator
                        用一个变量去接收返回的结果
                        const ga = 函数()
                        ga.next()  抛出yield的结果 多个ga.next()执行 返回对应数的yield结果 直到done为true
                        for (v of ga){
                          v的值只针对yield后面的值
                        }
                        安装的插件和基石 npm install --save-dev @babel/plugin-transform-runtime
                                                     npm install --save @babel/runtime
                     */
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        /**
                         * 对于可管理性 可以把配置js语法的options配置 放在.babelrc文件下进行配置 方便进行管理
                         */
                        // options: {
                        //     presets: ['@babel/preset-env'],
                        //     plugins: ['@babel/plugin-proposal-class-properties', "@babel/plugin-transform-runtime"]
                        // }
                    },
                    exclude: /node_modules/
                },
                // {
                //     // 对于第三方库用loader进行全局挂载 比方说jquery库
                //     // 解析jquery的绝对路径
                //     test: require.resolve('jquery'),
                //     use: [{
                //         loader: 'expose-loader',
                //         options: 'jQuery' //挂载到jQuery上
                //     }, {
                //         loader: 'expose-loader',
                //         options: '$' //挂载到$上
                //     }]
                // }
                // {
                //     test: require.resolve('jquery'),
                //     loader: "expose-loader?$!expose-loader?jQuery"
                // }
            ]
        },
        // 配置开发时候soue map方便找出文件所在位置
        devtool: 'cheap-module-eval-source-map'
    }
    /**
     * babel配置
     * webapck文件配置下启动babel配置 
     * 为了方便管理 在.babelrc文件下配置options
     * @1 安装依赖和核心   npm i babel-loader @babel/core  --save-dev
     * @2 安装预设 npm i  @babel/preset-env --save-dev  解决如定时器等
     * @3 安装扩展性很强的插件 如 
     * @babel/plugin-proposal-class-properties
     * @babel/plugin-transform-runtime   必须安装  @babel/runtime  生效   
     * @4 补丁  npm install --save @babel/polyfill  解决对象调用的API问题 如str.includes(参数)
     * 使用 要么直接在对应文件 import "@babel/polyfill"; 或 require("@babel/polyfill");
     * 或入口 entry: ["@babel/polyfill", "./app/js"],
     */
    /* ------------------------------------------------------------------------------------------------ */
    /**
     * source map 只是映射到浏览器的soue map
     *webpack配置source map 把源代码映射到浏览器的source map 源代码开启映射到浏览器上 方便开发者调式 
     eval 减少文件请求
     cheap 网络速度快
     mode:development   推荐用 cheap-module-eval-source-map
     mode:production  不推荐使用soue map 配置
     */
    /* ------------------------------------------------------------------------------------------------------ */
    /**
     * 插件   
     *@1 打包时候先删除dist目录 再生产dist目录 保证dist目录的干净
     * clean-webpack-plugin 再npm 官网介绍
     * npm install --save-dev clean-webpack-plugin
     */


/**
 * 对于引入第三方库 多个模块使用到第三方库
 * 第一种方法 把第三方库定义为全局变量
 * npm i -D expose-loader
 * 依赖expose-loader
 * {
 * test:require.resolve('jquery')  //用于解析jquery的绝对路径
 * use:'expose-loader',
 * options:'$'             //把jquey全局挂载到$上
 * 
 * }
 * 
 * 第二种方法 （推荐）
 * 创建插件对象 要自动加载jquery 我们可以将两个变量指向对应的node模块
 * new webpack.ProvidePlugin({
 *  $:'jquery',
 * jQuery:'jquery'
 * })
 */