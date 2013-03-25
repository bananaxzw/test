/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../../JsLib/jq1.72.js" />
/// <reference path="CalvinAutoComplete.js" />
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

    function WrapText(textbox) {
        var str = "<div class='lm_sbar'>" +
            "<div>" +
           "</div>" +
        "</div>";
        $(textbox).wrapAll(str);
        return $(textbox).parent().parent().prepend("<input type='button' class='lm_btn lm_sopen' />");
    };



    var Defaluts = { DefaultText: "" };

    var EventHelper = {
        setInputEvent: function ($text) {
            $text = $($text);
            var opts = $text.data("CalvinInput.data").options,
            $container = $text.data("CalvinInput.data").$Input_Container;
            //点击删除按钮 清理文字 还原样式
            $("input.lm_btn", $container).click(function () {
                if ($(this).hasClass("lm_sclose")) {
                    $(this).addClass("lm_sopen").removeClass("lm_sclose");
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
                    $("input.lm_btn", $container).removeClass("lm_sopen").addClass("lm_sclose");
                }

            });
        }
    };


    $.fn.CalvinInput = function (options, param) {
        if (typeof options === "string") {
            switch (options.toUpperCase()) {
                case "ADD":
                    ItemHepler.AddUser(this[0], param.name, param.mail);
                    return;
                case "GETVALUES":
                    return GetCollectValue(this[0]);
                    return;
            }

        };
        return this.each(function () {
            var opts = {},
             $this = $(this),
             state = $.data(this, 'CalvinInput.data');

            $this.css("color", "#a0a0a0").addClass("txt");
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

