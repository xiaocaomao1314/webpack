import './css/index.css'
import img from './img/big.png';
// 引入sass
import './sass/index.sass'
// 引入less
import './less/index.less'

import 'bootstrap/dist/css/bootstrap.css'
// import './api/http'
import './js/hot'
var imgElement = document.createElement('img');
imgElement.src = img;
// console.log($, window.$, "看看全局是不是能用")
document.body.appendChild(imgElement);
const a = function() {
    console.log("老板浏览器")
}
setTimeout(function() {
    console.log("老版本的")
}, 100)
setTimeout(() => {
    console.log("新版本支持天天宇通有")
}, 100)
a()
const b = () => {
    console.log("高级语法")
}
b()
    //对于更高级的语法    我们必须先用到babel插件
class Dog {
    static color = 'red'
}
const dog = new Dog()
console.log(dog, Dog.color)
    //用generator处理异步的事情
function* fun() {
    yield setTimeout(() => { console.log(33) }, 10)
    yield setTimeout(() => { console.log(34) }, 10)
    yield setTimeout(() => { console.log(35) }, 10)
    yield setTimeout(() => { console.log(39) }, 10)
    return 100
}
console.log(fun())
const f = fun()
console.log(f.next())
console.log(f.next())
console.log(f.next())
console.log(f.next())
console.log(f.next())

console.log(f.next())

for (const v of fun()) {
    console.log(v)
}
const str = '现在是是是知识文化是应到咯'
console.log(str.includes('知识'), "解决老版本浏览器")
console.log(ENVIRONMENT, "看看这是什么环境是生产还是开发", module.hot)
    /* 局部更新一个地方 只会打印局部的地方 容易调试
    生产环境不适合 只在 开发环境有用  在里面只些require()引入就行了 先判断是否moudle.hot存在 */
    // module.hot.accept('./js/hot.js', () => {
    //     const log = require('./js/hot.js')
    //     console.log(log, "更新的模块")
    // })

const mou = require('./js/tree')
console.log(mou.a)
import ('jquery').then(({ default: $ }) => {
        console.log($, "求扩散")
    })
    /* webpack  mode="production"  自带的优化*/
    /**
     * @1  tree  shaking 模式  依赖于ES6的import 与 export静态结构特性 实现基础优化
     * import  与 export 是静态结构    没用的方法 打包移除没使用的
     * require是动态导入   没用的方法也使用
     * 
     * @2  scope hoisting 打包那些预先引用一次进行预执行结果打包   基于ModuleConcatenationPlugin插件 
     * contst a = 12;
     * const b = 34;
     * console.log(a+b)   》打包后只有console.log(46) 因为预执行
     * 
     * @3  代码压缩
     * 所有的代码使用UglifylsPlugin插件压缩 混淆
     */

/* --------------------------------------------------------------------------------------------- */
/**
 * css优化
 * npm install --save-dev mini-css-extract-plugin
 * @1 整合到一个css文件  外部引入
 * 
 * @2 给css添加前缀 处理兼容问题 -webkit-transform:rotate(40deg)
 * postcss-loader 基于 autoprefixer
 * npm i -D postcss-loader autoprefixer@8.0.0
 * css-loader 后面 postcss-loader
 * 并且在根目录添加 postcss.config.js文件  对应着postcss-loader 
 * 并且 配置 
 * 简易
 * module.exports = {
    plugins: [require('autoprefixer')]
}

    @3  压缩
      npm install --save-dev optimize-css-assets-webpack-plugin
      配置css压缩会覆盖mode="production"默认的配置 必须  npm install terser-webpack-plugin@4.2.3 --save-dev
       optimization: {
    minimizer: [new CssMinimizerPlugin(),new TerserPlugin()],
  },
 */

/* ---------------------------------------------------------------------------------------- */
/**
 * js优化
 * @1  code Splitting 是webpack用到的重要的优化特性之一 把代码分离到不同的bundle中 然后按需加载或并行加载这些文件
 *  代码分离可以用于 获取更小的bundle 
 * 三种常用代码分离法
 * 1 入口起点 ：手动配置entry   缺点重复的代码太多
 * 2 防止重复 使用 splitChunksPlugin去重和 分离chunk
 *  optimization: {
          // js代码公共部分进行抽离
            splitChunks: {
                // include all types of chunks
                chunks: 'all'
            }
        },
 * 3 动态导入【dynamic imports] 通过模块的内联函数用来分离代码
          npm i -D @babel/plugin-syntax-dynamic-import
          注册插件
           "plugins": [ "@babel/plugin-syntax-dynamic-import"]
           使用
// import ('jquery').then(({ default: $ }) => {
//         console.log($, "看舒克舒克是")*/
/* ----------------------------------------------------------------------------------------- */
/**
 * 构建性能
 * @1  module:{
 * noParse:/jquery/,//不去解析jquery中的依赖库
 * }
 * 我们对类似jq这类依赖库，一般会认为不会引用其他的包(特殊除外,自行判断)。所以，对于这类不引用其他的包的库，我们在打包的时候就没有必要去解析，这样能够增加打包速率
 * 
 * @2  对于第三方库里面有很多国际语言包 打包会很占用空间 按需引入语言包 从而使得构建效率高 打包生产文件小
 * 1 首先moment依赖的语言包
 * 2 使用IgnorePlugin插件忽略依赖
 * 3 需要某些依赖时自动引入
 * 
 * new webpack.IgnorePlugin({
  resourceRegExp: /^\.\/locale$/,   //要忽略的资源路径
  contextRegExp: /moment$/   //忽略资源的上下文
});
或
 new webpack.IgnorePlugin(/^\.\/locale/, /moment$/)
 注意
 IgnorePlugin插件和noParse有时候会有矛盾 要注意 调优

 @3 DllPlugin 动态链接库
 思想  将一些不做修改的依赖文件 提前打包 这样我们开发代码 发布的时候 不需要再对这类代码进行打包 从而节省时间
 例如vue框架的项目 打包后生产Dll文件 固有的文件不需要再进行打包 直接修改就行了
 */

/* ---------------------------------------------------------------------------------------- */
/**
 * 浏览器缓存  利用浏览器缓存 不需要重启服务器 修改业务逻辑代码后  浏览器缓存还能使用  服务器访问第三方模块不需要再加载
 * 
 */

/* ----------------------------------------------------------------------------------- */
/**
 * 优化访问性能  提高覆盖率
 * 打开网页的调试器 ctrl+shift+p  输入coverage  选择show Coverage 出现覆盖率 文件用了多少 没用多少
 * 1 用动态的导入 也就是懒加载功能  
 * 2 一些代码不用的处理掉
 * 3 解决懒加载遇到的问题
 */
// 用到魔法注释 webapck 4.6.0以上
// 原理   当进入页面的时候 空闲的时间把动态导入的文件 加载过来 比方点击事件/* webpackPrefetch: true */
// import(/* webpackPrefetch: true */ 'LoginModal');


/* ------------------------------------------------------------------------------------------------ */
/**
 * webpack原理
 * 1 打包原理
 * 
 * 2 loader原理
 * 
 * 
 * 3 webpack插件原理
 * 
 * 
 * 4 ast抽象语法树
 * 
 * 
 * 5 tapable原理
 * 
 * 
 * 
 * 6 
 */