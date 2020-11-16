const fs = require('fs')
const cheerio = require('cheerio')
const path = require('path')
module.exports = class HelloPlugins {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        console.log("你好 我被执行了")
            // 给compiler注册钩子事件
        compiler.hooks.afterEmit.tap('HelloPlugins', (compilation) => {
            console.log("我被发射了", compilation)
            const keys = Object.keys(compilation.assets)
            console.log(keys)
                // 读取index.html
            const html = fs.readFileSync(path.join(process.cwd(), this.options.template), 'utf-8')
                // 读取的index.html文件加载完
            const $ = cheerio.load(html)
                // 把scripty标签加入加载完的html内的body标签内
            $(`<script src="${path.join(process.cwd(),'./dist/',keys[0])}"></script>`).appendTo('body')
                // $.html() 生产添加的js文件的html 写入到dist文件下
            fs.writeFileSync(path.join(process.cwd(), './dist/', this.options.filename), $.html())
        })


        // tap注册的是同步事件
        // emit done两个事件
        // compiler.hooks.done.tap('HelloPlugins', (stats) => {
        //     console.log("我结束了", stats)
        // })
    }
}