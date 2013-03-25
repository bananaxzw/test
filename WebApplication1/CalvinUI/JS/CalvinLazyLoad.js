/// <reference path="../CalvinUI/JS/jquery-1.4.1-vsdoc.js" />
/// <reference path="CalvinBase.js" />
/********************************************************************************************
* 文件名称:	
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	
* 注意事项：如果变量前面有带$表示的是JQ对象
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*
********************************************************************************************/

(function () {

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
    window.CalvinLazyLoad = function (elems, options) {
        if (!elems || elems.length == 0) {
            return;
        }
        //初始化程序
        this._initialize(elems, options);
        //如果没有元素就退出
        if (this.isFinish()) return;
        //初始化模式设置
        this._initMode();
        //进行第一次触发
        this._resize(true);
    };

    CalvinLazyLoad.prototype = {
        //初始化程序 用_initContainer程序初始化容器对象。
        _initialize: function (elems, options) {
            this._elems = elems; //加载元素集合
            this._rect = {}; //容器位置参数对象 即容器的上下左右坐标
            this._range = {}; //加载范围参数对象 也就是当滚动条滚动时候 加载范围变化了
            this._loadData = null; //加载程序 采用静态加载 还是动态加载  在_load里面执行
            this._timer = null; //定时器
            this._lock = false; //延时锁定
            //静态使用属性
            this._index = 0; //记录索引
            this._direction = 0; //记录方向
            this._lastScroll = { "left": 0, "top": 0 }; //记录滚动值
            this._setElems = function () { }; //重置元素集合程序

            var opt = this._setOptions(options);

            this.delay = opt.delay; //延时多少
            this.threshold = opt.threshold; //加载临界值
            this.beforeLoad = opt.beforeLoad;  //加载前事件 在_load里面执行

            this._onLoadData = opt.onLoadData;
            this._container = this._initContainer(opt.container); //容器
        },
        //设置默认属性
        _setOptions: function (options) {
            this.options = {//默认值
                container: window, //容器
                mode: "dynamic", //模式
                threshold: 0, //加载范围阈值
                delay: 100, //延时时间
                beforeLoad: function () { }, //加载前执行
                onLoadData: function () { } //显示加载数据
            };
            return $.extend(this.options, options || {});
        },
        //初始化容器设置
        _initContainer: function (container) {
            var doc = document, isWindow = CalvinBase.domHelper.isWindow(container);
            if (isWindow) {
                container = doc.compatMode == 'CSS1Compat' ? doc.documentElement : doc.body;
            }
            var $container = $(container);
            //定义执行方法
            var oThis = this, width = 0, height = 0;

            this.load = function () {
                return oThis._load.call(oThis);
            }
            this.resize = function () {
                return oThis._resize.call(oThis);
            }
            //延时加载程序//防止重复触发bug
            this.delayLoad = function () {
                oThis._delay(oThis.load);
            };
            //延时加载程序 //防止重复触发bug
            this.delayResize = function () {
                var clientWidth = container.clientWidth,
			clientHeight = container.clientHeight;
                if (clientWidth != width || clientHeight != height) {
                    width = clientWidth; height = clientHeight;
                    oThis._delay(oThis.resize);
                }
            };
            //记录绑定元素方便移除
            this._binder = isWindow ? window : container;
            $(container).data("lazyLoad", { context: this });
            //绑定事件 滚动时候和relize时候触发
            $(container).bind("scroll", this.delayLoad);
            isWindow && $(container).bind("resize", this.delayResize);
            //获取容器位置参数函数 上下左右的坐标 也就是_rect
            this._getContainerRect = function () {
                if (isWindow && ("innerHeight" in window)) {
                    return { "left": 0, "right": window.innerWidth, "top": 0, "bottom": window.innerHeight };
                }
                else {
                    return oThis._getRect(container);
                }
            }

            this._getScroll = function () {
                return { "left": $container.scrollLeft(), "top": $container.scrollTop() };
            }
            return container;
        },

        //初始化模式设置
        _initMode: function () {
            switch (this.options.mode.toLowerCase()) {
                case "vertical": //垂直方向
                    this._initStatic("vertical", "vertical");
                    break;
                case "horizontal": //水平方向
                    this._initStatic("horizontal", "horizontal");
                    break;
                case "cross":
                case "cross-vertical": //垂直正交方向
                    this._initStatic("cross", "vertical");
                    break;
                case "cross-horizontal": //水平正交方向
                    this._initStatic("cross", "horizontal");
                    break;
                case "dynamic": //动态加载
                default:
                    this._loadData = this._loadDynamic;
            }
        },
        //初始化静态加载设置
        _initStatic: function (mode, direction) {
            //设置模式
            var isVertical = direction == "vertical";
            var othis = this;
            //设置元素
            var pos = isVertical ? "top" : "left";
            var sortFunction = function (x, y) {
                return x._rect[pos] - y._rect[pos];
            };
            var getRect = function (elem) {
                elem._rect = othis._getRect(elem);
                return elem;
            };
            //静态加载的时候 根据方向重新排序eles
            this._setElems = function () {
                // var timer1 = "sfsaf";
                // console.time(timer1);
                this._elems = $.map(this._elems, getRect).sort(sortFunction);
                // console.timeEnd(timer1);

            };

            this._loadData = function (force) {
                this._loadStatic(direction, mode, force);
            }

        },

        //加载程序
        _load: function (force) {

            if (this.isFinish()) return;
            var rect = this._rect, scroll = this._getScroll(),
		left = scroll.left, top = scroll.top,
		threshold = Math.max(0, this.threshold | 0);
            //记录原始加载范围参数
            this._range = {
                top: rect.top + top - threshold,
                bottom: rect.bottom + top + threshold,
                left: rect.left + left - threshold,
                right: rect.right + left + threshold
            }
            //加载数据
            this.beforeLoad();
            this._loadData(force);
        },
        //动态加载程序
        _loadDynamic: function () {
            this._elems = $(this._elems).filter(function (index, elem) {
                return !this._insideRange(elem);
            })
        },
        //静态加载程序
        _loadStatic: function (direction, mode, force) {
            //获取方向
            var isVertical = direction == "vertical";
            var directionValue;
            if (mode == "cross") {
                directionValue = this._getCrossDirection(isVertical ? "_verticalDirection" : "_horizontalDirection", isVertical ? "_horizontalDirection" : "_verticalDirection", force);
            }
            else {
                directionValue = this["_" + direction + "Direction"](force); //判断滚动的方向
            }
            if (!directionValue) return;

            //根据方向历遍图片对象
            //水平和垂直_index好像一直保持在0
            var elems = this._elems, i = this._index, begin = [], middle = [], end = [];
            if (directionValue > 0) {//水平向后滚动或者垂直向下
                begin = elems.slice(0, i);
                for (var len = elems.length; i < len; i++) {
                    if (this._outofRange(mode, "_" + direction + "AfterRange", middle, elems[i])) {
                        end = elems.slice(i + 1); break;
                    }
                }
                i = begin.length + middle.length - 1;
            } else {//水平向前滚动或者垂直向上
                end = elems.slice(i + 1);
                for (; i >= 0; i--) {
                    if (this._outofRange(mode, "_" + direction + "BeforeRange", middle, elems[i])) {
                        begin = elems.slice(0, i); break;
                    }
                }
                middle.reverse();
            }
            this._index = Math.max(0, i);
            this._elems = begin.concat(middle, end);
        },
        /*延时程序
        一般情况下，触发程序会绑定到容器的scroll和resize事件中。
        但很多时候scroll和resize会被连续触发执行，大量连续的执行会占用很多资源。
        为了防止无意义的连续执行，程序设置了一个_delay方法来做延时：*/
        _delay: function (run) {
            clearTimeout(this._timer);
            if (this.isFinish()) return;
            var oThis = this, delay = this.delay;
            if (this._lock) {//防止连续触发
                this._timer = setTimeout(function () { oThis._delay(run); }, delay);
            } else {
                this._lock = true; run();
                setTimeout(function () { oThis._lock = false; }, delay);
            }
        },
        //重置范围参数并加载数据
        _resize: function (change) {
            if (this.isFinish()) return;
            this._rect = this._getContainerRect();
            //位置改变的话需要重置元素位置
            if (change) { this._setElems(); }
            this._load(true);
        },

        //垂直和水平滚动方向获取程序
        _verticalDirection: function (force) {
            return this._getDirection(force, "top");
        },
        _horizontalDirection: function (force) {
            return this._getDirection(force, "left");
        },
        //滚动方向获取程序
        _getDirection: function (force, scroll) {
            var now = this._getScroll()[scroll], _scroll = this._lastScroll;
            if (force) { _scroll[scroll] = now; this._index = 0; return 1; }
            var old = _scroll[scroll]; _scroll[scroll] = now;
            return now - old;
        },
        //cross滚动方向获取程序
        _getCrossDirection: function (primary, secondary, force) {
            var direction;
            if (!force) {
                direction = this[primary]();
                secondary = this[secondary]();
                if (!direction && !secondary) {//无滚动
                    return 0;
                } else if (!direction) {//次方向滚动
                    if (this._direction) {
                        direction = -this._direction; //用上一次的相反方向
                    } else {
                        force = true; //没有记录过方向
                    }
                } else if (secondary && direction * this._direction >= 0) {
                    force = true; //同时滚动并且方向跟上一次滚动相同
                }
            }
            if (force) {
                this._lastScroll = this._getScroll(); this._index = 0; direction = 1;
            }
            return (this._direction = direction);
        },
        //判断是否加载范围内
        _insideRange: function (elem, mode) {
            var range = this._range, rect = elem._rect || this._getRect(elem),
		insideH = rect.right >= range.left && rect.left <= range.right,
		insideV = rect.bottom >= range.top && rect.top <= range.bottom,
		inside = {
		    "horizontal": insideH,
		    "vertical": insideV,
		    "cross": insideH && insideV
		}[mode || "cross"];
            //在加载范围内加载数据
            if (inside) { this._onLoadData(elem); }
            return inside;
        },
        //判断是否超过加载范围 mode加载的方向 compare 采用 _horizontalBeforeRange，_horizontalAfterRange中的一种
        _outofRange: function (mode, compare, middle, elem) {
            if (!this._insideRange(elem, mode)) {
                middle.push(elem);
                return this[compare](elem._rect);
            }
        },
        _horizontalBeforeRange: function (rect) { return rect.right < this._range.left; },
        _horizontalAfterRange: function (rect) { return rect.left > this._range.right; },
        _verticalBeforeRange: function (rect) { return rect.bottom < this._range.top; },
        _verticalAfterRange: function (rect) { return rect.top > this._range.bottom; },

        //获取位置参数
        _getRect: function (node) {
            var n = node, left = 0, top = 0;
            while (n) { left += n.offsetLeft; top += n.offsetTop; n = n.offsetParent; };
            return {
                "left": left, "right": left + node.offsetWidth,
                "top": top, "bottom": top + node.offsetHeight
            };
        },
        //是否完成加载
        isFinish: function () {
            if (!this._elems || !this._elems.length) {
                this.dispose(); return true;
            } else {
                return false;
            }
        },
        //销毁程序
        dispose: function (load) {
            var elems = this._elems;
            var othis = this;
            clearTimeout(this._timer);
            if (this._elems || this._binder) {
                //加载全部元素
                if (load && this._elems) {
                    $.each(this._elemts, function (i, elem) {
                        othis._onLoadData(elem);
                    })
                }
                $(othis._binder).unbind("scroll").unbind("resize");
                this._elems = this._binder = null;
            }
        }
    };
})();
