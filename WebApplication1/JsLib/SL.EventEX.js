/// <reference path="SL.Core.js" />
/// <reference path="SL.Data.js" />
sl.create(function () {

    var rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
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
            var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

            if (elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = sl.data(elem))) {
                return;
            }

            //可以传object的处理类型
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }

            // 
            if (!handler.guid) {
                handler.guid = sl.guid++;
            }

            //初始化events
            events = elemData.events;
            if (!events) {
                elemData.events = events = {};
            }
            eventHandle = elemData.handle;
            if (!eventHandle) {
                elemData.handle = eventHandle = function (e) {
                    return !e || EventOperator.triggered !== e.type ?
                    EventOperator.handle.apply(eventHandle.elem, arguments) : undefined;
                };
                eventHandle.elem = elem;
            }

            types = types.split(" ");
            for (t = 0; t < types.length; t++) {

                tns = rtypenamespace.exec(types[t]) || [];
                type = tns[1];
                namespaces = (tns[2] || "").split(".").sort();

                handleObj = sl.extend({
                    type: type,
                    origType: tns[1],
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    quick: selector && quickParse(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn);


                handlers = events[type];
                //防止重复绑定事件
                if (!handlers) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;
                    if (elem.addEventListener) {
                        elem.addEventListener(type, eventHandle, false);

                    } else if (elem.attachEvent) {
                        elem.attachEvent("on" + type, eventHandle);
                    }
                }


                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }

                // Keep track of which events have ever been used, for event optimization
                EventOperator.global[type] = true;
            }

            // 防止内存泄露
            elem = null;

        },
        global: {},
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
        triggerEvent: function (event, data, elem, onlyHandlers) {
        	/// <summary>
        	/// 
        	/// </summary>
        	/// <param name="event"></param>
        	/// <param name="data"></param>
        	/// <param name="elem"></param>
            /// <param name="onlyHandlers">只在 .triggerHandler用到了，即不触发元素的默认行为，且停止冒泡。</param>
        	/// <returns type=""></returns>
            if (elem && (elem.nodeType === 3 || elem.nodeType === 8)) {
                return;
            }
            var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

            // 仅对focus/blur事件变种成focusin/out进行处理
            // 如果浏览器原生支持focusin/out，则确保当前不触发他们
            //预留判断 目前特殊事件没实现
            if (rfocusMorph.test(type + EventOperator.triggered)) {
                return;
            }

            if (type.indexOf("!") >= 0) {
                //如果类型中包含！表示触发没有包含命名空间的事件
                type = type.slice(0, -1);
                exclusive = true;
            }
            //包含命名空间
            if (type.indexOf(".") >= 0) {
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            //如果从来没有绑定过此种事件，也不用继续执行了
            if (!elem && !EventOperator.global[type]) {
                return;
            }

            // Caller can pass in an Event, Object, or just an event type string
            event = typeof event === "object" ?
			event[sl.expando] ? event :
			new SL.Event(type, event) :
			new SL.Event(type);

            //判断命名空间
            event.type = type;
            event.isTrigger = true;
            event.exclusive = exclusive;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
            ontype = type.indexOf(":") < 0 ? "on" + type : "";

            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }
            data = data != null ? sl.Convert.convertToArray(data) : [];
            data.unshift(event);



            //铺设往上冒泡的路径，每小段都包括处理对象与事件类型
            eventPath = [[elem, type]];
            if (!onlyHandlers && !sl.InstanceOf.Window(elem)) {
            // 冒泡时是否需要转成别的事件(用于事件模拟)
            // 如果不是变形来的foucusin/out事件
                bubbleType =type;//预留接口
                cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode;
                for (old = elem; cur; cur = cur.parentNode) {
                    eventPath.push([cur, bubbleType]);
                    old = cur;
                }

                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if (old === (elem.ownerDocument || document)) {
                    eventPath.push([old.defaultView || old.parentWindow || window, bubbleType]);
                }
            }

            //沿着之前铺好的路触发事件
            for (i = 0; i < eventPath.length && !event.isPropagationStopped(); i++) {

                cur = eventPath[i][0];
                event.type = eventPath[i][1];

                handle = (sl.data(cur, "events") || {})[event.type] && sl.data(cur, "handle");
                if (handle) {
                    handle.apply(cur, data);
                }
                // Note that this is a bare JS function and not a jQuery handler
                handle = ontype && cur[ontype];
                if (handle && jQuery.acceptData(cur) && handle.apply(cur, data) === false) {
                    event.preventDefault();
                }
            }
            event.type = type;

            // If nobody prevented the default action, do it now
            if (!onlyHandlers && !event.isDefaultPrevented()) {

                if ((!special._default || special._default.apply(elem.ownerDocument, data) === false) &&
				!(type === "click" && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem)) {

                    // Call a native DOM method on the target with the same name name as the event.
                    // Can't use an .isFunction() check here because IE6/7 fails that test.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    // IE<9 dies on focus/blur to hidden element (#1486)
                    if (ontype && elem[type] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow(elem)) {

                        // Don't re-trigger an onFOO event when we call its FOO() method
                        old = elem[ontype];

                        if (old) {
                            elem[ontype] = null;
                        }

                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        elem[type]();
                        jQuery.event.triggered = undefined;

                        if (old) {
                            elem[ontype] = old;
                        }
                    }
                }
            }

            return event.result;



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
            event =EventOperator.fixEvent (event || window.event);
            var handlers = ((sl.data(this, "events") || {})[event.type] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call(arguments),
            //exclusive表示trigger的事件包含!也就是只触发没有命名空间的
            //exclusive只会在trigger中发生
            //namespace也只会在trigger中发生 
            //所以不是通过trigger模拟的事件run_all一直会是true
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related;
            args[0] = event;
            event.delegateTarget = this;
            //如果使用了事件代理，则先执行事件代理的回调, FF的右键会触发点击事件，与标签不符
            if (delegateCount && !(event.button && event.type === "click")) {
                for (cur = event.target; cur != this; cur = cur.parentNode || this) {
                    if (cur.disabled !== true) {
                        selMatch = {};
                        matches = [];
                        jqcur[0] = cur;
                        for (i = 0; i < delegateCount; i++) {
                            handleObj = handlers[i];
                            sel = handleObj.selector;

                            if (selMatch[sel] === undefined) {
                            //目前只支持简单的判断 不支持复杂的选择器 后面待添加
                                selMatch[sel] = (
								handleObj.quick ? quickIs(cur, handleObj.quick) : false
							);
                            }
                            if (selMatch[sel]) {
                                matches.push(handleObj);
                            }
                        }
                        if (matches.length) {
                            handlerQueue.push({ elem: cur, matches: matches });
                        }
                    }
                }
            }
            if (handlers.length > delegateCount) {
                handlerQueue.push({ elem: this, matches: handlers.slice(delegateCount) });
            }

            //先运行代理的 如果有停止冒泡马上停止
            for (i = 0; i < handlerQueue.length && !event.isPropagationStopped; i++) {
                matched = handlerQueue[i];
                event.currentTarget = matched.elem;

                for (j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped; j++) {
                    handleObj = matched.matches[j];

                    //触发的条件 1.run_all(见上面的解释)
                    //2.没有名称空间
                    //3.命名空间和触发的命名空间一致
                    if (run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test(handleObj.namespace)) {

                        event.data = handleObj.data;
                        event.handleObj = handleObj;

                        ret = handleObj.handler.apply(this, arguments);

                        if (ret !== undefined) {
                            event.result = ret;
                            if (ret === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
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
        if (!this instanceof SL.Event) {
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