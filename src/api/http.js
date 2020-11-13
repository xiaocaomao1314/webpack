const axios = require('axios')
const http = {
    // 'development': 'http://localhost:9998',
    'development': '',
    'production:': 'http://localhost:9998'
}

// axios.defaults.baseURL = http[ENVIRONMENT]
// 反向代理请求当前目录下的请求地址
axios.get('/api/serach').then(res => {
    console.log("响应数据成功", res)
}, err => {
    console.log("服务器响应失败")
})