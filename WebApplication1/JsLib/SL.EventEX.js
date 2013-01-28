/// <reference path="SL.Core.js" />
/// <reference path="SL.Data.js" />
sl.create(function () {

    var rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function (selector) {
	    var quick = rquickIs.exec(selector);
	    if (quick) {
	        //   0  1    2   3
	        // [ _, tag, id, class ]
	        quick[1] = (quick[1] || "").toLowerCase();
	        quick[3] = quick[3] && new RegExp("(?:^|\\s)" + quick[3] + "(?:\\s|$)");
	    }
	    return quick;
	},
	quickIs = function (elem, m) {
	    var attrs = elem.attributes || {};
	    return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test((attrs["class"] || {}).value))
		);
	};
    EventOperator = {
        triggered: false,
        addEvent: function (elem, types, handler, data, selector) {
            if (elem.nodeType == 3 || elem.nodeType == 8) {
                return;
            }

            var handlers, handlerObj, tns, type, namespaces;
            if (!handler.guid) {
                handler.guid = sl.guid++;
            }
            var events = sl.data(elem, "events") || sl.data(elem, "events", {}),
			handle = sl.data(elem, "handle"), eventHandle;
            if (!handle) {
                eventHandle = function () {
                    return !EventOperator.triggered ?
                    EventOperator.handle.apply(eventHandle.elem, arguments) : undefined;
                };
                handle = sl.data(elem, "handle", eventHandle);
            }
            handle.elem = elem;


            //事件绑定开始
            types = types.split(" ");
            for (t = 0; t < types.length; t++) {
                tns = rtypenamespace.exec(types[t]) || [];
                type = tns[1];
                namespaces = (tns[2] || "").split(".").sort();

                handlers = events[type], handlerObj = {
                    type: type,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    quick: selector && quickParse(selector),
                    namespace: namespaces.join(".")

                };
                //防止重复绑定事件
                if (!handlers) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;
                    // Bind the global event handler to the element
                    if (elem.addEventListener) {
                        elem.addEventListener(type, handle, false);
                    } else if (elem.attachEvent) {
                        elem.attachEvent("on" + type, handle);
                    }

                }
                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }
                //handlers[handler.guid] = handler;
            }
            elem = null;

        },
        removeEvent: function (elem, type, handler) {
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }
            var events = sl.data(elem, "events"), ret, type, fn;
            if (events) {
                if (!type) {
                    for (var _type in events) {
                        EventOperator.removeEvent(elem, _type, handler);
                    }
                }
                if (events[type]) {
                    if (handler) {
                        fn = events[type][handler.guid];
                        delete events[type][handler.guid];
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
                        if (elem.removeEventListener) {
                            elem.removeEventListener(type, sl.data(elem, "handle"), false);
                        } else if (elem.detachEvent) {
                            elem.detachEvent("on" + type, sl.data(elem, "handle"));
                        }

                        ret = null;
                        delete events[type];
                    }
                }
                // event没任何东西
                for (ret in events) {
                    break;
                }
                if (!ret) {
                    var handle = sl.data(elem, "handle");
                    if (handle) {
                        handle.elem = null;
                    }
                    sl.removeData(elem, "events");
                    sl.removeData(elem, "handle");
                }
            }
        },
        triggerEvent: function (event, data, elem, bubbling) {
            var type = event.type || event;

            if (!bubbling) {
                event = typeof event === "object" ?
				event[sl.expando] ? event :
				sl.extend(SL.Event(type), event) :
                //(string)
				SL.Event(type);

                if (!elem || elem.nodeType === 3 || elem.nodeType === 8) {
                    return undefined;
                }

                event.result = undefined;
                event.target = elem;
                data = sl.Convert.convertToArray(data);
                data.unshift(event);
            }

            event.currentTarget = elem;
            var handle = sl.data(elem, "handle");
            if (handle) {
                handle.apply(elem, data);
            }

            var parent = elem.parentNode || elem.ownerDocument;
            //处理通过onType属性添加的事件处理器（如：elem.onClick = function(){...};）
            try {
                if (!(elem && elem.nodeName)) {
                    if (elem["on" + type] && elem["on" + type].apply(elem, data) === false) {
                        event.result = false;
                    }
                }
            } catch (e) { }

            if (!event.isPropagationStopped && parent) {
                //冒泡动作
                EventOperator.triggerEvent(event, data, parent, true);

            } else if (!event.isDefaultPrevented) {
                //触发默认动作···
                var target = event.target, old,
				isClick = target.nodeName == "A" && type === "click";

                if (!isClick && !(target && target.nodeName)) {
                    try {
                        if (target[type]) {
                            /* 假设type为click
                            因为下面想通过click()来触发默认操作，
                            但是又不想执行对应的事件处理器（re-trigger），
                            所以需要做两方面工作：
                            首先将elem.onclick = null；
                            然后将jQuery.event.triggered = 'click'; 
                            将在入口handle（第62行）不再dispatch了
                            之后再将它们还原*/
                            old = target["on" + type];

                            if (old) {
                                target["on" + type] = null;
                            }

                            this.triggered = true;
                            target[type]();
                        }

                        // prevent IE from throwing an error for some elements with some event types, see #3533
                    } catch (e) { }

                    if (old) {
                        target["on" + type] = old;
                    }

                    this.triggered = false;
                }
            }



        },
        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
        //处理实际的event 忽略其差异性 实际的trigger中的event切勿fix
        fixEvent: function (event) {

            if (event[sl.expando]) {
                return event;
            }
            var originalEvent = event;
            event = SL.Event(originalEvent);
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
            if (!event.which && event.button !== undefined) {
                event.which = [0, 1, 3, 0, 2, 0, 0, 0][event.button];
            }
            event.charCode = (event.type == "keypress") ? oEvent.keyCode : 0;
            event.eventPhase = 2;
            event.isChar = (event.charCode > 0);
            return event;
        },
        handle: function (event) {
            event = arguments[0] = EventOperator.fixEvent(event || window.event);
            event.currentTarget = this;
            var handlers = (sl.data(this, "events") || {})[event.type],
            delegateCount = handlers.delegateCount;

            for (var j in handlers) {
                var handler = handlers[j].handler;
                event.handler = handler;
                event.extendData = handler.extendData;

                var ret = handler.apply(this, arguments);

                if (ret !== undefined) {
                    event.result = ret;
                    if (ret === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
                if (event.isImmediatePropagationStopped) {
                    break;
                }
            }

            return event.result;
        },
        hover: function (element, enterfn, leavefn) {
            EventOperator.addEvent(element, "mouseover", enterfn);
            EventOperator.addEvent(element, "mouseout", leavefn);
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
        this.timeStamp = new Date();

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

    sl.Event = EventOperator;
});