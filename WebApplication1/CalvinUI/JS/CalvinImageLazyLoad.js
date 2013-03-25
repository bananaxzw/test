/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="CalvinBase.js" />
/// <reference path="CalvinLazyLoad.js" />

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
    /*
    对CalvinLoazyLoad的扩展
    */
    if (!window.CalvinImagesLazyLoad) {

        window.CalvinImagesLazyLoad = function (options) {
            this._initialize(options);
            //如果没有元素就退出
            if (this.isFinish()) return;
            //初始化模式设置
            this._initMode();
            //进行第一次触发
            this._resize(true);
        };

        window.CalvinImagesLazyLoad.prototype = new CalvinLazyLoad();
        $.extend(CalvinImagesLazyLoad.prototype, {
            //初始化程序
            _initialize: function (options) {
                CalvinLazyLoad.prototype._initialize.call(this, [], options);
                //设置子类属性
                var opt = this.options;
                this.onLoad = opt.onLoad;
                var attribute = this._attribute = opt.attribute;
                if (opt.images && opt.images.lenngth > 0) {
                    if (opt.images.slice) {
                        this._elems = $.makeArray(opt.images);
                    }
                    this._elems = opt.images;
                }
                else {
                    this._elems = $.makeArray(this._container.getElementsByTagName("img"));
                }

                if (opt.holder && $.trim(opt.holder)) {
                    $.each(this._elems, function () {
                        this.src = opt.holder;
                    });
                }
                //判断属性是否已经加载的方法
                this._hasAttribute = CalvinBase.BrowserHelper.ie6 || CalvinBase.BrowserHelper.ie7
		? function (img) { return attribute in img; }
		: function (img) { return img.hasAttribute(attribute); };
            },
            //设置默认属性
            _setOptions: function (options) {
                return CalvinLazyLoad.prototype._setOptions.call(this, $.extend({//默认值
                    images: undefined, //图片集合
                    attribute: "_lazysrc", //保存原图地址的自定义属性
                    holder: "", //占位图
                    onLoad: function () { } //加载时执行
                }, $.extend(options, {
                    onLoadData: this._onLoadData
                })));
            },
            //显示图片
            _onLoadData: function (img) {
                var attribute = this._attribute;
                if (this._hasAttribute(img)) {
                    img.src = img.getAttribute(attribute);
                    img.removeAttribute(attribute);
                    this.onLoad(img);
                }
            }
        });


    }
})();