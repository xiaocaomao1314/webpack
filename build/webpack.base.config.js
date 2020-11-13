// 把公共的webpack通过webpack - merge合并到开发或生产环境下
// 开发版本const path = require('path')
const path = require('path')
const webpack = require('webpack')
    // 内存和dist生产index.html文件 并且自动导入打包好的bundle.js文件
const htmlPlugin = require('html-webpack-plugin')
    // 打包后 dist目录删除后 再生成新的dist 保证打包后的目录的干净
    // 推荐mode:production使用
    //const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 该插件将CSS提取到单独的文件中。 它为每个包含CSS的JS文件创建一个CSS文件。 它支持CSS和SourceMap的按需加载。
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//查看打包好的文件分布情况
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
console.log(__dirname)
module.exports = {
        // entry: ["./src/main.js", "@babel/polyfill"],
        entry: {
            // main: ["./src/main.js", "@babel/polyfill"],
            other: ["./src/other.js", "@babel/polyfill"],
            // a1: ["./src/a1.js", "@babel/polyfill"],
            // a2: ["./src/a2.js", "@babel/polyfill"]
        },
        output: {
            path: path.resolve(__dirname, "../dist"),
            // 等同于path.join(__dirname, '..',"./dist"),
            filename: "[name].js",

            chunkFilename: "boundle_[name].js", //切割成块文件
            // publicPath: "/dist/" //打包时候静态文件指向路径  
        },

        // 插件
        plugins: [
            //内存中以某某html文件为模块 生产新的index.html文件 并且自动导入内存中的bundle.js文件
            // new htmlPlugin({
            //     filename: 'index.html', //在导出到目录下生产的html5文件  默认文件名为index.html
            //     template: path.join(__dirname, '../index.html'), //以这个以某某html5文件为模板生产对应的html5文件
            //     inject: 'body',
            //     minify: { removeAttributeQuotes: true },
            //     chunks: ['main', 'other', 'a1', 'a2'] //和入口的key值进行对应
            // }),
            new htmlPlugin({
                filename: 'index.html', //在导出到目录下生产的html5文件  默认文件名为index.html
                template: path.join(__dirname, '../index.html'), //以这个以某某html5文件为模板生产对应的html5文件
                inject: 'body',
                minify: { removeAttributeQuotes: true },
                chunks: ['other', 'boundle_[name]'] //和入口的key值进行对应
            }),
            // 第三方库进行注册挂载到$或jQuery上面 在模块页面可以使用
            // new webpack.ProvidePlugin({
            //     $: 'jquery',
            //     jQuery: 'jquery'
            // }),
            // 推荐mode:production使用
            // new CleanWebpackPlugin()

            /* 打包后css文件单独抽取到一个文件中 */
            new MiniCssExtractPlugin({
                filename: "css/[name].css", //对应的是输入文件的key值
                chunkFilename: '[id].css', //此选项确定非输入块文件的名称。
            }),
            //过滤不用的语言包
            // new webpack.IgnorePlugin({
            //     resourceRegExp: /^\.\/locale$/,
            //     contextRegExp: /moment$/
            // }),
            new webpack.IgnorePlugin(/^\.\/locale/, /moment$/),
            // new MiniCssExtractPlugin({
            //     filename: "[name].css" //对应的是输入文件的key值
            // })
            //观察打包的文件数据  观察的时候 打开 用 不观察的时候注释掉
            new BundleAnalyzerPlugin()

        ],
        // 优化 可以配置一些优化的插件
        optimization: {
            // js代码公共部分进行抽离
            splitChunks: {
                // include all types of chunks
                chunks: 'all', //async只针对异步加载模块进行拆分 可选值有all | initial  all针对静态页面进行分离
                minSize: 0, // 模块最少大于30KB才进行拆分
                maxSize: 0, // 如果超出maxSize 会进一步进行拆分  最好设置为0
                minChunks: 1, //模块最少引用一次就进行拆分  模块引入最少一次才进行拆分
                // axAsyncRequests: 30, //异步加载时发送的请求数量 不超过30  超过30不拆分
                maxInitialRequests: 30, //页面初始化时间发送的请求数量最大不能超过30 超过30不拆分 
                automaticNameDelimiter: '~', //默认的连接符
                name: true, //拆分的chunk名自动生成
                cacheGroups: { // 缓存组配置 上面配置读取完成后进行拆分 如果需要多个模块拆分到一个文件  就需要缓存 所以为缓存组
                    //自定义缓存组名
                    // vendors: {
                    //     name: 'vendors',
                    //     test: /[\\/]node_modules[\\/]/, //检查node_modules目录 只要模块在该目录下就使用上面配置拆分到这个组
                    //     priority: -10 //权重-10  决定哪个组优先匹配 例如 node_modules下有个模块要拆分 同时满足vendors和default组 就会分打到wendors组
                    // },
                    // 默认缓存组名
                    default: {
                        minChunks: 2, //最少被引用两次才被拆分
                        priority: -2, //权重-20
                        reuseExistingChunk: true //如果主入口中引入了两个模块 其中一个引用了另一个 直接复用 无需再引用
                    }
                }
            }
        },
        // 设置开发模式

        // 设置依赖图片  样式 高级语法js
        module: {
            // 构建性能 
            // noParse: /jquery|moment/, //不去解析jquery中的依赖库
            rules: [{
                    test: /\.css$/, //以.css结尾
                    // css - loader  解析css文件
                    //style - loader 把css结果放到Html文件中 使其生效 动态加载到html中 
                    // use: ['style-loader', 'css-loader'] //使用style-loader css-loader进行对css处理  从右到左管道形式进行处理
                    //style以内联格式动态展示
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] //抽取到一个css文件
                },
                { //以.less结尾的文件 管道形式从右到左less-loader解析成为css  css-loader解析css文件 style-loader把
                    //文件.less文件放到html中
                    test: /\.less$/,
                    // use: ['style-loader', 'css-loader', 'less-loader'],
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'], //抽取到一个css文件
                },
                { //以.less结尾的文件 管道形式从右到左less-loader解析成为css  css-loader解析css文件 style-loader把
                    //文件.less文件放到html中
                    test: /\.sass$/,
                    // use: ['style-loader', 'css-loader', 'sass-loader'],
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'], //抽取到一个css文件
                },
                {
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
                            esModule: false
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
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        // options: {
                        //     presets: ['@babel/preset-env'],
                        //     plugins: ['@babel/plugin-proposal-class-properties', "@babel/plugin-transform-runtime"]
                        // }
                    },
                    exclude: /node_modules/, //移除对node_modules目录下的js文件处理
                    include: path.resolve(__dirname, '../src')
                },
                // {
                //     //处理js高级语法 es6 es7转换为es5以下 支持老版浏览器
                //     // npm i babel-loader @babel/core @babel/preset-env --save-dev
                //     //babel-loader相当于@bebl/core和@babel/preset-env的桥梁
                //     //@babel/core 核心
                //     //@babel/preset-env  语法 预设 就是把高级语法转为老版本浏览器识别的js语法
                //     /**
                //      * 预设 @babel/preset-env
                //                @babel/preset-flow
                //                @babel/preset-react
                //                @babel/preset-typescript
                //      */
                //     /**
                //      * 配置  options:{presets:['@babel/env']} 这是env预设 多个预设 这是其中一个预设
                //      * 
                //      */
                //     /**
                //      * 插件 解决更高级语法 插件多个
                //      * plugins:['@babel/plugin-proposal-class-properties']
                //      */
                //     /**
                //      * 插件大全  
                //      * @babel/plugin-proposal-class-properties  解决语法有class类高级语法
                //      */
                //     /**
                //      * 对于一些js文件的语法不进行转换或解析
                //      * exclude:/node_modules/
                //      */
                //     /**
                //      * 对于es6的生产器generator语法  保存状态 
                //      * 格式 function* 函数(){
                //      *              yield 输出的语句
                //      *              yield  输出的语句
                //      *               yield 输出的语句 
                //      * return 
                //      * }          
                //      * 函数调用() 》返回的是一个Generator
                //         用一个变量去接收返回的结果
                //         const ga = 函数()
                //         ga.next()  抛出yield的结果 多个ga.next()执行 返回对应数的yield结果 直到done为true
                //         for (v of ga){
                //           v的值只针对yield后面的值
                //         }
                //         安装的插件和基石 npm install --save-dev @babel/plugin-transform-runtime
                //                                      npm install --save @babel/runtime
                //      */
                //     test: /\.js$/,
                //     use: {
                //         loader: 'babel-loader',
                //         /**
                //          * 对于可管理性 可以把配置js语法的options配置 放在.babelrc文件下进行配置 方便进行管理
                //          */
                //         // options: {
                //         //     presets: ['@babel/preset-env'],
                //         //     plugins: ['@babel/plugin-proposal-class-properties', "@babel/plugin-transform-runtime"]
                //         // }
                //     },
                //     exclude: /node_modules/
                // },
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

/* ---------------------------------------------------------------------------------------------------- */
/**
 * 配置项目的环境变量 项目无论什么地方都可以访问
 * 在production和development生产和开发js文件 
 * // 定义环境变量 书写 'true'  '123' '"搜索"' 相当于eval('true') 函数
 *  new webpack.DefinePlugin({
            ENVIRONMENT: '"development"'
        })

        ENVIRONMENT变量可以项目每个地方都可以访问的到 就可以判断生产环境用production的接口 开发环境用测试接口
 */
/* ------------------------------------------------------------------------------------------- */
/**
 * 跨域(因为index.html在另外的服务器下面 而另外一个服务器有些数据要用 就进行跨域拿到)
 * 1 jsonp 老版本 script脚本发送请求 函数调用 只支持get请求
 * 2 cors  后端直接配置 
 * 后端 node 后端  const cors = require('cors')
 * app.use(cors())   //原理是给响应头 添加了 Access-Control-Allow-Origin: *   *容许都可以请求
 * 
 *前
 * 3 http proxy 服务器向服务器发送请求  （webpack-dev-server向存放数据的服务器发送请求)
 */