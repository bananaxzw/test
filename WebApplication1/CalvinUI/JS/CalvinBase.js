/// <reference path="jquery-1.4.1-vsdoc.js" />
/********************************************************************************************
* 文件名称:	
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	
* 注意事项：如果变量前面有带$表示的是JQ对象
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*
********************************************************************************************/
if (!window.CalvinBase || !CalvinBase.init) {//初始化检测
    window.CalvinBase = {};
    CalvinBase.toString = CalvinBase.valueOf = function () { return 'CalvinBase'; };
    window.CalvinBase.clientCtrls = {};
    (function () {
        var sUserAgent = navigator.userAgent;
        var isOpera = sUserAgent.indexOf("Opera") > -1;
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(sUserAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        var IE6 = IE7 = IE8 = false; ;
        switch (fIEVersion) {
            case 6.0:
                IE6 = true; IE7 = IE8 = false;
                break;
            case 7.0:
                IE7 = true; IE6 = IE8 = false;
                break;
            case 8.0:
                IE8 = true; IE6 = IE7 = false;
                break;
            default:
                IE6 = IE7 = IE8 = false;
                break;
        }

        this.BrowserHelper = {
            isIE: function () {
                return sUserAgent.indexOf("compatible") > -1 && sUserAgent.indexOf("MSIE") > -1 && !isOpera;
            },
            isIE6: function () {
                return (fIEVersion == 6.0);
            },
            ie6: IE6,
            ie7: IE7,
            ie8: IE8
        }


        Array.prototype.remove = function (dx) {
        	/// <summary>
        	/// 
        	/// </summary>
        	/// <param name="dx"></param>
        	/// <returns type=""></returns>
            if (isNaN(dx) || dx > this.length) { return false; }
            this.splice(dx, 1);
        }
        this.domHelper = {
            //获取传入的各个元素的边界值
            getElementsArea: function () {
                if (arguments.length == 0) return;
                var tempArray = new Array();
                for (var i = 0, m = arguments.length; i < m; i++) {
                    var ConstrainArea = {};
                    if (arguments[i] == window)
                        arguments[i] = document.body || document.documentElement;
                    var $containment = $(arguments[i]);


                    ConstrainArea.top = $containment.offset().top;
                    ConstrainArea.left = $containment.offset().left;
                    ConstrainArea.under = ConstrainArea.top + $containment.innerHeight();
                    ConstrainArea.right = ConstrainArea.left + $containment.innerWidth();

//                    if ($.support.boxModel) {
//                        ConstrainArea.under = ConstrainArea.top + $containment.outerHeight();
//                        ConstrainArea.right = ConstrainArea.left + $containment.outerWidth();
//                    }
//                    else {
//                        ConstrainArea.under = ConstrainArea.top + $containment.height();
//                        ConstrainArea.right = ConstrainArea.left + $containment.width();
                   // }
                    tempArray.push(ConstrainArea);
                }
                return tempArray;
            },

            //判断对象是否是window 或者 html 或者body
            isWindow: function (obj) {
                var isWindow = obj == window || obj == document
			|| !obj.tagName || (/^(?:body|html)$/i).test(obj.tagName);
                return isWindow;
            }
        };
        //各种排序算法
        this.Sorter = {
            quickSort: function (arr, SortFun) {
                if (arr.length <= 1) { return arr; }
                var pivotIndex = Math.floor(arr.length / 2);
                var pivot = arr.splice(pivotIndex, 1)[0];
                var left = [];
                var right = [];
                for (var i = 0; i < arr.length; i++) {
                    if (SortFun(arr[i], pivot) < 0) {
                        left.push(arr[i]);
                    }
                    else {
                        right.push(arr[i]);
                    }

                }
                return CalvinBase.Sorter.quickSort(left, SortFun).concat([pivot], CalvinBase.Sorter.quickSort(right, SortFun));

            }


        };

        function doSort(array, left, right, sortFun) {
            var mid;
            if (left < right) {
                mid = partition(array, left, right, sortFun);
                doSort(array, left, mid - 1, sortFun);
                doSort(array, mid + 1, right, sortFun);
            }

        }
        function partition(array, left, right, sortFun) {
            var key = array[left];
            while (left < right) {
                while (left < right && sortFun(array[right], key) >= 0)
                    right--;
                array[left] = array[right];
                while (left < right && sortFun(array[left], key) <= 0)
                    left++;
                array[right] = array[left];
            }
            array[left] = key;
            return left;
        }
        Array.prototype.quickSort = function (sortFun) {
            if (!sortFun) {
                sortFun = function (a, b) {
                    return a - b;
                }
            }
            doSort(this, 0, this.length - 1, sortFun);
            return this;
        }

    }).call(CalvinBase);
}