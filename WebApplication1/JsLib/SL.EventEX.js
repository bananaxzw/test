/// <reference path="SL.Core.js" />
/// <reference path="SL.Data.js" />
sl.create(function () {

    EventOperator = {
        addEvent: function (elem, type, handler, data) {

            if (elem.nodeType == 3 || elem.nodeType == 8) {
                return;
            }
            if (!handler.guid) {
                handler.guid = sl.guid++;
            }
            if (data !== undefined) {
                var fn = handler;
                // 创建一个代理的handler 来保存data 保障data的唯一性
                handler = sl.proxy(fn);
                handler.data = data;
            }
            var events = sl.data(elem, "events") || sl.data(elem, "events", {}),
			handle = sl.data(elem, "handle"), eventHandle;
            if (!handle) {
                eventHandle = function () {

                    EventOperator.handle.call(eventHandle.elem, arguments);
                };
                handle = sl.data(elem, "handle", eventHandle);
            }
            handle.elem = elem;
            var handlers = events[type];
            //防止重复绑定事件
            if (!handlers) {
                handlers = events[type] = {};
                // Bind the global event handler to the element
                if (elem.addEventListener) {
                    elem.addEventListener(type, handle, false);
                } else if (elem.attachEvent) {
                    elem.attachEvent("on" + type, handle);
                }

            }
            handlers[handler.guid] = handler;

        },
        removeEvent: function (elem, type, handler) {
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }

            var events = sl.data(elem, "events"), ret, type, fn;

            if (events) {
                // types is actually an event object here
                if (types.type) {
                    handler = types.handler;
                    types = types.type;
                }



                if (events[type]) {
                    // remove the given handler for the given type
                    if (handler) {
                        fn = events[type][handler.guid];
                        delete events[type][handler.guid];

                        // remove all handlers for the given type
                    } else {
                        for (var handle in events[type]) {
                          
                                delete events[type][handle];
                            
                        }
                    }

                

                    // remove generic event handler if no more handlers exist
                    for (ret in events[type]) {
                        break;
                    }
                    if (!ret) {
                        if (!special.teardown || special.teardown.call(elem, namespaces) === false) {
                            if (elem.removeEventListener) {
                                elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
                            } else if (elem.detachEvent) {
                                elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
                            }
                        }
                        ret = null;
                        delete events[type];
                    }
                }



                // Remove the expando if it's no longer used
                for (ret in events) {
                    break;
                }
                if (!ret) {
                    var handle = jQuery.data(elem, "handle");
                    if (handle) {
                        handle.elem = null;
                    }
                    jQuery.removeData(elem, "events");
                    jQuery.removeData(elem, "handle");
                }
            }
        },
        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
        //处理实际的event 忽略其差异性 实际的trigger中的event切勿fix
        fixEvent: function (event) {

            for (var i = EventOperator.props.length, prop; i; ) {
                prop = EventOperator.props[--i];
                event[prop] = originalEvent[prop];
            }
            if (!event.target) {
                event.target = event.srcElement || document;
            }

            //(safari)
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }
            if (!event.relatedTarget && event.fromElement) {
                event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
            }

            if (event.pageX == null && event.clientX != null) {
                var doc = document.documentElement, body = document.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }
            // Netscape/Firefox/Opera
            if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode)) {
                event.which = event.charCode || event.keyCode;
            }

            // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
            if (!event.metaKey && event.ctrlKey) {
                event.metaKey = event.ctrlKey;
            }

            // 为 click 事件添加 which 属性，左1 中2 右3
            // IE button的含义：
            // 0：没有键被按下 
            // 1：按下左键 
            // 2：按下右键 
            // 3：左键与右键同时被按下 
            // 4：按下中键 
            // 5：左键与中键同时被按下 
            // 6：中键与右键同时被按下 
            // 7：三个键同时被按下
            if (!event.which && button !== undefined) {
                event.which = [0, 1, 3, 0, 2, 0, 0, 0][button];
            }
            event.charCode = (event.type == "keypress") ? oEvent.keyCode : 0;
            event.eventPhase = 2;
            event.isChar = (event.charCode > 0);
            return event;
        },
        handle: function (event) {
            // returned undefined or false
            var all, handlers;
            event = arguments[0] = EventOperator.fixEvent(event || window.event);
            event.currentTarget = this;
            handlers = (sl.data(this, "events") || {})[event.type];

            for (var j in handlers) {
                var handler = handlers[j];
                event.handler = handler;
                event.data = handler.data;

                var ret = handler.apply(this, arguments);

                if (ret !== undefined) {
                    event.result = ret;
                    if (ret === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
                if (event.isImmediatePropagationStopped()) {
                    break;
                }
            }

            return event.result;
        }
    }

    SL.Event = function (src) {
        //是否已经经过初始化的event
        if (!this.preventDefault) {
            return new SL.Event(src);
        }
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
        } else {
            this.type = src;
        }
        this.timeStamp = now();

        //用来标注已经初始化
        this[sl.expando] = true;
    };
    SL.Event.prototype = {
        preventDefault: function () {
            // DOM LV3
            this.isDefaultPrevented = true;
            var e = this.originalEvent;

            if (!e) {
                return;
            }

            // DOM LV2
            if (e.preventDefault) {
                e.preventDefault();
            }
            // IE6-8
            else {
                e.returnValue = false;
            }
        },
        stopPropagation: function () {
            // DOM LV3
            this.isPropagationStopped = true;
            var e = this.originalEvent;

            if (!e) {
                return;
            }

            // DOM LV2
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            else {
                // IE6-8
                e.cancelBubble = true;
            }
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = true;
            this.stopPropagation();
        },
        isDefaultPrevented: false,
        isPropagationStopped: false,
        isImmediatePropagationStopped: false
    };


});