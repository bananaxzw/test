/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
/// <reference path="../SL.throttle.js" />

(function () {

    var defaults = {
        container: window,
        mode: "cross", //模式
        threshold: 0, //加载范围阈值
        delay: 100, //延时时间
        beforeLoad: function () { }, //加载前执行
        onLoad: function () { }, //加载时执行
        attribute: "_lazysrc", //保存原图地址的自定义属性
        holder: "" //占位图
    };


    if (!window.CalvinImagesLazyLoad) {

        window.CalvinImagesLazyLoad = function (images, options) {

            if (!images || images.length == 0) {
                return;
            }
            this.initialize(images, options);
            //进行第一次触发
            if (this.isTop) {
                $(window).trigger("scroll");
            } else {
                this.load();
            }
        };

        window.CalvinImagesLazyLoad.prototype = new CalvinLazyLoad();
        sl.extend(CalvinImagesLazyLoad.prototype, {
            //初始化程序
            initialize: function (images, options) {
                if (!images.slice) {
                    this.elems = sl.Convert.convertToArray(images);
                } else {
                    this.elems = images;
                }

                CalvinLazyLoad.prototype.initialize.call(this, this.elems, options);
                //设置子类属性
                var opt = this.opts;
                this.onLoad = opt.onLoad;
                var attribute = opt.attribute;

                if (opt.holder) {
                    sl.each(this.elems, function () {
                        this.src = opt.holder;
                    });
                }
            },
            //设置默认属性
            setOptions: function (options) {
                return CalvinLazyLoad.prototype.setOptions.call(this, sl.extend({//默认值
                    attribute: "_lazysrc", //保存原图地址的自定义属性
                    holder: "", //占位图
                    onLoad: function () { } //加载时执行
                }, sl.extend(options, {
                    onLoadData: this._onLoadData
                })));
            },
            //显示图片
            _onLoadData: function (img) {
                var imagePath = sl.attr.getAttr(img, this.opts.attribute);
                if (imagePath) {
                    img.src = imagePath;
                    img.removeAttribute(this.opts.attribute);
                    this.onLoad(img);
                }
            }
        });


    }



})();