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
    onChange: function () { },
    onDrag: function () { },
    axis: "h"

}
var eventHelper = {
    beginDrag: function (e) {
        var opts = sl.data(e.extendData.target, 'draggable').options;
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
        eventHelper.drag(e);
        eventHelper.drag(e);
        $(document).unbind("mousedown");
        $(document).unbind("mousemove");
        $(document).unbind("mouseup");
        return false;

    },
    applyDrag: function (e) {
        //if (e.extendData.left == "0%" || e.extendData.top == "0%") return;
        $(e.extendData.target).css({
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
        if (opts.axis == 'v') {
            dragData.top = eventHelper.collectValueByStep(parseFloat(top / dragData.height) * 100, opts.step, opts.max, opts.min) + "%";

        } else {
            dragData.left = eventHelper.collectValueByStep(parseFloat(left / dragData.width) * 100, opts.step, opts.max, opts.min) + "%";
        }
    },
    collectValueByStep: function (value, step, max, min) {
        value = Math.round(value / step) * step;
        eventHelper.fixedValue(value, step);
        if (value > max) value = max;
        if (value < min) value = min;
        return value;
    },
    fixedValue: function (value, step) {
        var places, _ref;
        if (step % 1 === 0) {
            return parseInt(value, 10);
        }
        _ref = (step + "").split("."), places = _ref[1];
        return parseFloat(value.toFixed(places.length));
    }
};
/*
function SLSilider(elem, options) {
    this.opts = sl.extend({}, Defaults, options);
    this.elem = elem;
    this._render();
    var othis = this;
    // bind mouse event using event namespace draggable
    this.$handle.bind('mousedown', { target: this.$handle.elements[0] }, onMouseDown);
    this.$handle.bind('mousemove', { target: this.$handle.elements[0] }, onMouseMove);
    sl.data(this.$handle.elements[0], 'draggable', {
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
            target: e.extendData.target,
            width: $(elem).outerWidth(),
            height: $(elem).outerHeight()
        };
        $(document).bind('mousedown', data, eventHelper.beginDrag);
        $(document).bind('mousemove', data, eventHelper.onDrag);
        $(document).bind('mouseup', data, eventHelper.endDrag);
    }

    function onMouseMove(e) {
        $(this).css('cursor', othis.opts.cursor);

    }

}*/
function SLSilider(elem, options) {
    this.opts = sl.extend({}, Defaults, options);
    this.elem = elem;
    this._render();
    var othis = this;
    // bind mouse event using event namespace draggable
    this.$handle.bind('mousedown', function (e) {
        var data = {
            startPosition: othis.$handle.css('position'),
            startLeft: position.left,
            startTop: position.top,
            left: position.left,
            top: position.top,
            startX: e.pageX,
            startY: e.pageY,
            target: e.extendData.target,
            width: $(elem).outerWidth(),
            height: $(elem).outerHeight()
        };
        $(document).bind('mousedown', data,othis._beginDrag);
        $(document).bind('mousemove', data, othis._onDrag);
        $(document).bind('mouseup', data, othis._endDrag);
    
    });
    this.$handle.bind('mousemove', function () {
        $(this).css('cursor', othis.opts.cursor);
     });

}
SLSilider.prototype._render = function () {
    var $elem = $(this.elem);
    if (this.opts.labels) {
        this.$labelmin = $('<span class="label min"></span>');
        this.$labelcurr = $('<span class="label current"></span>');
        this.$labelmax = $('<span class="label max"></span>');
        $elem.append(this.$labelmin).append(this.$labelcurr).append(this.$labelmax);
    }
    if (this.opts.bar) {
        this.$bar = $('<div class="bar"></div>');
        $elem.append(this.$bar);
    }
    this.$handle = $('<a href="javascript:viod(0)" class="handle"></a>');
    if (this.opts.axis == "h") {
        this.$handle.css({top:"-5px","margin-left":"-5px"});
        
    }else {
        this.$handle.css({ left: "-5px", "margin-top": "-5px" });
    }
    $elem.append(this.$handle);
};
SLSilider.prototype._beginDrag = function (e) {


}
SLSilider.prototype._onDrag = function (e) {

    var opts =this.opts;
    eventHelper.drag(e);
    if (opts.onDrag.call(thism e) != false) {
        eventHelper.applyDrag(e);
    }
    return false;

}
SLSilider.prototype._endDrag = function () {
    /// <summary>
    /// 结束拖拉 在mouseup触发
    /// </summary>
    /// <param name="e"></param>
    /// <returns type=""></returns>
    eventHelper.drag(e);
    $(document).unbind("mousedown");
    $(document).unbind("mousemove");
    $(document).unbind("mouseup");
    return false;
}
SLSilider.prototype._applyDrag = function (e) {
    $(e.extendData.target).css({
        left: e.extendData.left,
        top: e.extendData.top
    });
}
SLSilider.prototype._drag = function (e) {
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
    如果父元素不是body就加上滚动条
    if (e.extendData.parent != document.body) {
        if (sl.boxModel == true) {
            left += $(e.extendData.parent).scrollLeft();
            top += $(e.extendData.parent).scrollTop();
        }
    }
    //如果只允许水平或者垂直 只单单设置top或者left
    if (opts.axis == 'v') {
        dragData.top = eventHelper.collectValueByStep(parseFloat(top / dragData.height) * 100, opts.step, opts.max, opts.min) + "%";

    } else {
        dragData.left = eventHelper.collectValueByStep(parseFloat(left / dragData.width) * 100, opts.step, opts.max, opts.min) + "%";
    }
}

SLSilider.prototype._collectValueByStep = function (value, step, max, min) {
    value = Math.round(value / step) * step;
    eventHelper.fixedValue(value, step);
    if (value > max) value = max;
    if (value < min) value = min;
    return value;
}

SLSilider.prototype._fixedValue = function (value, step) {
    var places, _ref;
    if (step % 1 === 0) {
        return parseInt(value, 10);
    }
    _ref = (step + "").split("."), places = _ref[1];
    return parseFloat(value.toFixed(places.length));
}
