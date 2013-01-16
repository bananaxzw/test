/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
/// <reference path="../SL.throttle.js" />




var Defaults = {
    container: window,
    minColCount: 5,
    colWidth: 300
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
        var container = this.opts.container, c = $(container).css("position");
        !sl.InstanceOf.BodyOrHtmlOrWindow(container) && c != "fixed" && c != "relative" && c != "absolute" ? $(container).css("position", "relative") : false;
        this.elems = $("sl_waterfall", container).elements;
        this.containerWidth = parseFloat($(container).innerWidth());
        this.countOfRow = this.containerWidth / this.opts.colWidth | 0, this.countOfRow = this.countOfRow < this.opts.minColCount ? this.opts.minColCount : this.countOfRow;

    },
    putElements: function (elems, add) {
        var container = this.opts.container;
        if (add) {
            sl.each(elems, function () {
                container.appendChild(this);
            });
        }
        for (var i = 0, length = elems.length; i < length; i++) {

            $(elems[i]).width(this.opts.colWidth);
            var elemH = parseFloat($(elems[i]).outerHeight());
            if (!this.firstRowFull) { //第一行Pin以浮动排列，不需绝对定位
                ++this.firstRowCurrCount == this.countOfRow ? this.firstRowFull = true : false;
                this.colsHeight[i] = elemH;
                elems[i].style.position = '';
            } else {
                this.minColsHeight = Math.min.apply({}, this.colsHeight); //取得各列累计高度最低的一列
                var minColIndex = this.minColsIndex();
                this.colsHeight[minColIndex] += elemH; //加上新高度后更新高度值
                elems[i].style.position = 'relative';
                elems[i].style.top = this.minColsHeight + 'px';
                elems[i].style.left = (minColIndex * this.opts.colWidth) + 'px';
            }
        }
    }
}

