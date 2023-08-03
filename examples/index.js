const express = require("../index.js");
const app = express();
let pathJson = {};
app.listen(3000); // 启动端口为3000的服务



// localhost:3000/path 时调用
app.get("/path", function (req, res, next) {
  console.log("visite /path , send : path");
  // res.end('path')
  pathJson.index = 1;
  next();
});
// localhost:3000/path 时调用，先走第一个，再走这个
app.get("/path", function (req, res) {
  console.log("visite /path , send : path");
  pathJson.end = true;
  res.end(JSON.stringify(pathJson));
});
// localhost:3000/ 时调用
app.get("/", function (req, res) {
  console.log("visite /, send: root");
  res.end("root");
});
// 发生post请求的时候调用
app.post("/post/path", function (req, res) {
  res.end("post path");
});
// 输出传入的id
app.get("/get/:id", function (req, res) {
  res.end(`{"id":${res.params.id}}`);
});
exports = module.exports = app;


//总结一下当前expross各个部分的工作。

//application代表一个应用程序，expross是一个工厂类负责创建application对象。Router代表路由组件，负责应用程序的整个路由系统。组件内部由一个Layer数组构成，每个Layer代表一组路径相同的路由信息，
//具体信息存储在Route内部，每个Route内部也是一个Layer对象，但是Route内部的Layer和Router内部的Layer是存在一定的差异性。

//Router内部的Layer，主要包含path、route、handle(route.dispatch)属性。 Route内部的Layer，主要包含method、handle属性。 如果一个请求来临，会现从头至尾的扫描router内部的每一层，而处理每层的时候会先对比URI，
//相同则扫描route的每一项，匹配成功则返回具体的信息，没有任何匹配则返回未找到。