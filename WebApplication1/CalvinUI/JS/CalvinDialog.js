/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="CalvinBase.js" />
/// <reference path="CalvinPanel.js" />
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
    $.fn.CalvinUIBlock = function (options, params) {

        var defaults = {
            // message displayed when blocking (use null for no message)
            //默认的遮罩层消息
            message: '<h1>Please wait...</h1>',
            title: "",
            footer: "",
            //是否显示消息面板的头部
            isShowHeader: true,
            showTitle: true,
            showFooter: true,
            showClose: true,
            //关闭
            closed: false,
            draggable: true,
            blockElement: window,

            //遮罩层的中间消息的样式
            css: {
                padding: 0,
                margin: 0,
                width: '',
                top: '40%',
                left: '35%',
                textAlign: 'center',
                color: '#000'
                // border: 'none',
                //backgroundColor: '#fff'
                // cursor: 'wait'
            },
            //遮罩层的样式
            overlayCSS: {
                backgroundColor: '#000',
                opacity: '0.5'
            },


            // IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
            // (hat tip to Jorge H. N. de Vasconcelos)
            //IE问题："about:blank" fails on HTTPS and javascript:false is s-l-o-w
            iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

            //在非IE浏览器中强制使用iframe(handy for blocking applets)
            forceIframe: false,

            baseZ: 1000,

            // set these to true to have the message automatically centered
            //将信息显示在中间，centerX只有在element blocking时才有效，而page blocking是通过CSS来控制的
            centerX: true, // <-- only effects element blocking (page block controlled via css above)
            centerY: true,
            //是否显示遮罩层
            showOverlay: true,
            // suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
            applyPlatformOpacityRules: true,
            //遮罩层出现时候 执行回调函数
            onBlock: function () { },

            //遮罩层关闭时执行回调函数
            onUnblock: function () { },

            // don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
            quirksmodeOffsetHack: 4,

            // class name of the message block
            blockMsgClass: 'blockMsg'
        };
        var styleHelper = {
            /*
            *@description 让对象在父元素中居中
            *@param  {el} 要居中的对象
            *@param {x} 是否X方向居中
            *@param {Y} 是否Y方向居中
            */
            center: function (el, x, y) {
                if (!x && !y) return;
                var p = el.parentNode, s = el.style;
                var $p = $(p);
                var borderAndPaddingWidth, borderAndPaddingHeight;

                if ($.support.boxModel) {
                    borderAndPaddingWidth = $p.outerWidth() - $p.width();
                    borderAndPaddingHeight = $p.outerHeight() - $p.height();
                }

                var l, t;
                if ($.support.boxModel) {
                    l = ((p.offsetWidth - el.offsetWidth) / 2) - (borderAndPaddingWidth / 2);
                    t = ((p.offsetHeight - el.offsetHeight) / 2) - (borderAndPaddingHeight / 2);

                }
                else {
                    l = (p.offsetWidth - el.offsetWidth) / 2;
                    t = (p.offsetHeight - el.offsetHeight) / 2;
                }
                if (x) s.left = l > 0 ? (l + 'px') : '0';
                if (y) s.top = t > 0 ? (t + 'px') : '0';
            }


        };
        var blockUIHelper = {
            //取消对话框
            unBlockUI: function (target) {
                var data = $.data(target, "UIBlock");
                var opts = data.options;
                maskHelper.hideMasker(target);
                data.dialogPanel.hide();
                opts.closed = true;
                opts.onUnblock.call(target);
            },
            //显示对话框
            blockUI: function (target) {
                var data = $.data(target, "UIBlock");
                var opts = data.options;
                maskHelper.showMasker(target);
                data.dialogPanel.show();
                opts.closed = false;
                opts.onBlock.call(target)
            }
        };
        var maskHelper = {
            /**
            * @description 生成遮罩层
            */
            createMask: function (target) {
                var data = $.data(target, "UIBlock");
                if (data.masker) {
                    maskHelper.removeMask(target);

                }
                var opts = data.options;

                var z_index = opts.baseZ;
                //构造iframe层 遮住select
                var iframeLayer;
                //在IE6或者非IE浏览器强制使用iframe iframe的作用是为了遮盖住select 是完全透明的
                if (CalvinBase.BrowserHelper.isIE6() || opts.forceIframe) {
                    iframeLayer = $('<iframe class="CalvinUIBlock" style="z-index:' + (z_index++) + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0" src="' + opts.iframeSrc + '"></iframe>');
                }
                else {
                    //如果是其他的浏览器默认给一个空值
                    iframeLayer = $('<div class="CalvinUIBlock" style="display:none;width:0px;height:0px;"></div>');
                }
                //该div层的作用在iframe层上形成一个半透明的灰色（可以自定义颜色）遮罩
                var divOverlay = $('<div class="CalvinUIBlock blockOverlay" style="z-index:' + (z_index++) + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');
                return [iframeLayer[0], divOverlay[0]];
            },
            /**
            * @description 设置遮罩层的样式 包括位置信息等等
            /* @param {lyr1} iframe遮罩层
            /* @param {lyr2} div遮罩层
            */
            setMaskStyle: function (target, $lyr1, $lyr2) {

                var opts = $.data(target, "UIBlock").options;

                //是页面遮罩还是局部的元素遮罩
                var full = (opts.blockElement == window);
                //要把body的margin和padding设置为0 不然有滚动条
                if (full) {
                    $("body").css({ "margin": "0px", "padding": "0px" });
                }

                //设置透明度 iframe为完全透明
                if (CalvinBase.BrowserHelper.isIE6() || opts.forceIframe) {
                    $lyr1.css('opacity', 0.0);
                }


                if (!opts.applyPlatformOpacityRules || !($.browser.mozilla && /Linux/.test(navigator.platform))) {
                    $lyr2.css(opts.overlayCSS);
                }
                //IE6下不支持absolute要重新设置
                if (!CalvinBase.BrowserHelper.isIE6()) {
                    $lyr1.css('position', full ? 'fixed' : 'absolute');
                    $lyr2.css('position', full ? 'fixed' : 'absolute');
                }
                else {
                    $('html,body').css({ 'height': '100%', 'width': '100%', 'margin': '0px' });
                    $lyr1.css("position", 'absolute');
                    $lyr2.css("position", 'absolute');

                    if (full) {
                        var height = Math.max(document.body.scrollHeight, document.body.offsetHeight);
                        var width = document.documentElement.offsetWidth || document.body.offsetWidth;
                        if (!jQuery.boxModel) {
                            height -= opts.quirksmodeOffsetHack;
                        }
                        //  height -= ;
                        //IE6下100%多出17个像素
                        width -= 17;
                        $lyr1.height(height);
                        $lyr1.width(width);
                        $lyr2.height(height);
                        $lyr2.width(width);
                        //s.setExpression('height', 'Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:' + opts.quirksmodeOffsetHack + ') + "px"');
                        //s.setExpression('width', 'jQuery.boxModel && document.documentElement.offsetWidth || document.body.offsetWidth + "px"');
                    }
                    else {
                        var s1 = $lyr1[0].style;
                        var s2 = $lyr2[0].style;
                        s1.setExpression('height', 'this.parentNode.offsetHeight + "px"');
                        s1.setExpression('width', 'this.parentNode.offsetWidth + "px"');
                        s2.setExpression('height', 'this.parentNode.offsetHeight + "px"');
                        s2.setExpression('width', 'this.parentNode.offsetWidth + "px"');
                    }
                }
                //如果不采用遮罩层的话 
                if (!opts.showOverlay && !opts.forceIframe) {
                    maskHelper.hideMasker(target);
                }
                //但是IE6必须iframe要出现
                else if (CalvinBase.BrowserHelper.isIE6()) {
                    $lyr1.show();
                }
            },
            /**
            * @description 移除遮罩层
            */
            removeMask: function (target) {
                var data = $.data(target, 'UIBlock');
                if (!data) return;
                if (!data.masker) return;
                $.each(data.masker, function () {
                    this.remove();
                });
                data.masker = null;
            },
            /**
            * @description 隐藏遮罩层
            */
            hideMasker: function (target) {
                var data = $.data(target, 'UIBlock');
                if (!data) return;
                if (!data.masker) return;
                $.each(data.masker, function () {
                    this.hide();
                });
            },
            /**
            * @description 显示遮罩层
            */
            showMasker: function (target) {

                var data = $.data(target, 'UIBlock');
                if (!data) return;
                if (!data.masker) return;
                //IE6的话iframe遮罩层肯定要显示
                if (CalvinBase.BrowserHelper.isIE6()) {
                    data.masker[0].show();
                }
                //如果没要求显示半透明遮罩则不显示
                if (data.options.showOverlay) {
                    data.masker[1].show();
                }
            }
        };
        var messageHelper = {
            /**
            * @description 生成对话框中间的消息
            */
            createMessage: function (target) {

                var data = $.data(target, "UIBlock"), opts = data.options, $dialog = $("<div id='Dialog' class='Dialog' style='display:block;position:" + (opts.blockElement == window ? 'fixed' : 'absolute') + ";z-index:" + (opts.baseZ + 2) + ";margin: 0px;'></div>"),
        dialogContent = $('<div class="Dialog_content"></div>');
                if (opts.showTitle) {
                    var dialogTitle = $('<div class="Dialog_title" id="Dialog_title" style="cursor: move;"><h4 style="float:left;display:inline-block;margin:0;">' + opts.title + '</h4></div>');
                    if (opts.showClose) {
                        var closeBtn = $('<a href="javascript:void(0)" title="关闭窗口" class="close_btn" id="slCloseBtn">×</a>');
                        closeBtn.click(function () {
                            blockUIHelper.unBlockUI(target);
                        });
                        dialogTitle.prepend(closeBtn);
                    }

                    dialogContent.append(dialogTitle);
                    dialogContent.append("<div class='line'/>");
                }
                var dialogMessage = $('<div class="Dialog_message">' + opts.message + '</div>');
                dialogContent.append(dialogMessage);
                if (opts.showFooter) {
                    dialogContent.append("<div class='line'/>");
                    var dialogFooter = $('<div class="Dialog_footer">' + opts.footer + '</div>');
                    dialogContent.append(dialogFooter);
                }
                $dialog.append(dialogContent);
                return $dialog;
            },
            /**
            * @description 包裹对话框和设置对话框的样式
            */
            wrapAndSetMessageStyle: function ($message, target) {

                var opts = $.data(target, "UIBlock").options;
                var z_index = opts.baseZ;
                //(target == window); //是页面遮罩还是局部的元素遮罩 这个暂时写死
                var full = (opts.blockElement == window);
                if (full) {
                    $message.appendTo($("Body"));
                }
                else {
                    $message.appendTo(opts.blockElement);
                }
                $message.show();
                //IE6的话 可以采用setExpression来居中消息   其他的可以采用fiexed属性来居中
                if (CalvinBase.BrowserHelper.isIE6() && full) {
                    $message.css("position", 'absolute');
                    $message.css(opts.css);
                    $message[0].style.setExpression('top', '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (document.documentElement.scrollTop||document.body.scrollTop) + "px"');
                    $message[0].style.setExpression('left', '(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (document.documentElement.scrollLeft||document.body.scrollLeft) + "px"');
                }
                else if (full) {
                    $message.css(opts.css);
                }
                else {
                    styleHelper.center($message[0], opts.centerX, opts.centerY);
                }

                return $message;
            }



        };
        if (typeof options === "string") {
            if (!$.data(this[0], 'UIBlock')) {
                this.CalvinUIBlock();
            }
            switch (options.toUpperCase()) {
                case "OPEN":
                    blockUIHelper.blockUI(this[0]);
                    return;
                case "CLOSE":
                    blockUIHelper.unBlockUI(this[0]);
                    return;

            }
        };
        return this.each(function () {
            var $this = $(this);
            var state = $.data(this, 'UIBlock');

            if (state) {

                opts = $.extend(true, state.options, options);
            }
            else {

                opts = $.extend(true, defaults, options);
                //message包含dialogPanel
                $this.data("UIBlock", { options: opts, masker: null, dialogPanel: null, message: null });


            }
            //构建遮罩层
            var MaskLays = maskHelper.createMask(this);
            $this.data("UIBlock").masker = [$(MaskLays[0]), $(MaskLays[1])];

            var full = (opts.blockElement == window);
            //如果不是full的话 元素要设置position=relative 这样是为了方便遮罩层top:0 width100% left:0 height100%
            //遮盖元素
            if (!full) {
                if ($.css(opts.blockElement, 'position') == 'static')
                    opts.blockElement.style.position = 'relative';
            }

            //遍历遮罩层 如果是全局覆盖就append到body 不是的话就附加到元素
            $.each(MaskLays, function (i, ele) {
                if (full) {
                    $(ele).appendTo($("body"));
                }
                else {
                    $(ele).appendTo(opts.blockElement);
                }
                $(ele).show();
            });
            //设置遮罩层样式
            maskHelper.setMaskStyle(this, $(MaskLays[0]), $(MaskLays[1]));


            //构建对话框
            var $Panel = messageHelper.createMessage(this);
            $this.data("UIBlock").dialogPanel = $Panel;
            var wrapMessage = messageHelper.wrapAndSetMessageStyle($Panel, this);
            $this.data("UIBlock").message = wrapMessage;
            if (opts.closed) {
                blockUIHelper.unBlockUI(this);
            }
            //            if (opts.draggable) {
            //                wrapMessage.CalvinDraggable({ containment: opts.blockElement });
            //            }
        });
    };
})();