/// <reference path="jquery-1.4.1-vsdoc.js" />
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

