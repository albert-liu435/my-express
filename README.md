# my-express

express 学习
参考：https://github.com/kaisela/myexpress

npm i --registry=http://registry.npm.taobao.org

参考：https://www.cnblogs.com/kaisela/p/12486103.html



express有两大核心，第一个是路由的处理，第二个是中间件装载。理解路由的实现尤为关键。在上一次迭代中，我们是在appliction中定义了一个paths数组，用来预存path和callback的对应关系并且他们之间的关系我们视为简单的一对一。在迭代二中，我们path和callback的关系变得复杂起来，不但从一对一变成了一对多，而且还引入了method。对于迭代二的整个实现过程，我们可以分解为以下几个步骤：

1、创建route实例确定path和route实例的关系，path通过path-to-regexp包进行正则解析

2、在path一定的情况下，在route实例中确定method和callback对应预存

3、通过application的listen拦截所有请求

4、分析url，遍历所有的path，与path的正则进行匹配找到path对应的route

5、匹配request中的method，遍历path对应的route中所有的callback，method的关系，找到method对应的callback，逐个执行。

从以上的描述中path和route的关系，method和callback的关系需要地方存放。在此引入Layer类。而整个服务的route执行流程等放入Router类中管理。至此，路由由3个类组成：Router，Layer，Route。关系如下图所示
