// 这个文件是进行分析
// webpack - bundle - analyzer
// 先生成 stats.json文件
// package.json配置
// webpack--profile--json > stats.json  --config ./build/production.js    指定好配置文件

// webpack - bundle - analyzer工具进行分析
//  npm install--save - dev webpack - bundle - analyzer
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// module.exports = {
//     plugins: [
//         new BundleAnalyzerPlugin()
//     ]
// }
// 启动这个配置文件
//
//npm install -g cross-env
// 运行跨平台设置和使用环境变量的脚本
/* {
    "scripts": {
        "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
    }
    NODE_ENV环境变量将由cross-env设置

打印process.env.NODE_ENV === 'production 
} */