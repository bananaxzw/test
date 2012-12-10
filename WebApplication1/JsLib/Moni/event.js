/// <reference path="jQuery-core.js" />
// #2076

// 用于生成事件处理函数的 id
jQuery.guid = 1;

// jQuery 的事件对象
jQuery.event = {    // # 1555

    // 为对象增加事件
    // elem 增加事件的元素， type 事件的名称, handler 事件处理程序, data 事件相关的数据
    add: function (elem, type, handler, data) {

        var handleObjIn, handleObj;

        // 确认函数有一个唯一的 ID
        if (!handler.guid) {
            handler.guid = jQuery.guid++;
        }

        // 取得这个元素所对应的缓存数据对象
        var elemData = jQuery.data(elem);

        // 取得元素对应的缓存对象上的事件对象和所有事件共用的处理程序
        var events = elemData.events = elemData.events || {};
        var eventHandle = elemData.handle;

        // 是否已经有事件处理函数 handle 只有一个，都是使用 jQuery.event.handle
        // 通过使用闭包，使得这个函数引用当前的事件对象，参数。
        if (!eventHandle) {
            elemData.handle = eventHandle = function () {
                return jQuery.event.handle.apply(eventHandle.elem, arguments);
            };
        }

        // 使得闭包处理程序可以找到事件源对象
        eventHandle.elem = elem;

        // 
        handleObj = { handler: handler, data: data };
        handleObj.namespace = "";


        handleObj.type = type;
        handleObj.guid = handler.guid;

        // 每种事件可以有一系列的处理程序，数组形式
        var handlers = events[type],
		special = jQuery.event.special[type] || {};

        // Init the event handler queue
        if (!handlers) {
            handlers = events[type] = [];

            // Check for a special event handler
            // Only use addEventListener/attachEvent if the special
            // events handler returns false
            // 完成实际的事件注册
            // 实际的事件处理函数是 eventHandle
            if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                // Bind the global event handler to the element
                if (elem.addEventListener) {
                    elem.addEventListener(type, eventHandle, false);

                } else if (elem.attachEvent) {
                    elem.attachEvent("on" + type, eventHandle);
                }
            }
        }

        // 自定义的处理函数在一个堆栈中，以后 jQuery.event.handle 到这里找到实际的处理程序
        handlers.push(handleObj);

        // Nullify elem to prevent memory leaks in IE
        elem = null;
    },

    global: {},

    // 真正的事件处理函数, 
    // 由于是通过  return jQuery.event.handle.apply(eventHandle.elem, arguments) 调用的
    // 所以，此时的 this 就是事件源对象，event 是事件参数
    handle: function (event) {  // 1904
        var all, handlers, namespaces, namespace, events;

        event = window.event;
        event.currentTarget = this;

        // 在当前的事件对象上找到事件处理列表
        var events = jQuery.data(this, "events"), handlers = events[event.type];

        if (events && handlers) {
            // Clone the handlers to prevent manipulation
            handlers = handlers.slice(0);

            for (var j = 0, l = handlers.length; j < l; j++) {
                var handleObj = handlers[j];


                // 取得注册事件时保存的参数
                event.handler = handleObj.handler;
                event.data = handleObj.data;
                event.handleObj = handleObj;

                var ret = handleObj.handler.apply(this, arguments);
            }
        }

        return event.result;
    },

    // #2020
    special: {}

}

// bind 函数定义
jQuery.fn.bind = function (type, fn) {
    var handler = fn;

    // 调用 jQuery.event.add 添加事件
    for (var i = 0, l = this.length; i < l; i++) {
        jQuery.event.add(this[i], type, handler);
    }
    return this;
}

jQuery.fn.unbind = function (type, fn) {
    // Handle object literals
    if (typeof type === "object" && !type.preventDefault) {
        for (var key in type) {
            this.unbind(key, type[key]);
        }

    } else {
        for (var i = 0, l = this.length; i < l; i++) {
            jQuery.event.remove(this[i], type, fn);
        }
    }

    return this;
}

jQuery.fn.click = function (fn) {
    this.bind("click", fn);
    return this;
}