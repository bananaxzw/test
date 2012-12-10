/// <reference path="$SL.js" />

$SL.Event = function () {
    this.guid = 1;
}
$sl.merge($SL.Event.prototype, {
    addEvent: function (element, type, handler) {
        //给函数分配唯一的标志ID
        if (!handler.$$guid) handler.$$guid = this.guid++;
        //创建一个hash table来保存各种事件的处理函数  
        if (!element.events) element.events = {};
        //创建一个hash table来保存某个事件处理函数
        var handlers = element.events[type];
        if (!handlers) {
            handlers = element.events[type] = {};
            //储存已经存在的事件处理函数
            if (element["on" + type]) {
                handlers[0] = element["on" + type];
            }
        }
        // 保存时间处理函数到hash table中
        handlers[handler.$$guid] = handler;
        // 为事件提供一个统一全局的处理函数 这句是关键handleEvent函数属于element，也就是说函数的内部this是指向element
        element["on" + type] = handleEvent;

        function handleEvent(event) {
            var returnValue = true;
            // grab the event object (IE uses a global event object)
            event = event || $sl.Event.fixEvent(window.event);
            // 注意这里的this指向dom元素 因为addEvent中element["on" + type] = handleEvent
            //获取已经缓存到dom元素的events属性的各个事件函数
            var handlers = this.events[event.type];
            //便利已经缓存到元素的事件
            for (var i in handlers) {
                this.$$handleEvent = handlers[i];
                if (this.$$handleEvent(event) === false) {
                    returnValue = false;
                }
            }
            return returnValue;
        }
    },

    removeEvent: function (element, type, handler) {
        // delete the event handler from the hash table  
        if (element.events && element.events[type]) {
            delete element.events[type][handler.$$guid];
        }
    },
    fixEvent: function (oEvent) {
        oEvent.charCode = (oEvent.type == "keypress") ? oEvent.keyCode : 0;
        oEvent.eventPhase = 2;
        oEvent.isChar = (oEvent.charCode > 0);
        oEvent.pageX = oEvent.clientX + document.body.scrollLeft;
        oEvent.pageY = oEvent.clientY + document.body.scrollTop;
        oEvent.preventDefault = function () {
            this.returnValue = false;
        };

        if (oEvent.type == "mouseout") {
            oEvent.relatedTarget = oEvent.toElement;
        } else if (oEvent.type == "mouseover") {
            oEvent.relatedTarget = oEvent.fromElement;
        }

        oEvent.stopPropagation = function () {
            this.cancelBubble = true;
        };

        oEvent.target = oEvent.srcElement;
        oEvent.time = (new Date).getTime();
        return oEvent;
    }
});

$sl.Event = new $SL.Event();
