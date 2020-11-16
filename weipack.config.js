const path = require('path')
const HelloPlugin = require('./plugins/Hello')
module.exports = {
    entry: "./src/index.js",
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './dist')
    },
    mode: 'development',
    module: {
        rules: [{
            test: /\.js$/,
            // use: [
            //     "./loaders/loaders1.js",
            //     "./loaders/loaders2.js",
            //     "./loaders/loaders3.js"
            // ]
            use: {
                loader: "./loaders/loaders1.js",
                options: {
                    name: "上帝"
                }
            }
        }]
    },
    plugins: [
        new HelloPlugin({
            filename: 'index.html',
            template: './index.html'
        })
    ]
}


/* 
自定义webpack
步骤1 进行打包配置
步骤2 分析配置文件

分析配置文件
读取配置文件entry引入的js文件 用fs.readFileSync(js文件目录, 'utf-8') 读取
用@babel/parser的javascript解析器进行对字符串语法树解析  npm i @babel/parser -S
用@babel/traverse是配合@babel/parser一起使用来遍历和更新抽象语法树的节点  npm install --save @babel/traverse
用@babel/generator是对@babel/parser生产的抽象语法树进行解析 转换成可读的js代码 npm install --save-dev @babel/generator
用递归 把每个文件的js文件封装到一个对象 
用模板引擎把生成的语句写入到指定的dist的文件中 ejs模板引擎

webpack 自定义loader
loader是个函数 读取的js文件内容作为参数传入自定义的函数 进行处理
获取loader的配置参数options 需要loader-utils配合
npm i loader-utils
const loaderUtils = require("loader-utils")
const options = loaderUtils.getOptions(this); 
loader可以设置 前置 > 行内 > 普通 > 后置  //行内不推荐使用

自配置的webpack 自定义loader
loader是个函数封装后 对被打包的文件 还没有变成抽象语法树之前进行的修改 编辑 删除 增加等 

自行配置webpack自定义plugin
plugin是 跟webpack生命周期有关
cheerio 可以直接使用jQuery API 用爬虫
compiler针对的是不变的webpack环境 
compilation对象针对随时可变的项目文件 只要文件改动 compilation就会被重新创建
每次打包都有一个唯一的hash值
compilation.assets 结果就是文件列表
webpack事件流程核心是tapable 发布订阅模式
1 定义钩子  生命周期
2 注册钩子事件

// 步骤
const {SyncHook} = require("tapable");
1 先注册钩子函数   
this.hooks={
emit: new SyncHook(['compilation']), 
afterEmit: new SyncHook(['compilation']),
done: new SyncHook(['stats']),
}
2 监听钩子函数
 this.hooks.afterEmit.tap('HelloPlugins',()=>{}),
3 执行钩子函数
this.hooks.afterEmit.call()
*/