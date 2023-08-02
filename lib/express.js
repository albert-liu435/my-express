/**
 * 负责实例化Application
 * @type {(function(Object, Object, boolean=): Object)|{}}
 */
const mixin = require("merge-descriptors");
let proto = require("./application");

//https://blog.csdn.net/eee66665/article/details/123835950
//论使用 exports 暴露成员，或是 module.exports 暴露成员，最终暴露的结果，都是以 module.exports 所指向的对象为准。
exports = module.exports = createApplication;
/**
 * 创建app
 */
function createApplication() {
  //回调函数
  let app = function (req, res, next) {
    // createServer的回调函数
    app.handle(req, res, next);
  };
  //将proto合并到app
  mixin(app, proto, false);
  console.log(this)
  app._init();
  return app;
}
