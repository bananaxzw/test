// # 表示在 jQuery 1.4.2 中对应的行数

// 定义变量 undefined 方便使用
var undefined = undefined;

// jQuery 是一个函数，其实调用 jQuery.fn.init 创建对象
var $ = jQuery = window.$ = window.jQuery               // #19
            = function (selector, context) {
                return new jQuery.fn.init(selector, context);
            },

// 定义 toString 变量引用 Object 原型的 toString
            toString = Object.prototype.toString,

// 用来检查是否是一个 id
idExpr = /^#([\w-]+)$/;

// 设置 jQuery 的原型对象, 用于所有 jQuery 对象共享
jQuery.fn = jQuery.prototype = {                        // #74

    length: 0,                                          // #190

    jquery: "1.4.2",                                    // # 187

    // 这是一个示例，仅仅提供两种选择方式：id 和标记名
    init: function (selector, context) {                // #75

        // Handle HTML strings
        if (typeof selector === "string") {
            // Are we dealing with HTML string or an ID?
            match = idExpr.exec(selector);

            // Verify a match, and that no context was specified for #id
            if (match && match[1]) {
                var elem = document.getElementById(match[1]);
                if (elem) {
                    this.length = 1;
                    this[0] = elem;
                }
            }
            else {
                // 直接使用标记名
                var nodes = document.getElementsByTagName(selector);
                for (var l = nodes.length, j = 0; j < l; j++) {
                    this[j] = nodes[j];
                }
                this.length = nodes.length;
            }

            this.context = document;
            this.selector = selector;

            return this;
        }
    },

    // 代表的 DOM 对象的个数
    size: function () {                                 // #193
        return this.length;
    },

    // 用来设置 css 样式
    css: function (name, value) {                       // #4564
        this.each(
                    function (name, value) {
                        this.style[name] = value;
                    },
                    arguments       // 实际的参数以数组的形式传递
                    );
        return this;
    },

    // 用来设置文本内容
    text: function (val) {                              // #3995
        if (val) {
            this.each(function () {
                this.innerHTML = val;
            },
                    arguments       // 实际的参数以数组的形式传递
                    )
        }
        return this;
    },

    // 用来对所有的 DOM 对象进行操作
    // callback 自定义的回调函数
    // args 自定义的参数
    each: function (callback, args) {                   // #244
        return jQuery.each(this, callback, args);
    }

}

// init 函数的原型也就是 jQuery 的原型
jQuery.fn.init.prototype = jQuery.prototype;            // #303

// 用来遍历 jQuery 对象中包含的元素
jQuery.each = function (object, callback, args) {       // #550

    var i = 0, length = object.length;

    // 没有提供参数
    if (args === undefined) {

        for (var value = object[0];
					i < length && callback.call(value, i, value) !== false;
                     value = object[++i])
        { }
    }

    else {
        for (; i < length; ) {
            if (callback.apply(object[i++], args) === false) {
                break;
            }
        }
    }
}