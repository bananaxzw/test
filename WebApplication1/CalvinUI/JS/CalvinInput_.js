﻿/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../../JsLib/jq1.72.js" />
/// <reference path="CalvinAutoComplete.js" />
/********************************************************************************************
* 文件名称:	
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	
* 注意事项：
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*
********************************************************************************************/
(function () {

    function WrapText(textbox) {
        var str = " <span class='ui-input-container'>" +
        "</span>";
        $(textbox).addClass("ui-input-text").wrapAll(str);
        return $(textbox).parent().append("<span class='icon-container'><span class='ui-input-icon ui-icon ui-icon-search'></span></span>");
    };
    var Defaluts = { DefaultText: "" };

    var EventHelper = {
        setInputEvent: function ($text) {
            $text = $($text);
            var opts = $text.data("CalvinInput.data").options,
            $container = $text.data("CalvinInput.data").$Input_Container;
            //点击删除按钮 清理文字 还原样式
            $("span.ui-input-icon", $container).click(function () {
                if ($(this).hasClass("ui-icon-circle-close")) {
                    $(this).addClass("ui-icon-search").removeClass("ui-icon-circle-close");
                    $text.val(opts.DefaultText).css("color", "#a0a0a0");
                }
            });
            //点击 原来文字
            $text.focus(function () {
                if (this.value == opts.DefaultText) {
                    this.value = "";
                    this.style.color = "#000";
                }
            });
            //离开事件 复原原来文字
            $text.blur(function () {
                if (this.value == opts.DefaultText || $.trim(this.value) == "") {
                    this.value = opts.DefaultText;
                    this.style.color = "#a0a0a0";
                }
            });
            //有字母 出现删除
            $text.keyup(function () {
                if (this.value != opts.DefaultText && $.trim(this.value) != "") {
                    $("span.ui-input-icon", $container).removeClass("ui-icon-search").addClass("ui-icon-circle-close");
                }

            });
        }
    };


    $.fn.CalvinInput = function (options, param) {
        return this.each(function () {
            var opts = {},
             $this = $(this),
             state = $.data(this, 'CalvinInput.data');
            $this.css("color", "#a0a0a0");
            if (state) {
                $.extend(opts, state.options, options);
                state.options = opts;
            }
            else {
                $.extend(opts, Defaluts, options);
                var $Input_Container = WrapText(this);
                this.value = opts.DefaultText;
                $this.data("CalvinInput.data", { options: opts, $Input_Container: $Input_Container });
                EventHelper.setInputEvent($this);
            }
        });

    };

})();

