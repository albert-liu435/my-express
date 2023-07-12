function init() {
  //用来保存一些环境变量的设置信息
  this.setting = {};
  this.paths = [];
  console.log(this);
}

init();


let app={}
app._init = function init() {
  //用来保存一些环境变量的设置信息
  // this.setting = {};
  // this.paths = [];
  console.log("_init");

};

app._init();
