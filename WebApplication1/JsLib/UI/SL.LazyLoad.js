﻿/// <reference path="../CalvinUI/JS/jquery-1.4.1-vsdoc.js" />
/// <reference path="CalvinBase.js" />
/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
/// <reference path="../SL.throttle.js" />
(function () {

    /*
    window.onscroll=function(){  
    var a = document.documentElement.scrollTop==0? document.body.clientHeight : document.documentElement.clientHeight;  
    var b = document.documentElement.scrollTop==0? document.body.scrollTop : document.documentElement.scrollTop;  
    var c = document.documentElement.scrollTop==0? document.body.scrollHeight : document.documentElement.scrollHeight;  
  
    if(a+b==c){  
        alert("new message");  
    }  
}
    
    */
    /*_initMode->_initStatic主要是对_loadData属性进行绑定 当是动态加载的时候就绑定到_loadDynamic 
    当静态加载的时候先调用_initStatic初始化方向参数和把 _loadData绑定到 _loadStatic
    
    加载数据 触发this.lazyload和this.lazyresize(这2者其实是为了防止_load和_resize)方法拖动滚动条
    或者改变窗口大小的时候重复触发 影响性能 实际加载数据都在_load和_resize中执行

    _load和_resize都调用_loadData所绑定的方法

    _loadData中调用 _insiderange 如果元素在范围内 就会触发用户设置的onLoadData事件
    */
    //正交加载只会加载指定视窗范围内的元素      垂直正交-一排一排加载  水平正交-一列一列加载
    //水平方向  满足水平坐标的元素都加载 一列一列
    //垂直方向 满足垂直坐标的元素都加载 一行一行

    var defaults = {
        container: window, //容器
        mode: "cross", //模式
        threshold: 0, //加载范围阈值
        delay: 100, //延时时间
        beforeLoad: function () { }, //加载前执行
        onLoadData: function () { } //显示加载数据
    };

    window.CalvinLazyLoad = function (elems, options) {
        if (!elems || elems.length == 0) {
            return;
        }
        //初始化程序
        this.initialize(elems, options);
        //如果没有元素就退出
        if (this.isFinish()) return;
        //进行第一次触发
        if (this.isTop) {
          //  $(window).trigger("scroll");
        } else {
            this.load();
        }
    };

    CalvinLazyLoad.prototype = {
        initializeLoaded:false,
        elems: [],
        isTop: false,
        initialize: function (elems, options) {
            this.setOptions(options);
            this.elems = elems;
            this.container = this.initContainer(this.opts.container);
            this.retSetElementsRect();
        },
        setOptions: function (options) {
            this.opts = {//默认值
                container: window, //容器
                mode: "cross", //模式
                threshold: 0, //加载范围阈值
                delay: 100, //延时时间
                beforeLoad: function () { }, //加载前执行
                onLoadData: function () { } //显示加载数据
            };
            return sl.extend(this.opts, options || {});
        },
        //初始化容器设置
        initContainer: function (container) {
            var doc = document, isTop = sl.InstanceOf.BodyOrHtmlOrWindow(container);
            this.isTop = isTop;
            if (isTop) {
                container = doc.compatMode == 'CSS1Compat' ? doc.documentElement : doc.body;
            }
            var $container = $(container);
            //定义执行方法
            var oThis = this, width = 0, height = 0;
            $(container).data("lazyLoad", { context: this });

            //绑定事件 滚动时候和relize时候触发
            $(isTop ? window : container).bind("scroll", sl.throttle(oThis.delay, function () {
                oThis.load.call(oThis);
            }, true));
            isTop && $(window).bind("resize", sl.throttle(oThis.delay, function () {
                //是否已经改变了 宽度
                var clientWidth = container.clientWidth, clientHeight = container.clientHeight;
                if (clientWidth != width || clientHeight != height) {
                    width = clientWidth; height = clientHeight;
                    oThis.load.call(oThis)
                }
            }, true));
            this.containerRect = getVisibleRect(container);

            return container;
        },
        //加载程序
        load: function (force) {
            if (this.isTop) {
                this.containerRect = getVisibleRect(this.container);
            } else {
                this.retSetElementsRect();

            }
            //加载数据
            //this.beforeLoad();
            this.loadData(force);
        },
        retSetElementsRect: function () {
            var elem;
            for (var i = 0; i < this.elems.length; i++) {
                elem = this.elems[i];
                elem.rect = getVisibleRect(elem, true);
            }
        },
        loadData: function (force) {
            var mode = this.opts.mode, elem;
            var onloadData = this.opts.onLoadData;
            for (var i = 0; i < this.elems.length; i++) {
                elem = this.elems[i];
                if (this.insideRange(elem, mode)) {
                    onloadData.call(this, elem);
                    sl.Array.remove(this.elems, elem);
                    --i;
                }
            }

        },
        //判断是否加载范围内
        insideRange: function (elem, mode) {
            var range = this.containerRect, rect = elem.rect,
		insideH = rect.right >= range.left && rect.left <= range.right,
		insideV = rect.bottom >= range.top && rect.top <= range.bottom,
		inside = {
		    "horizontal": insideH,
		    "vertical": insideV,
		    "cross": insideH && insideV
		}[mode || "cross"];
            //在加载范围内加载数据
            return inside;
        },
        //是否完成加载
        isFinish: function () {
            if (!this.elems || !this.elems.length) {
                this.dispose();
                return true;
            } else {
                return false;
            }
        },
        //销毁程序
        dispose: function (load) {
            if (this.isTop) {
                $(window).unbind("scroll").unbind("resize");
            }
            else {
                $(this.container).unbind("scroll");
            }
        }
    };


    function getVisibleRect(elem, addBoarder) {
        /// <summary>
        /// 获取可视区域
        /// </summary>
        /// <param name="addBoarder">是否包括边框</param>
        if (!elem) return { top: 0, bottom: 0, left: 0, right: 0 };
        var isTop = sl.InstanceOf.BodyOrHtmlOrWindow(elem);
        var $elem = $(elem), offset = sl.offset(elem), top = offset.top, left = offset.left, right, bottom;
        var borderTopWidth = parseFloat($elem.css("borderTopWidth")), borderRightWidth = parseFloat($elem.css("borderRightWidth")),
            borderLeftWidth = parseFloat($elem.css("borderLeftWidth")), borderBottomWidth = parseFloat($elem.css("borderBottomWidth")),
            innerHeight = parseFloat($elem.innerHeight()), innerWidth = parseFloat($elem.innerWidth());
        if (isTop) {
            top = 0, left = 0, bottom = 0, right = 0;
            innerHeight = parseFloat(document.documentElement["clientHeight"] || document.body["clientHeight"]);
            innerWidth = parseFloat(document.documentElement["clientWidth"] || document.body["clientWidth"]);
            top += $(document).scrollTop(), left += $(document).scrollLeft();
        }
        if (!addBoarder) {
            top = top + borderTopWidth, bottom = top + innerHeight, left = left + borderLeftWidth, right = left + innerWidth;
        }
        else {
            bottom = top + borderTopWidth + innerHeight + borderBottomWidth, right = left + borderLeftWidth + innerWidth + borderRightWidth;
        }
        return { top: top, bottom: bottom, left: left, right: right };
    }

    function getScroll() {
        return { scrollTop: $(document).scrollTop(), scrollLeft: $(document).scrollLeft() };
    }
})();
