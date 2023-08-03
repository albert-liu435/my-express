"use strict";

/**
 *Router类的实现主要关注在route方法和handle两个方法中，一个是用来注册，一个是遍历注册的数组. 
 * 
 * 实现路由的遍历等功能
 */

const debug = require("debug")("router");
const Route = require("./route");
const Layer = require("./layer");
let methods = require("http").METHODS;

const mixin = require("merge-descriptors");

/**
 *
 */

let proto = (module.exports = function (options) {
  let ops = options || {};
  //定义路由函数
  function router(req, res, next) {
    //路由 处理函数handle
    router.handle(req, res, next);
  }
  //将两个对象进行合并,router为上面定义的函数
  mixin(router, proto);
  //路由参数对象
  router.params = {};
  //路由参数数组，里面存放了layer
  router.stack = [];
  return router;
});

/**
 * 创建route实例确定path和route实例的关系，path通过path-to-regexp包进行正则解析
 *
 * 将path和route对应起来，并放进stack中，对象实例为layer
 */
proto.route = function route(path) {
  //创建一个Route
  let route = new Route(path);

  let layer = new Layer(
    path,
    {
      end: true,
    },
    //表示route有了dispatch方法
    route.dispatch.bind(route)
  );
  layer.route = route;
  //
  this.stack.push(layer);
  return route;
};

/**
 * handle方法就比较复杂，主要分为两块，一个是对错误的处理，发生错误是调用app中的finalhandle，一个是对stack数组的遍历，找到url匹配的路由。对stack遍历的方式采用的是next方法递归调用的方式。这种思想类似于es6中的Iterator接口的实现
 * 
 * 
 * 遍历stack中layer,并执行layer.handle_request
 *
 * 遍历stack数组，并处理函数, 将res req 传给route
 */

proto.handle = function handle(req, res, out) {
  //执行接受到 的请求
  let self = this;
  debug("dispatching %s %s", req.method, req.url);
  let idx = 0;
  let stack = self.stack;
  //请求 url
  let url = req.url;
  let done = out;
  next(); //第一次调用next
  function next(err) {
    let layerError = err === "route" ? null : err;
    if (layerError === "router") {
      //如果错误存在，再当前任务结束前调用最终处理函数
      setImmediate(done, null);
      return;
    }
    //
    if (idx >= stack.length) {
      // 遍历完成之后调用最终处理函数
      setImmediate(done, layerError);
      return;
    }

    let layer;
    let match;
    let route;
    //遍历stack
    while (match !== true && idx < stack.length) {
      //从数组中找到匹配的路由
      layer = stack[idx++];
      match = matchLayer(layer, url);
      route = layer.route;
      if (typeof match !== "boolean") {
        layerError = layerError || match;
      }

      if (match !== true) {
        continue;
      }
      if (layerError) {
        match = false;
        continue;
      }
      //获取请求 方法
      let method = req.method;
      let has_method = route._handles_method(method);
      if (!has_method) {
        match = false;
        continue;
      }
    }
    if (match !== true) {
      // 循环完成没有匹配的路由，调用最终处理函数
      return done(layerError);
    }
    res.params = Object.assign({}, layer.params); // 将解析的‘/get/:id’ 中的id剥离出来
    layer.handle_request(req, res, next); //调用route的dispatch方法，dispatch完成之后在此调用next，进行下一次循环
  }
};
/**
 * 判断url是否符合layer.path的规则
 */
function matchLayer(layer, path) {
  try {
    //判断是否匹配
    return layer.match(path);
  } catch (err) {
    return err;
  }
}
