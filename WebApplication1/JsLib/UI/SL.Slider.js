/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
/// <reference path="../SL.throttle.js" />
var Defaults = {
    max: 100,
    min: 0,
    value: 25,
    bar: true,
    labels: false,
    step: 1,
    onChange: null,
    onDrag: null,
    direction: "h"

}
var eventHelper = {
    beginDrag: function (e) {
        var opts = sl.data(e.extendData.target, 'draggable').options;
        opts.onStartDrag.call(e.extendData.target, e);
        return false;
    },
    onDrag: function (e) {
        var opts = sl.data(e.extendData.target, 'draggable').options;
        eventHelper.drag(e);
        if (sl.data(e.extendData.target, 'draggable').options.onDrag.call(e.extendData.target, e) != false) {
            eventHelper.applyDrag(e);
        }
        return false;
    },
    endDrag: function (e) {
        /// <summary>
        /// 结束拖拉 在mouseup触发
        /// </summary>
        /// <param name="e"></param>
        /// <returns type=""></returns>
        var opts = sl.data(e.extendData.target, 'draggable').options;
        eventHelper.drag(e);

        opts.onStopDrag.call(e.extendData.target, e);


        $(document).unbind("mousedown");
        $(document).unbind("mousemove");
        $(document).unbind("mouseup");
        return false;

    },
    applyDrag: function (e) {
        var opts = sl.data(e.extendData.target, 'draggable').options;
        var proxy = sl.data(e.extendData.target, 'draggable').proxy;
        if (proxy) {
            proxy.css('cursor', opts.cursor);
        } else {
            proxy = $(e.extendData.target);
            sl.data(e.extendData.target, 'draggable').handle.css('cursor', opts.cursor);
        }
        proxy.css({
            left: e.extendData.left,
            top: e.extendData.top
        });
    },
    drag: function (e) {
        /// <summary>
        /// 无容器的移动 这里只是获取e的位置信息 然后applyDrag应用这个位置信息
        /// </summary>
        /// <param name="e"></param>
        var opts = sl.data(e.extendData.target, 'draggable').options;

        var dragData = e.extendData;
        var left = dragData.startLeft + e.pageX - dragData.startX;
        var top = dragData.startTop + e.pageY - dragData.startY;

        if (opts.deltaX != null && opts.deltaX != undefined) {
            left = e.pageX + opts.deltaX;
        }
        if (opts.deltaY != null && opts.deltaY != undefined) {
            top = e.pageY + opts.deltaY;
        }
        //如果父元素不是body就加上滚动条
        if (e.extendData.parent != document.body) {
            if (sl.boxModel == true) {
                left += $(e.extendData.parent).scrollLeft();
                top += $(e.extendData.parent).scrollTop();
            }
        }
        //如果只允许水平或者垂直 只单单设置top或者left
        if (opts.axis == 'h') {
            dragData.left = left;
        } else if (opts.axis == 'v') {
            dragData.top = top;
        } else {
            dragData.left = left;
            dragData.top = top;
        }
    }
};
var domHelper = {
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
function SLSilider(elem, options) {
    this.opts = sl.extend(Defaults, options);
    this.elem = elem;
    // bind mouse event using event namespace draggable
    elem.bind('mousedown', { target: elem }, onMouseDown);
    elem.bind('mousemove', { target: elem }, onMouseMove);
    sl.data(elem, 'draggable', {
        options: this.opts
    });
    function onMouseDown(e) {
        var $target = $(e.extendData.target);
        var position = $target.position();
        var data = {
            startPosition: $target.css('position'),
            startLeft: position.left,
            startTop: position.top,
            left: position.left,
            top: position.top,
            startX: e.pageX,
            startY: e.pageY,
            target: e.extendData.target
        };
        $(document).bind('mousedown', data, eventHelper.beginDrag);
        $(document).bind('mousemove', data, sl.throttle(50, eventHelper.onDrag, true));
        $(document).bind('mouseup', data, eventHelper.endDrag);
    }

    function onMouseMove(e) {
        if (checkArea(e)) {
            $(this).css('cursor', opts.cursor);
        } else {
            $(this).css('cursor', 'default');
        }
    }

}