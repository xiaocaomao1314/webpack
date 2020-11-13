const loaderUtils = require("loader-utils")
module.exports = function(source) {
    // source是读取的js文件内容
    // 如果文件1.js文件引入文件2.js那么逐个读取内容后进行处理
    const options = loaderUtils.getOptions(this);
    // this.query建议不使用
    console.log(source, "看看", this.query, options) //this注入其中
    return source.replace(/明天/g, options.name)
}