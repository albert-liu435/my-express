const mixin = require("merge-descriptors");
let proto = require("./application");

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
  app.init();
  return app;
}
