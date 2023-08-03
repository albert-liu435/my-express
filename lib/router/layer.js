/**
 * 装置path，method cb对应的关系
 * ayer类的作用主要是关系的关联，path和route的关联，path对应的route中method和callback的关联。再有就是对path的处理，主要的方法也有两个：match、handle_request

handle_request：主要是执行layer中的handle，在router中layer对应的handle为layer.route对应的dispatch，在route中的handle对应的则是app的method传进来的callback函数

match：对uri和path进行匹配，匹配上了返回true否侧false。中间还对'/get/:id'式的路由中的id进行参数剥离，存入params中.在这个类中用到了path-to-regexp包，主要是对path进行解析，https://www.npmjs.com/package/path-to-regexp
 * 
 */
const debug = require("debug")("layer")("express:router:layer");
const pathRegexp = require("path-to-regexp").pathToRegexp;
exports = module.exports = Layer;

/**
 * 采用设计模式中的工厂模式完成此类
 * 关系类，path对应的回调fn，path对应的fn为route实例对应的dispatch方法，在dispatch中遍历method对应的fn，找到符合条件的fn
 * 在route中是method对应的回调fn
 */

function Layer(path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn);
  }
  let opts = options || {};
  //函数，为Route.prototype.dispatch
  this.handle = fn;
  this.params = undefined;
  this.path = undefined;
  //正则表达式
  this.regexp = pathRegexp(path, (this.keys = []), opts); // path: /user/:id ,keys:[{name: id, , prefix: '/', ...}]
}

//处理请求函数
Layer.prototype.handle_request = function handle(req, res, next) {
  //处理函数
  let fn = this.handle;
  fn(req, res, next);
};

/* Layer.prototype.handle_error = function handle_error(err, req, res, next) {
  let fn = this.handle
  try {
    fn(err, req, res, next)
  } catch (err) {
    next(err)
  }
} */
//判断路径是否 匹配
Layer.prototype.match = function match(path) {
  let match;
  if (path) {
    match = this.regexp.exec(path);
  }

  if (!match) {
    this.params = undefined;
    this.path = undefined;
    return false;
  }

  this.params = {};
  this.path = match[0];
  if (this.keys) {
    let keys = this.keys;
    let params = this.params;
    for (let i = 1; i < match.length; i++) {
      let key = keys[i - 1];
      let prop = key.name;
      let val = decode_param(match[i]);

      if (val !== undefined) {
        params[prop] = val;
      }
    }
  }
  return true;
};

/**
 * 对传过来的编码过的值进行解码
 */
function decode_param(val) {
  if (typeof val !== "string" || val.length === 0) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = "Failed to decode param '" + val + "'";
      err.status = err.statusCode = 400;
    }

    throw err;
  }
}
