/// <reference path="jQuery-core.js" />


jQuery.extend = jQuery.fn.extend = function () {
    // copy reference to target object
    var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

    // 深拷贝情况，第一个参数为 boolean 类型，那么，表示深拷贝，第二个参数为目标对象
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // 如果目标不是对象也不是函数
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {};
    }

    // 如果只有一个参数就是扩展 jQuery 自己
    if (length === i) {
        target = this;
        --i;
    }

    // 遍历所有的参考对象，扩展到目标对象上
    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging object literal values or arrays
                if (deep && copy && (jQuery.isPlainObject(copy) || jQuery.isArray(copy))) {
                    var clone = src && (jQuery.isPlainObject(src) || jQuery.isArray(src)) ? src
						: jQuery.isArray(copy) ? [] : {};

                    // Never move original objects, clone them
                    target[name] = jQuery.extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};