## 无依赖

- [registerScroll](https://github.com/niyingfeng/plugin#registerscroll):对于滚动到某一位置触发事件

## zepto plugin

- [scrollToDo](https://github.com/niyingfeng/plugin#scrolltodo): 主要用于滚动动态加载图片



## scrollToDo

> 应用场景：图片惰性加载 随滚动位置来进行是否加载图片的判断
> 具有滚动延时 立即处理 手动处理三种模式
> 不处理图片逻辑 放置于callback中用户自己处理
> 并且支持ajax加载后的惰性处理

参数均可在实例化之后再做改变调整

```
seletor 加载的选择符
callback 滚动触发的回调函数
distance 底部显示距离开始加载
lazyStatus 是否启用滚动惰性加载状态码
container 滚动容器
lazyStatus 选择模式默认为 scroll，可在实例化或者构建之后配置
  scroll 随着页面滚动加载
  trigger 触发加载 会预先加载前面可配数量（属性 triggerNumber）的图片 之后手动触发加载 
  direct 直接加在所有图片模式

var scrollToDo = $.scrollToDo({
    seletor:'.img_container', 
    distance: 100,
    lazyStatus: 'scroll',
    callback:function($el){
        $el.attr('src', $el.attr('data_src'));
    }
});
scrollToDo.init(); // 绑定监听滚动事件
// 作用与动态添加dom节点后重置对象
scrollToDo.reset();

var scrollToDo = $.scrollToDo({
    seletor:'.img_container', 
    triggerNumber: 3, // 初始化加载3张 其余手动触发setCurrentIndex 设置当前焦点图片 加载其后面的 2张
    lazyStatus: 'trigger', // 固定预先加载若干张图片
    callback:function($el){
        $el.attr('src', $el.attr('data_src'));
    }
});
scrollToDo.init(); 
scrollToDo.setCurrentIndex(3)

var scrollToDo = $.scrollToDo({
    seletor:'.img_container', 
    lazyStatus: 'direct', // 即时加载
    callback:function($el){
        $el.attr('src', $el.attr('data_src'));
    }
});
scrollToDo.init(); 
```


## registerScroll

> 注册实现滚动加载事件对象
> 设置滚动高度 当可视区域底部滑动到该高度的时候 执行回调

```
var a = new RegisterScroll(scrollDom);
```

**scrollDom 参数**
可选 设置滚动的节点

```
a.register(opts);
```

**opts 参数**
必选 内部属性 可为对象或者对象数组
name: 'xxxx',   (必选)触发对象的key
scrollToValue: 100, (必选)滚动到的触发点
isRepeatTrigger: true, (可选)满足条件是否重复触发 默认为false
isTriggerNow: true, (可选)注册时候是否立即进行判断触发
callback: function(){},   //(必选) 

```
// opts 参数与register一致
a.trigger(opts);
opts 参数与register一致

// 去掉key为name的注册回调
a.cancel(name);

// 销毁a滚动事件
a.destroy();
```