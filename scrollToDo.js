(function() {
    // 应用场景：图片惰性加载 随滚动位置来进行是否加载图片的判断
    // 并且支持ajax加载后的惰性处理

    // var scrollToDo = $.scrollToDo({
    //     seletor:'.img_container', 
    //     distance: 100,
    //     callback:function($el){
    //         $el.attr('src', $el.attr('data_src'));
    //     }
    // });
    // scrollToDo.init();

    // seletor 加载的选择符
    // callback 滚动触发的回调函数
    // distance 底部显示距离开始加载
    // container 滚动容器

    function scrollToDo(params){
        this.seletor = params.seletor;
        this.callback = params.callback || function(){};
        this.distance = params.distance || 50;
        this.$container = $(params.container || document);

        this.screenHeight = $(params.container || window).height();
        
        // 监控的节点列表
        this.$doms = null;
        // 滚动监听的interval
        this.interval = null;
        // scroll事件触发太过频繁调节器
        this.intervalFlog = false;

        this.nextIndex = 0;
        // 下一张需要加载的top值
        this.nextUnloadTop = 0;
        this.allDone = true;

    }
    
    // 初始化
    scrollToDo.prototype.init = function(){
        var self = this;
        this.$doms = $(this.seletor);

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
                screenTop = self.$container.scrollTop();

                // 触发当时的 top 值 循环处理多个图片
                while((self.nextUnloadTop <= screenTop + self.screenHeight + self.distance) && !self.allDone ){
                    $dom = self.$doms.eq(self.nextIndex);
                    if( !$dom.data('done') ){
                        $dom.data('done', true);
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
        if((self.nextUnloadTop <= screenTop + self.screenHeight + self.distance) && !self.allDone ){
            setTimeout(function(){
                self.$container.trigger('scroll.lazy');
            }, 500);
        }
    }

    // 作用与动态添加dom节点后重置对象
    scrollToDo.prototype.reset = function(){
        this.$doms = $(this.seletor);
        if(this.nextIndex < this.$doms.length){
            this.allDone = false;
            this.nextUnloadTop = this.$doms.eq(this.nextIndex).offset().top;
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