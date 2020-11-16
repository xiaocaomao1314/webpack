(() => {
    var __webpack_modules__ = ({
        
        "./src/index.js": ((module, __unused_webpack_exports, __weipack__require) => {

            eval(`const a = __weipack__require("./src/a.js");

console.log(a.txt);`);

        }),
        
        "./src/a.js": ((module, __unused_webpack_exports, __weipack__require) => {

            eval(`const b = __weipack__require("./src/b.js");

module.exports = {
  txt: b.txt + "下雪了"
};`);

        }),
        
        "./src/b.js": ((module, __unused_webpack_exports, __weipack__require) => {

            eval(`module.exports = {
  txt: "上帝是星期二"
};`);

        }),
        


    });
    var __webpack_module_cache__ = {};

    function __weipack__require(moduleId) {
        if (__webpack_module_cache__[moduleId]) {
            return __webpack_module_cache__[moduleId].exports;
        }
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __weipack__require);
        return module.exports;
    }
    (() => {
        eval(`const a = __weipack__require("./src/a.js");

console.log(a.txt);`);
    })();
})();