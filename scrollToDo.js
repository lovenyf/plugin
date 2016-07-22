(function() {
    // 应用场景：图片惰性加载 随滚动位置来进行是否加载图片的判断
    // 具有滚动延时 立即处理 手动处理三种模式
    // 不处理图片逻辑 放置于callback中用户自己处理
    // 并且支持ajax加载后的惰性处理

    // 参数均可在实例化之后再做改变调整

    // seletor 加载的选择符
    // callback 滚动触发的回调函数
    // distance 底部显示距离开始加载
    // lazyStatus 是否启用滚动惰性加载状态码
    // container 滚动容器

    // lazyStatus 选择模式默认为 scroll，可在实例化或者构建之后配置
    //   scroll 随着页面滚动加载
    //   trigger 触发加载 会预先加载前面可配数量（属性 triggerNumber）的图片 之后手动触发加载 
    //   direct 直接加在所有图片模式

    // var scrollToDo = $.scrollToDo({
    //     seletor:'.img_container', 
    //     distance: 100,
    //     lazyStatus: 'scroll',
    //     callback:function($el){
    //         $el.attr('src', $el.attr('data_src'));
    //     }
    // });
    // scrollToDo.init(); // 绑定监听滚动事件

    // var scrollToDo = $.scrollToDo({
    //     seletor:'.img_container', 
    //     triggerNumber: 3, // 初始化加载3张 其余手动触发setCurrentIndex 设置当前焦点图片 加载其后面的 2张
    //     lazyStatus: 'trigger', // 固定预先加载若干张图片
    //     callback:function($el){
    //         $el.attr('src', $el.attr('data_src'));
    //     }
    // });
    // scrollToDo.init(); 
    // scrollToDo.setCurrentIndex(3)

    // var scrollToDo = $.scrollToDo({
    //     seletor:'.img_container', 
    //     lazyStatus: 'direct', // 即时加载
    //     callback:function($el){
    //         $el.attr('src', $el.attr('data_src'));
    //     }
    // });
    // scrollToDo.init(); 

    function scrollToDo(params){
        this.seletor = params.seletor;
        this.callback = params.callback || function(){};
        this.distance = params.distance || 50;
        this.lazyStatus = params.lazyStatus || "scroll";
        this.$container = $(params.container || document);
        // trigger 模式下预执行的数量
        this.triggerNumber = params.triggerNumber || 0;

        this.screenHeight = $(params.container || window).height();
        
        // 监控的节点列表
        this.$doms = null;
        // 滚动监听的interval
        this.interval = null;
        // scroll事件触发太过频繁调节器
        this.intervalFlog = true;

        this.nextIndex = 0;
        // 下一张需要加载的top值
        this.nextUnloadTop = 0;
        this.allDone = true;
    }
    
    // 初始化
    scrollToDo.prototype.init = function(){
        var self = this;
        this.$doms = $(this.seletor);

        switch(this.lazyStatus){
            case "scroll":
                self.scrollLoad();
                break;
            case "trigger":
                self.triggerLoad();
                break;
            case "direct":
                self.directLoad();
                break;

            default:
                break;
        }
    }

    scrollToDo.prototype.scrollLoad = function(){
        var self = this;

        if(this.$doms.length > 0){
            this.nextUnloadTop = this.$doms.eq(0).offset().top;
            this.allDone = false;
        }
            
        this.interval = setInterval(function(){
            self.intervalFlog = true;
        }, 150);

        this.$container.on('scroll.lazy',function(){
            var screenTop, $dom;

            if(self.intervalFlog){
                self.intervalFlog = false;
                screenTop = self.$container.scrollTop() || $('body').scrollTop();

                // 触发当时的 top 值 循环处理多个图片
                while((self.nextUnloadTop <= screenTop + self.screenHeight + self.distance) && !self.allDone ){
                    $dom = self.$doms.eq(self.nextIndex);
                    if( !$dom.data('stl-done') ){
                        $dom.data('stl-done', true);
                        self.callback($dom);
                        //console.log(self.nextUnloadTop +" "+screenTop +" "+self.screenHeight +" "+self.distance)
                    }

                    self.nextIndex++;
                    if(self.nextIndex < self.$doms.length){
                        self.nextUnloadTop = self.$doms.eq(self.nextIndex).offset().top;
                    }else{
                        self.allDone = true;
                    }
                }
                

                $dom = self.$doms.eq(self.nextIndex);
            }
        });

        // 在第一屏内部含有图片的 手动触发一次
        if((self.nextUnloadTop <= (self.$container.scrollTop() || $('body').scrollTop()) + self.screenHeight + self.distance) && !self.allDone ){
            setTimeout(function(){
                self.$container.trigger('scroll');
            }, 500);
        }
    }

    scrollToDo.prototype.directLoad = function(){
        var self = this;

        this.$doms.each(function(i, el){
            var $dom = $(el);
            if( !$dom.data('stl-done') ){
                $dom.data('stl-done', true);
                self.callback($dom);
                //console.log(self.nextUnloadTop +" "+screenTop +" "+self.screenHeight +" "+self.distance)
            }
        });
    }

    scrollToDo.prototype.triggerLoad = function(){
        var self = this, $dom;
        for(var i = 0, len=this.$doms.length; i<len && i<this.triggerNumber; i++){
            $dom = this.$doms.eq(i);
            if( !$dom.data('stl-done') ){
                $dom.data('stl-done', true);
                self.callback($dom);
            }
        }

        scrollToDo.prototype.setCurrentIndex = function(index){
            var self = this;
            var $dom = this.$doms.eq(index + self.triggerNumber -1);
            if($dom.length || !$dom.data('stl-done')){
                $dom.data('stl-done', true);
                self.callback($dom);
            }
        }
    }

    // 作用与动态添加dom节点后重置对象
    scrollToDo.prototype.reset = function(){
        this.$doms = $(this.seletor);

        if(this.lazyStatus === 'scroll'){
            if(this.nextIndex < this.$doms.length){
                this.allDone = false;
                this.nextUnloadTop = this.$doms.eq(this.nextIndex).offset().top;
            }
        }else if(this.lazyStatus === 'direct'){
            this.directLoad();
        }else if(this.lazyStatus === 'trigger'){
            for(var i = 0, len=this.$doms.length; i<len && i<this.triggerNumber; i++){
                $dom = this.$doms.eq(i);
                if( !$dom.data('stl-done') ){
                    $dom.data('stl-done', true);
                    self.callback($dom);
                }
            }
        }
    }

    scrollToDo.prototype.loadIndex = function(index) {
        $dom = this.$doms.eq(index);
        if( !$dom.data('stl-done') ){
            $dom.data('stl-done', true);
            self.callback($dom);
        }
    }

    // 清楚该功能
    scrollToDo.prototype.clear = function(){
        clearInterval(this.interval);
        this.$container.off('scroll.lazy');
        self.intervalFlog = false;
    }


    $.scrollToDo = function(params){
        return new scrollToDo(params);
    }

})();