"use strict";
/**
 * 包裹app层
 * 采用的是设计模式中的模块模式，定义app对象，为其挂载方法
 */
const http = require("http");
let app = (exports = module.exports = {});
/**
 * 初始化app对象需要的一些基础设置
 * paths: 存放所有使用get方法注册的请求，单体对象的格式为:
 * {
 *     pathURL  请求的地址
 *     cb  请求对应的回调函数
 * }
 */
app._init = function init() {
  //用来保存一些环境变量的设置信息
  this.setting = {};
  this.paths = [];
  this._defaultConfiguration();
};
/**
 * 设置环境变量env，后期迭代预留
 */
app._defaultConfiguration = function defaultConfiguration() {
  let envp = process.env.NODE_ENV;
  console.log("envp:" + envp);
  //而在JavaScript中，||不一定返回布尔结果，它的运算规则为：返回第一个不为false的那个值（对象亦可），或者是返回最后一个值（如果全部都是false的话）。
  let env = process.env.NODE_ENV || "development";

  this._set("env", env);
  this._set("jsonp callback name", "callback");
};
/**
 * 对app中setting对象的操作，为后期迭代预留
 */
app._set = function set(key, val) {
  if (arguments.length === 1) {
    this.setting[key];
  }
  this.setting[key] = val;
};
/**
 * http.createServer 中的回调函数最终执行，遍历paths，确定调用哪个get函数中的回调函数
 */
app.handle = function handle(req, res) {
  let pathURL = req.url;
  for (let path of this.paths) {
    if (pathURL === path.pathURL) {
      //执行回调函数
      path.cb(req, res);
    }
  }
};
/**
 * 启动http服务
 */
app.listen = function listen() {
  //启动http服务
  let server = http.createServer(this);
  return server.listen.apply(server, arguments);
};
/**
 * 实现app的get接口，主要是对所有的get请求进行注册，方便handle中实现精准回调
 */
app.get = function get(path, cb) {
  let pathObj = {
    pathURL: path,
    cb: cb,
  };
  this.paths.push(pathObj);
};
