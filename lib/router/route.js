"use strict";
/**
 * route方法简单明了一看就明白，最后将route返回到app中，再调用当前的实例route[method]方法注册method和callbacks的关系
 * 
 * Route类的实现主要是在route[method]方法和dispatch，和Router中的route和handle的功能类似，只是route[method]注册是的method和callback的对应关系，而dispatch遍历的则是callbacks

route[method]同样比较简单，主要是将app中对应method的第二个以后的参数进行遍历，并将其和method对应起来

dispatch采用的是和router中的handle一样的方式--> next递归遍历stack。处理完成后回调router的next
 * 
 * 将path和fn的关系实现一对多将path和fn的关系实现一对多
 * 
 * route 模块，存放管理path值一定时的method和callback的关系数组
 */

const debug = require("debug")("express:router:route");
const Layer = require("./layer");
let methods = require("http").METHODS;
///Route中存在method对应的函数
module.exports = Route;

const toString = Object.prototype.toString;

/**
 * 采用设计模式中的工厂模式实现
 */

function Route(path) {
  this.path = path;
  this.stack = []; //method fun对应数组,Layer实例
  this.methods = {};
}
/**
 * 对同一path对应的methods进行注册，存放入stack中
 */
methods.forEach((method) => {
  //method变成小写
  method = method.toLowerCase();
  //路由方法对应的函数
  Route.prototype[method] = function () {
    //参数，handles是一个含有 三个参数的函数的 数组
    let handles = arguments;

    for (let i = 0; i < handles.length; i++) {
      let handle = handles[i];
      //判断是否为函数
      if (typeof handle !== "function") {
        // 如果handle不是function，则对外抛出异常
        let msg = `Route.${method}() requires a callback function but not a ${type}`;
        throw new Error(msg);
      }

      debug("%s %o", method, this.path);
      // 注册method和handle的关系
      let layer = new Layer("/", {}, handle);
      layer.method = method;

      this.methods[method] = true;
      this.stack.push(layer);
    }
    return this;
  };
});

/**
 * 遍历stack数组，并处理函数
 */
Route.prototype.dispatch = function dispatch(req, res, done) {
  let idx = 0;
  let stack = this.stack;
  if (stack.length === 0) {
    return done(); // 函数出来完成之后，将执行入口交给母函数管理，此处的done为router handle中的next
  }

  let method = req.method.toLowerCase();
  req.route = this;
  next();
  function next() {
    let layer = stack[idx++];
    if (!layer) {
      // 当循环完成，调回router handle中的next
      return done();
    }
    if (layer.method && layer.method !== method) {
      // 不符合要求，继续调用next进行遍历
      return next();
    }

    layer.handle_request(req, res, next);
  }
};
/**
 * 判断当前route实例是否有注册method方法
 */
Route.prototype._handles_method = function _handles_method(method) {
  return Boolean(this.methods[method.toLowerCase()]);
};
