(function() {
    // 包含基本算法
    // 
    // 

    // 快排的两种形式
    // 较为快捷的为 将单个数组变为 leftArr base 和 rightArr 进行合并 并且循环递归
    // 复杂一点为 不断比较 交换数组内数据
    
    // 快排1
    // 1）设置两个变量i、j，排序开始的时候：i=0，j=N-1；
    // 2）以第一个数组元素作为关键数据，赋值给key，即key=A[0]；
    // 3）从j开始向前搜索，即由后开始向前搜索(j--)，找到第一个小于key的值A[j]，将A[j]和A[i]互换；
    // 4）从i开始向后搜索，即由前开始向后搜索(i++)，找到第一个大于key的A[i]，将A[i]和A[j]互换；
    // 5）重复第3、4步，直到i=j； (3,4步中，没找到符合条件的值，
    // 即3中A[j]不小于key,4中A[i]不大于key的时候改变j、i的值，使得j=j-1，i=i+1，
    // 直至找到为止。找到符合条件的值，进行交换的时候i， j指针位置不变。
    // 另外，i==j这一过程一定正好是i+或j-完成的时候，此时令循环结束）。
    var quickSort = (function(){

        // 单次的快排
        function sort(arr, i, j){
            var base = arr[i];

            while(i < j){
                while( i < j && arr[j] >= base){
                    j--;
                }
                arr[i] = arr[j];

                while( i < j && arr[i] <= base ){
                    i++;
                }
                arr[j] = arr[i];
            }

            arr[i] = base;
            console.log(i)
            return i;
        }

        return function(arr, i, j){
            if(i >= j) return;

            var index = sort(arr, i, j);
            quickSort(arr, i, index-1);
            quickSort(arr, index+1, j);
        }

    })();

    // 快排2
    function quickSort2(arr){
        var leftArr = [], 
            rightArr = [],
            len = arr.length,
            base;

        if(len <= 1){
            return arr;
        }

        base = arr[0];

        for ( len--; len > 0; len--) {
            if(arr[len] < base){
                leftArr.push(arr[len]);
            }else{
                rightArr.push(arr[len])
            }
        }

        return quickSort(leftArr).concat(base, quickSort(rightArr));
    }

    function bubbleSort(arr){
        var len = arr.length,
            base;

        for(var j = len-1; j>0; j--){
            base = arr[j];

            for (var i = j-1; i >= 0; i--) {
                if(base < arr[i]){
                    base = arr[i];
                    arr[i] = arr[j];
                    arr[j] = base;
                }
            }
        }
    }


    // 简化的模板引擎
    function template(){
        // html转义映射对象
        var escapeMap = {
                '&' : '&amp;',
                '<' : '&lt;',
                '>' : '&gt;',
                '"' : '&quot;',
                "'" : '&#x27;'
            },

            // html转义正则
            escapeReg = /[&<>"\']/g,

            // 变量以及语句语法正则
            transformMethod = {
                escape : '<%=([\\s\\S]+?)%>',
                unescape : '<%-([\\s\\S]+?)%>',
                normal : '<%([\\s\\S]+?)%>'
            },
            transformReg = new RegExp([
                transformMethod.escape,
                transformMethod.unescape,
                transformMethod.normal].join('|'), 'g');

        // html转义方法
        var esacpeFunc = function( str ){
            return str.toString().replace( escapeReg, function( match ){
                return escapeMap[ match ];
            } );
        };

        // 主要逻辑为根据提供的模板进行生成 new Function 的 字符串函数体
        // 利用 replace 的 function参数形式处理
        // 使用闭包形式使得 new Function出来的function 可以使用当前作用域数据
        return function( tmpl, data ){
            var tmplStr = "_s+='",
                index = 0, len = tmpl.length;

            var c = tmpl.replace( transformReg, 'a');
            tmpl.replace( transformReg, function( match, escape, unescape, normal, offset){

                tmplStr += tmpl.slice(index, offset).replace(/'/g,"\\'");

                if( escape ){
                    tmplStr += "';\n_s+=((" + escape + ")==null?'':esacpeFunc(" + escape + "));\n_s+='"
                }else if( unescape ){
                    tmplStr += "';\n_s+=((" + unescape + ")==null?'':" + unescape + ");\n_s+='"
                }else if( normal ){
                    tmplStr += "';\n" + normal + ";\n_s+='"
                }

                index = offset + match.length;
            } );

            tmplStr += tmpl.slice(index, len) + "'";

            tmplStr = "var _s='';\n with(data){\n "+ tmplStr +"}\n return _s;";

            var tmplFunc = new Function( "data", "esacpeFunc", tmplStr ),

            rander = function( data ){
                return tmplFunc( data, esacpeFunc );
            }

            // 方便调试
            //rander.tmplFunc = tmplFunc;

            return data ? rander( data ) : rander;
        }
    }

    // underscore 节流函数 在wait时间内 最多触发一次 并且会处理时间间隔内的最后一点
    // 果你想禁用第一次首先执行的话，传递{leading: false}，
    // 还有如果你想禁用最后一次执行的话，传递{trailing: false}
    function throttle(func, wait, options) {
        var timeout, context, args, result;
        var previous = 0; // 前一次调用时间
        if (!options) options = {};

        // 未到节流时间点上的触发，选择使用setTimeout的形式来处理
        var later = function() {
            previous = options.leading === false ? 0 : +new Date();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        var throttled = function() {
            // 设置调用时的当前时间点
            var now = +new Date();

            // 禁用第一次首先执行
            if (!previous && options.leading === false) previous = now;

            var remaining = wait - (now - previous);

            context = this;
            args = arguments;

            // 判断时间
            if (remaining <= 0 || remaining > wait) {
                // 若有setTimeout
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }

                // 设置调用时间
                previous = now;
                result = func.apply(context, args);

                if (!timeout) context = args = null;

            } else if (!timeout && options.trailing !== false) {
                // 此处就是自己之前纠结的地方
                // 如何控制最后点上的触发
                timeout = setTimeout(later, remaining);
            }
            return result;
        };

        throttled.cancel = function() {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };

        return throttled;
    };

    // underscore 防抖函数 改造无依赖版本
    // 将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后
    // 传参 immediate 为 true， debounce会在 wait 时间间隔的开始调用这个函数
    function debounce(func, wait, immediate) {
        var timeout, result, args, self;

        var later = function() {
            timeout = null;
            if (args) result = func.apply(self, args);
        };

        var debounced = function() {
            if (timeout) clearTimeout(timeout);
            args = arguments;
            self = this;
            if (immediate) {
                var callNow = !timeout;
                if (callNow) result = func.apply(this, args);
            } 
            timeout = setTimeout(later, wait);
            return result;
        };

        debounced.cancel = function() {
            clearTimeout(timeout);
            timeout = null;
        };

        return debounced;
    };


    return {
        quickSort: function(arr){
            return quickSort(arr, 0, arr.length);
        }, // 快排
        quickSort2: quickSort2, // 快排2

        bubbleSort: bubbleSort, // 冒泡

        template: template, // 简单的模版方法

        throttle: throttle, // 节流方法

        debounce: debounce, // 防抖方法
    }

})();