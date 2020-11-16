#!/usr/bin/env node

const path = require('path')
    // console.log("生产新的指令 修改看看")
    // 1读取需要打包的配置文件
    // process.cwd()获取node进程执行的工作目录
    // path.resolve('weipack.config.js')获取weipack.config.js绝对路径
const config = require(path.resolve(process.cwd(), 'weipack.config.js'))
    // console.log(config)
    // 2通过面向对象方式对项目进行推进
const Compiler = require(path.resolve(process.cwd(), './lib/Compiler'))
new Compiler(config).start()