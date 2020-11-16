const path = require('path')
    // 读取文件
const fs = require('fs')
    // 引入javascript解析器
const parser = require('@babel/parser')
    // 引入更新节点 因为这个是es6 import 引入 所以需要.default
const traverse = require('@babel/traverse').default
    //引入解析抽象语法树
const generator = require('@babel/generator').default
    // 引入ejs模板
const ejs = require('ejs')
const {
    SyncHook
} = require("tapable");
class Compiler {
    constructor(config) {
            this.config = config
            this.entry = config.entry
            this.path = process.cwd()
            this.modulePathReative = {}
            this.rules = config.module.rules
                // 注册生命周期 即钩子函数
            this.hooks = {
                emit: new SyncHook(['compilation']), //传参数 先定义一个参数名 变量名规则方式
                afterEmit: new SyncHook(['compilation']),
                done: new SyncHook(['stats']),
            }

            if (Array.isArray(this.config.plugins)) {
                this.config.plugins.forEach(plugin => {
                    plugin.apply({
                        hooks: this.hooks
                    })
                })
            }
        }
        /* 读取文件 */
    getSource(path) {
            // console.log(path, "看看文件js")
            return fs.readFileSync(path, 'utf-8')
        }
        //依赖分享
    depAnalyse(modulePath) {
        let source = this.getSource(modulePath)
            /*         进行loader的加载器
             */
        let loaderFun = (url, obj) => {
            const loaders = require(path.resolve(this.path, url))
                // obj为undefined 那么.call的this指向不变
            source = loaders.call(obj, source)
        }
        const readBand = () => {}
        this.rules.forEach(v => {
            const { test, use } = v
            // 判断文件是js文件
            if (test.test(modulePath)) {
                // use循环 倒序循环 为读取的js文件修改

                if (Array.isArray(use)) {
                    for (var j = use.length - 1; j >= 0; j--) {
                        loaderFun(use[j])
                            // console.log(this.rules, "看看规则", use[j])

                    }
                } else if (typeof use === 'string') {
                    loaderFun(use)
                } else if (use instanceof Object) {
                    loaderFun(use.loader, { query: use.options })
                }
            }
        })


        // console.log(source)
        // 抽象语法树配置
        const options = {
                sourceType: "module" //针对es6语法设置
            }
            // 存储一个js文件require的路径
        let dependires = []
            // 生产抽象语法树
        const ast = parser.parse(source, options)
            // console.log(ast.program.body)
            // 对语法树的节点进行修改和更新 中间流程
        traverse(ast, {
            CallExpression(p) {
                if (p.node.callee.name === 'require') {
                    p.node.callee.name = "__weipack__require"
                    const pv = p.node.arguments[0].value
                        // 因为path.join('./src',pv)会变成 src/a 所以换成 './' + path.join('src', pv)
                    const pv1 = './' + path.join('src', pv)
                        //因为window系统出现\ 多个 \\+ 所以用replace
                    const pv2 = pv1.replace(/\\+/g, '/')
                        // console.log(pv2)
                    p.node.arguments[0].value = pv2
                    dependires.push(pv2)
                }
                // console.log(p.node.callee.name, "抽象语法")
            }
        });
        const code = generator(ast).code
        const ph1 = './' + path.relative(this.path, modulePath)
        const ph2 = ph1.replace(/\\+/g, '/')
        this.modulePathReative[ph2] = code
        dependires.forEach(v => {
            this.depAnalyse(path.resolve(this.path, v))
        })

    }
    emitFile() {
        // 通过读取文件把模板字符串读出来
        const template = this.getSource(path.resolve(__dirname, '../template/output.ejs'))
            // 渲染模板引擎  並且返回
        const file = ejs.render(template, {
            entry: this.entry,
            modules: this.modulePathReative
        })
        const { path: src, filename } = this.config.output
        const outputPath = path.join(src, filename)
        console.log(file)
            // 把模板写到指定的js文件
        fs.mkdir(src, () => {
            fs.writeFileSync(outputPath, file)
        })
    }
    start() {
            // 开始打包了 
            // 依赖分析
            // 生命周期打包之前
            this.hooks.emit.call()
            this.depAnalyse(path.resolve(this.path, this.entry))
            this.emitFile()
                // 发射文件之后
            this.hooks.afterEmit.call({
                    assets: { 'bundle.js': '' }
                })
                // 编译完成之后
            this.hooks.done.call()
            console.log(this.modulePathReative)
        }
        /* 抽象语法树 */
}
module.exports = Compiler