/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../../JsLib/json2.js" />


/********************************************************************************************
* 文件名称:	CalvinFileUploader.js
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	多文件上传
* 注意事项：
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*
********************************************************************************************/
(function () {

    var defaults = { min: 1, source: [], selected: function (event, item) { }, dynamicSource: false, ajaxOption: { url: "", extendData: {} }, AutoInput: true, MenuHideAuto: true };

    function getFileName(str1) {
        var regstr = /\\/,
        regresult = new RegExp(regstr),
        parts = str1.split(regresult),
        fileName = parts[parts.length - 1];
        return fileName.split('.');
    }


    var eventHelper = {
        addFile: function (input_file) {
            var filePath = $(input_file).val();
            var $s = $("<li><span class='icon_addfj'></span>" + getFileName(filePath).join(".") + "&nbsp;&nbsp;<span class='file_delete'><a href='javascript:void(0);'>删除</a></span></li>");
            $("ul.addfj_bg").append($s);
            $s.append(input_file);
        },
        changeEvent: function (input) {
            var input_container = $(input).parent();
            eventHelper.addFile(input);
            var $input_temp = $("<input class='email_addfile' type='file' size='1' name='email_data'/>");
            input_container.append($input_temp);
            $input_temp.change(function () {
                eventHelper.changeEvent(this);
            });
            input = null;
        }
    };

    $.fn.CalvinFileUploader = function (options, param) {
        return this.each(function () {
            //文件选择
            $("input.email_addfile").change(function () {
                eventHelper.changeEvent(this);
            });
            //删除事件
            $("ul.addfj_bg").delegate("span.file_delete", "click", function () {
                $(this).parent().remove();
            });
        });
    };
})();