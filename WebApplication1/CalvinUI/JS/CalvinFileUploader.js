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
    function compare(obj1, obj2) {
        if (obj1 == null || obj2 == null) return (obj1 === obj2);
        return (obj1 == obj2 && obj1.constructor.toString() == obj2.constructor);
    }
    Array.prototype.indexOf = function (obj) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (compare(this[i], obj)) return i;
        }
        return -1;
    }
    var defaults = { accept:"*", min: 1, source: [], selected: function (event, item) { }, dynamicSource: false, ajaxOption: { url: "", extendData: {} }, AutoInput: true, MenuHideAuto: true };

    function getFileName(str1) {
        var regstr = /\\/,
        regresult = new RegExp(regstr),
        parts = str1.split(regresult),
        fileName = parts[parts.length - 1];
        return fileName.split('.');
    };
    function checkExsit(name) {
        var s = false;
        $("span.fileName", $("ul.addfj_new")).each(function () {
            if ($(this).text() == name) {
                s = true;
                return false;
            }
        });
        $("span.fileName", $("ul.addfj_draft")).each(function () {
            if ($(this).text() == name) {
                s = true;
                return false;
            }
        });
        $("span.fileName", $("ul.addfj_innerfiles")).each(function () {
            if ($(this).text() == name) {
                s = true;
                return false;
            }
        });
        return s;
    };


    var eventHelper = {
        addFile: function (input_file) {
            var filePath = $(input_file).val(), fileName = getFileName(filePath).join(".");
            if (checkExsit(fileName)) {
                alert("文件" + fileName + "已经存在");
                return;
            }
            var $s = $("<li><span class='icon_addfj'></span><span class='fileName'>" + fileName + "</span>&nbsp;&nbsp;<span class='file_delete'><a href='javascript:void(0);'>删除</a></span></li>");
            $("ul.addfj_new").append($s);
            input_file.name = "email_data";
            $s.append(input_file);
        },
        changeEvent: function (input) {
            var input_container = $(input).parent();
            eventHelper.addFile(input);
            var $input_temp = $("<input class='email_addfile' type='file' size='1'/>");
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
            $("ul.addfj_new").delegate("span.file_delete", "click", function () {
                $(this).parent().remove();
            });
            //删除事件
            $("ul.addfj_draft").delegate("span.file_delete", "click", function () {
                $(this).parent().remove();
            });
            //删除事件
            $("ul.addfj_innerfiles").delegate("span.file_delete", "click", function () {
                $(this).parent().remove();
            });
        });
    };
})();