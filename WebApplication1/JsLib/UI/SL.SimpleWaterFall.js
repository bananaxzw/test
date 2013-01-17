﻿/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
/// <reference path="../SL.throttle.js" />




var Defaults = {
    container: window,
    minColCount: 5,
    colWidth: 300,
    dynamicLoad: false,
    onReach: function () { }
}


function SLWaterFall(options) {
    this.opts = sl.extend({}, Defaults, options);
    sl.InstanceOf.BodyOrHtmlOrWindow(this.opts.container) ? this.opts.container = document.body : false;
    this.init();
    this.putElements($(".sl-waterfall", this.opts.container).elements);

}
SLWaterFall.prototype = {
    colsHeight: [],
    minColsHeight: 0,
    minColsIndex: function () {
        return sl.Array.indexOf(this.colsHeight, this.minColsHeight);
    },
    firstRowFull: false,
    firstRowCurrCount: 0,
    init: function () {
        var container = this.opts.container, c = $(container).css("position"), othis = this;
        !sl.InstanceOf.BodyOrHtmlOrWindow(container) && c != "fixed" && c != "relative" && c != "absolute" ? $(container).css("position", "relative") : false;
        this.elems = $("sl_waterfall", container).elements;
        this.containerWidth = parseFloat($(container).innerWidth());
        this.countOfRow = this.containerWidth / this.opts.colWidth | 0, this.countOfRow = this.countOfRow < this.opts.minColCount ? this.opts.minColCount : this.countOfRow;
        if (this.opts.dynamicLoad) {
            new SLWaterFallLoder({ waterfall: othis, onReach: othis.opts.onReach });
        }
    },
    putElements: function (elems, add) {
        var container = this.opts.container;
        if (add) {
            sl.each(elems, function () {
                container.appendChild(this);
            });
        }
        for (var i = 0, length = elems.length; i < length; i++) {

            // $(elems[i]).width(this.opts.colWidth);
            var elemH = parseFloat($(elems[i]).outerHeight());
            if (!this.firstRowFull) { //第一行Pin以浮动排列，不需绝对定位
                ++this.firstRowCurrCount == this.countOfRow ? this.firstRowFull = true : false;
                this.colsHeight[i] = elemH;
                elems[i].style.position = 'absolute';
                elems[i].style.top = "0px";
                elems[i].style.left = (i * this.opts.colWidth) + 'px';
            } else {
                this.minColsHeight = Math.min.apply({}, this.colsHeight); //取得各列累计高度最低的一列
                var minColIndex = this.minColsIndex();
                this.colsHeight[minColIndex] += elemH; //加上新高度后更新高度值
                elems[i].style.position = 'absolute';
                elems[i].style.top = this.minColsHeight + 'px';
                elems[i].style.left = (minColIndex * this.opts.colWidth) + 'px';
                this.minColsHeight = Math.min.apply({}, this.colsHeight);
            }
        }
    }
}


function SLWaterFallLoder(options) {
    this.opts = sl.extend({}, {
        LoadRadius: 5, //加载范围
        onReach: function () { },
        waterfall: null
    }, options);
    this.page = 1;
    this.opts.container = this.opts.waterfall.opts.container;
    var othis = this;
    $(sl.InstanceOf.BodyOrHtmlOrWindow(this.opts.container) ? window : this.opts.container).scroll(sl.throttle(100, function () {
        othis.onScroll.apply(othis);
    }, true));
};
SLWaterFallLoder.prototype = {
    onScroll: function () {
        var scrollheight = this.opts.waterfall.minColsHeight,
        scrollTop = $(this.opts.container).scrollTop(),
             height = getVisiableRect(this.opts.container).height,
             LoadRadius = this.opts.LoadRadius;
        if ((scrollTop + height - scrollheight) >= LoadRadius || (scrollTop + height - scrollheight) >= -LoadRadius) {
            ++this.page;
            if (this.opts.onReach) {
                this.opts.onReach.apply(this.opts.waterfall);
            }
        }
    }
};

//获取窗口可视区域大小
function getVisiableRect(elem) {
    if (sl.InstanceOf.BodyOrHtmlOrWindow(elem)) {
        if (window.innerHeight) {
            return { height: window.innerHeight, width: window.innerWidth };
        } else {

            if (document.compatMode === "BackCompat") {
                return { height: document.body.clientHeight, width: document.body.clientWidth };
            }
            else {
                if (sl.Browser.ie) {
                    return { height: document.documentElement.clientHeight, width: document.documentElement.clientWidth };
                }
                return { height: document.body.clientHeight, width: document.body.clientWidth };
            }
        }
    } else {
        return { height: parseFloat($(elem).height()), width: parseFloat($(elem).width()) };
    }
};