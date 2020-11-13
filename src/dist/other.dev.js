"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import './css/index.css'
// console.log("我是other，我很独特")
// console.log("这是第三方引入使用")
// import moment from "moment";
// require('moment/locale/zh-cn');
// // 按需引入
// moment.locale('zh-cn')
// let date = moment().startOf('hour').fromNow(); // 7 分钟前
// console.log(date)
// import $ from 'jquery'
// console.log($, "节哀吧节哀吧是")
// import Vue from 'vue/dist/vue.js'
// import vueRouter from 'vue-router'
// import VueRouter from 'vue-router'
// Vue.use(vueRouter)
// const home = {
//     template: '<em>这是家庭</em>'
// }
// const apple = {
//     template: '<b>这是果园子</b>'
// }
// const router = new VueRouter({
//     routes: [
//         { path: '/home', component: home },
//         { path: '/apple', component: apple }
//     ]
// })
// new Vue({
//     el: '#app',
//     data: {
//         msg: "草帽海贼团"
//     },
//     router
// })
var app = _react["default"].createElement('h1', null, '这是react一起来看看大幅度我改改噶我清潭没啥事' + process.env.NODE_ENV);

_reactDom["default"].render(app, document.querySelector("#app"));

console.log(process.env.NODE_ENV);