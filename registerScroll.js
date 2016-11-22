// > 注册实现滚动加载事件对象
// > 设置滚动高度 当可视区域底部滑动到该高度的时候 执行回调

// var a = new RegisterScroll(scrollDom);

// **scrollDom 参数**
// 可选 设置滚动的节点

// a.register(opts);

// **opts 参数**
// 必选 内部属性 可为对象或者对象数组
// name: 'xxxx',   (必选)触发对象的key
// scrollToValue: 100, (必选)滚动到的触发点
// isRepeatTrigger: true, (可选)满足条件是否重复触发 默认为false
// isTriggerNow: true, (可选)注册时候是否立即进行判断触发
// callback: function(){},   //(必选) 

// a.trigger(opts);

// **opts 参数**

// 与register一致

// a.cancel(name);

// 去掉key为name的注册回调

// a.destroy();

// 销毁a滚动事件

var RegisterScroll = function(scrollDom){
    var self = this;

    this.scrollDom = scrollDom || document;
    this.scrollTopDom = scrollDom || document.querySelector('body');
    this.scrollDomHeight = scrollDom?scrollDom.clientHeight:window.screen.height;

    this.scrollPointList = [];

    // 简陋的滚动事件优化机制
    this.lock = false;
    this.scrollFunc = function(e){
        if(self.lock) return;
        self.lock = true;
        self.top = self.scrollTopDom.scrollTop;

        self.scrollPointList.forEach(function(item){
            self.trigger(item);
        });

        setTimeout(function(){
            self.lock = false;
        },50);
    } 

    this.scrollDom.addEventListener('scroll', this.scrollFunc, false);
}

// 触发已注册事件
RegisterScroll.prototype.trigger = function(item){
    if(!item.triggered && item.scrollToValue < this.scrollDomHeight + this.top){
        console.log(item.name + ' trigger');
        item.callback(item);

        if(!item.isRepeatTrigger){
            item.triggered = true;
        }
    }
}
// 注册滚动触发事件
RegisterScroll.prototype.register = function(opts){
    // 接受数组与单例对象
    if(opts.scrollToValue){
        this.scrollPointList.push(opts);
        if(opts.isTriggerNow !== false){
            this.trigger(opts);
        }
    }else{
        opts.forEach(function(item){
            this.scrollPointList.push(item);
            if(item.isTriggerNow !== false){
                this.trigger(item);
            }
        });
    }
}
// 注销 纯粹只是设置为已触发
RegisterScroll.prototype.cancel = function(name){
    opts.forEach(function(item){
        if(item.name === name){
            item.triggered = true;
        }
    });
}
// 销毁本次滚动事件
RegisterScroll.prototype.destroy = function(){
    this.scrollDom.removeEventListener('scroll', this.scrollFunc, false);
}