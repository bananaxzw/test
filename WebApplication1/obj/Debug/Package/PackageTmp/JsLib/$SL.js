/*
* @author 许志伟<bananaxzw@qq.com>
* @copyright 许志伟  
*/

/**
* SL Js 基类
*/


$SL = function () { };
$SL.prototype = {
    /**
    * 合并对象，后面所有的对象的属性都加到第一个身上
    * @param {Object ...}
    * @return {Object}
    */
    merge: function () {
        var a = arguments;
        if (a.length < 2) {
            return;
        }
        if (a[0] != null) {
            for (var i = 1; i < a.length; i++) {
                for (var r in a[i]) {
                    a[0][r] = a[i][r];
                }
            }
        }
        return a[0];
    },
    compare: function (obj1, obj2) {
        if (obj1 == null || obj2 == null) return (obj1 === obj2);
        return (obj1 == obj2 && obj1.constructor.toString() == obj2.constructor);
    }
}

$sl = new $SL();

