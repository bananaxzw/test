/// <reference path="jQuery-core.js" />

// 常用方法
function now() {
    return (new Date).getTime();
}

// 扩充数据的属性名，动态生成，避免与已有的属性冲突
var expando = "jQuery" + now(), uuid = 0, windowData = {};
jQuery.cache = {};
jQuery.expando = expando;

// 数据管理，可以针对 DOM 对象保存私有的数据，可以读取保存的数据
jQuery.fn.data = function (key, value) {

    // 读取
    if (value === undefined) {
        return jQuery.data(this[0], key);
    }
    else {  // 设置

        this.each(
                    function () {
                        jQuery.data(this, key, value);
                    }
                    );
    }
}
// 移除数据，删除保存在对象上的数据
jQuery.fn.removeData = function (key) {
    return this.each(function () {
        jQuery.removeData(this, key);
    })
}


// 为元素保存数据
jQuery.data = function (elem, name, data) {     // #1001

    // 取得元素保存数据的键值
    var id = elem[expando], cache = jQuery.cache, thisCache;

    // 没有 id 的情况下，无法取值
    if (!id && typeof name === "string" && data === undefined) {
        return null;
    }

    // Compute a unique ID for the element
    // 为元素计算一个唯一的键值
    if (!id) {
        id = ++uuid;
    }

    // 如果没有保存过
    if (!cache[id]) {
        elem[expando] = id;     // 在元素上保存键值
        cache[id] = {};         // 在 cache 上创建一个对象保存元素对应的值
    }

    // 取得此元素的数据对象
    thisCache = cache[id];

    // Prevent overriding the named cache with undefined values
    // 保存值
    if (data !== undefined) {
        thisCache[name] = data;
    }

    // 返回对应的值
    return typeof name === "string" ? thisCache[name] : thisCache;

}

// 删除保存的数据
jQuery.removeData = function (elem, name) {     // #1042

    var id = elem[expando], cache = jQuery.cache, thisCache = cache[id];

    // If we want to remove a specific section of the element's data
    if (name) {
        if (thisCache) {
            // Remove the section of cache data
            delete thisCache[name];

            // If we've removed all the data, remove the element's cache
            if (jQuery.isEmptyObject(thisCache)) {
                jQuery.removeData(elem);
            }
        }

        // Otherwise, we want to remove all of the element's data
    } else {

        delete elem[jQuery.expando];

        // Completely remove the data cache
        delete cache[id];
    }
}

// 检查对象是否是空的
jQuery.isEmptyObject = function (obj) {
    // 遍历元素的属性，只有要属性就返回假，否则返回真
    for (var name in obj) {
        return false;
    }
    return true;

}

// toString 是 jQuery 中定义的一个变量 #68
// hasOwnProperty                    #69

// 检查是否是一个函数
jQuery.isFunction = function (obj) {
    return toString.call(obj) === "[object Function]";
}

// 检查是否为一个数组
jQuery.isArray = function (obj) {
    return toString.call(obj) === "[object Array]";
}

// 是否是纯粹的 js 对象，而不是 DOM 对象，或者 window 对象
jQuery.isPlainObject = function (obj) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if (!obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {
        return false;
    }

    // Not own constructor property must be Object
    if (obj.constructor
			&& !hasOwnProperty.call(obj, "constructor")
			&& !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for (key in obj) { }

    return key === undefined || hasOwnProperty.call(obj, key);
}