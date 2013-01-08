/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
/// <reference path="../SL.throttle.js" />
var Defaults = {
    max: 100,
    min: 0,
    value: 0,
    bar: true,
    labels: false,
    step: 1,
    onChange: function () { },
    onDrag: function () { },
    axis: "h"

}
var eventHelper = {
    beginDrag: function (e) {
        //预留接口
    },
    onDrag: function (e) {
        var opts = sl.data(e.extendData.target, 'SLSlider').options;
        eventHelper.drag(e);
        if (opts.onDrag.call(e.extendData.target, e) != false) {
            eventHelper.applyPostion(e.extendData.target, e.extendData.top, e.extendData.left);
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
        eventHelper.applyPostion(e.extendData.target, e.extendData.top, e.extendData.left);
        $(document).unbind("mousedown");
        $(document).unbind("mousemove");
        $(document).unbind("mouseup");
        return false;

    },
    drag: function (e) {
        /// <summary>
        /// 无容器的移动 这里只是获取e的位置信息 然后applyDrag应用这个位置信息
        /// </summary>
        /// <param name="e"></param>
        var opts = sl.data(e.extendData.target, 'SLSlider').options;
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
            opts.value = eventHelper.collectValueByStep(parseFloat(top / dragData.height) * 100, opts.step, opts.max, opts.min);
            dragData.top = opts.value + "%";

        } else {
            opts.value = eventHelper.collectValueByStep(parseFloat(left / dragData.width) * 100, opts.step, opts.max, opts.min);
            dragData.left = opts.value* + "%";
        }
    },
    applyPostion: function (target, top, left) {
        $(target).css({
            left: left,
            top: top
        });
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
function SLSlider(elem, options) {
    this.opts = sl.extend({}, Defaults, options);
    this.elem = elem;
    this._render();
    this.setValue(this.opts.value);
    var othis = this;
    // bind mouse event using event namespace draggable
    this.$handle.bind('mousedown', function (e) {
        var handleInitPosition = othis.$handle.position()
        var data = {
            startLeft: handleInitPosition.left,
            startTop: handleInitPosition.top,
            left: handleInitPosition.left,
            top: handleInitPosition.top,
            startX: e.pageX,
            startY: e.pageY,
            target:e.target,
            width: $(elem).outerWidth(),
            height: $(elem).outerHeight()
        };
        $(document).bind('mousedown', data, eventHelper.beginDrag);
        $(document).bind('mousemove', data, eventHelper.onDrag);
        $(document).bind('mouseup', data, eventHelper.endDrag);

    });
    this.$handle.bind('mousemove', function () {
        $(this).css('cursor', othis.opts.cursor);
    });
    sl.data(this.$handle.elements[0], 'SLSlider', {
        options: this.opts
    });


}
SLSlider.prototype._render = function () {
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
    this.$handle = $('<a href="javascript:void(0)" class="handle"></a>');
    if (this.opts.axis == "h") {
        this.$handle.css({ top: "-5px", "margin-left": "-5px" });

    } else {
        this.$handle.css({ left: "-5px", "margin-top": "-5px" });
    }
    $elem.append(this.$handle);
};

SLSlider.prototype.getCurrentValue = function () {
    return this.$handle.data("SLSlider").options.value;
}

SLSlider.prototype.setValue = function (value) {
    if (!/%/.test(value)) value = value + "%";
    if (this.opts.axis == "h") {
        this.$handle.css({ left: value });

    } else {
        this.$handle.css({ top: value });
    }
}
