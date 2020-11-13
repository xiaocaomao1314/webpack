const path = require('path')
module.exports = {
    entry: "./src/index.js",
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './dist')
    },
    mode: 'development',
    /* 自定义loader */
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: './loaders/loader1.js',
                options: {
                    name: "大后天"
                }
            }
        }]
    }
}