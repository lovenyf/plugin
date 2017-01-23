(function() {
    // 包含基本算法
    // 
    // 

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



    return {
        quickSort: function(arr){
            return quickSort(arr, 0, arr.length);
        }, // 快排
        quickSort2: quickSort2, // 快排2

        bubbleSort: bubbleSort, // 冒泡
    }

})();