/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />

sl.create("sl.ui", function () {

    var defaults = {
        LoadRadius: 5, //加载范围
        onReach: function () { },
        onLoad: function () { },
        container: window
    };
    this.bottomload = sl.Class(
    {
        init: function (options) {
            this.opts = sl.extend({}, defaults, options);
            this.page = 1;
            this.loaded = true;
            var othis = this;
            $(sl.InstanceOf.BodyOrHtmlOrWindow(this.opts.container) ? window : this.opts.container).scroll(sl.throttle(100, function () {
                othis.onScroll.apply(othis);
            }, true));
        },
        setLoadedState: function (state) {
            this.loaded = state;
        }
    });
    this.bottomload.prototype.onScroll = function () {
        var scrollheight = ScrollHelper.getScrollRect(this.opts.container).height,
             scrollTop = $(this.opts.container).scrollTop(),
             height = ScrollHelper.getVisiableRect(this.opts.container).height,
             LoadRadius = this.opts.LoadRadius;
        if ((scrollTop + height - scrollheight) >= LoadRadius || (scrollTop + height - scrollheight) >= -LoadRadius) {
            ++this.page;
            if (this.opts.onReach) {
                if (this.loaded) {
                    this.loaded = false;
                    this.opts.onReach.apply(this);
                    this.loaded = true;
                }
            }
        }
    };

    var ScrollHelper = {
        getVisiableRect: function (elem) {
            if (sl.InstanceOf.BodyOrHtmlOrWindow(elem)) {
                if (window.innerHeight) {
                    return { height: window.innerHeight, width: window.innerWidth };
                } else {
                    if (document.compatMode === "BackCompat") {
                        return { height: document.body.clientHeight, width: document.body.clientWidth };
                    }
                    else {
                        return { height: document.documentElement.clientHeight, width: document.documentElement.clientWidth };
                    }
                }
            } else {
                return { height: parseFloat($(elem).height()), width: parseFloat($(elem).width()) };
            }
        },
        getScrollRect: function (elem) {
            if (sl.InstanceOf.BodyOrHtmlOrWindow(elem)) {
                return { height: document.body.scrollHeight, width: document.body.scrollWidth };
            }
            else {
                return { height: elem.scrollHeight, width: elem.scrollWidth };
            }
            /*
            var doc = window.document;
            return { height: GetMax("Height"), width: GetMax("Width") };
            function GetMax(i) {
            return Math.max(
            doc.body["scroll" + i], doc.documentElement["scroll" + i],
            doc.body["offset" + i], doc.documentElement["offset" + i]
            );
            }*/
        }

    };

});

