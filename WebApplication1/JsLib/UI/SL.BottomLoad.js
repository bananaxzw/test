/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />

(function () {

    var Default = {
        LoadRadius: 1, //加载范围
        onReach: function () { }
    }
    function SLBottomLoad(options) {
        this.opts = sl.extend(Default, options);
        var othis = this;
        $(window).scroll(sl.throttle(100, function () {
            othis.onScroll.apply(othis);
        }, true));
    }
    SLBottomLoad.prototype = {
        onScroll: function () {
            var scrollheight = getWindowScrollRect().height,
             scrollTop = $(document).scrollTop(),
             height = getWindowVisiableRect().height,
             LoadRadius = this.opts.LoadRadius;
            if ((scrollTop + height - scrollheight) >= LoadRadius || (scrollTop + height - scrollheight) >=-LoadRadius) {
                if (this.opts.onReach) {
                    this.opts.onReach.apply(this);
                }
            }

        }

    }
    window.SLBottomLoad = SLBottomLoad;
    //获取窗口可视区域大小
    function getWindowVisiableRect() {
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
    }

    //获取文档滚动大小
    function getWindowScrollRect() {
        return { height: document.body.scrollHeight, width: document.body.scrollWidth };
        //            var doc = window.document;
        //            return { height: GetMax("Height"), width: GetMax("Width") };
        //            function GetMax(i) {
        //                return Math.max(
        //					doc.body["scroll" + i], doc.documentElement["scroll" + i],
        //					doc.body["offset" + i], doc.documentElement["offset" + i]
        //				);
        //            }
    }

})();

