/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../../JsLib/jq1.72.js" />
/// <reference path="CalvinAutoComplete.js" />
/********************************************************************************************
* 文件名称:	CalvinMailInput.js
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	邮箱输入
* 注意事项：如果变量前面有带$表示的是JQ对象
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*
********************************************************************************************/
(function () {
    var rName = /[;]/g;
    var ItemHepler = {
        AddUser: function (input, name, id) {
            if (!CheckExist(id, name, input)) {
                name = name.replace(rName, "");
                if (!name) return;
                var str = "<div style='float: left; white-space: nowrap;' class='addr_base " + (id ? "addr_normal" : "addr_error") + "'" + "addr='" + id + "'>" + "<b class='addr_name'>" + name + "</b>" + "<span class='semicolon'>;</span>" + "<a class='addr_del' href='javascript:;' name='del'></a>" + "</div>";
                var $UserAddr = $(str);
                $(input.parentNode).before($UserAddr);
                EventHelper.BindUserAddrEvent($UserAddr);
            }
            input = null
        }
    };

    function WrapText(textbox) {
        var str = "<div class='div_txt'>" + "<div  class='addr_text'>" + "</div>" + "<div style='clear:both;border:none;margin:0;padding:0;'></div></div>";
        return $(textbox).wrapAll(str).parent().parent()
    };

    function CheckExist(value, name, textBox) {
        var isE = false;
        $("div.addr_base", $(textBox).data("MailInput.data").$Mail_Container).each(function () {
            var namee = $("b.addr_name", this).text(), id = this.getAttribute("addr");
            if (id == value || name == namee) {
                isE = true;
                return false;
            }
        });
        return isE;
    };


    function GetCollectValue(textBox) {
        var values = [],
			$this, name = "";
        $("div.addr_base", $(textBox).data("MailInput.data").$Mail_Container).each(function () {
            $this = $(this);
            if (!$this.hasClass("addr_error")) {
                var name = $("b.addr_name", this).text();
                values.push({
                    id: this.getAttribute("addr"),
                    name: name
                })
            }
        });
        return values
    };
    var Defaluts = {
        data: [],
        url: "",
        min: 1
    };
    var EventHelper = {
        setInputEvent: function ($text) {
            $text.keyup(function (e) {
                var length = $(this).val()._getLength();
                $(this).parent().width(28 + length * 6);
                $(this).css("padding-left", "0px").css("padding-left", "0px")
            });
            $text.keyup(function (e) {
                var keyCode = e.keyCode;
                if (keyCode == 186) {
                    ItemHepler.AddUser($text[0], $(this).val(), "");
                    $(this).val('');
                    return
                }
            });
            $text.parent().parent().click(function () {
                $text[0].focus()
            })
        },
        BindUserAddrEvent: function ($UserAddr) {
            //地址单击
            $UserAddr.click(function (e) {
                $("div.addr_base").removeClass("addr_select fn_list");
                $(this).removeClass("addr_over");
                $(this).addClass("addr_select fn_list");
                e.stopPropagation()
            });
            $UserAddr.hover(function () {
                if ($(this).hasClass("fn_list")) {
                    return
                }
                $(this).removeClass("addr_select fn_list");
                $(this).addClass("addr_over")
            }, function () {
                $(this).removeClass("addr_over")
            });
            //分号字符
            $UserAddr.keyup(function (e) {
                var keyCode = e.keyCode;
                if (keyCode == 8 || keyCode == 46) {
                    $(this).remove()
                }
            })
        }
    };
    function banBackSpace(e) {
        var ev = e || window.event; //获取event对象
        var obj = ev.target || ev.srcElement; //获取事件源

        var t = obj.type || obj.getAttribute('type'); //获取事件源类型

        //获取作为判断条件的事件类型
        var vReadOnly = obj.getAttribute('readonly');
        var vEnabled = obj.getAttribute('enabled');
        //处理null值情况
        vReadOnly = (vReadOnly == null) ? false : vReadOnly;
        vEnabled = (vEnabled == null) ? true : vEnabled;

        //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
        //并且readonly属性为true或enabled属性为false的，则退格键失效
        var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea")
                && (vReadOnly == true || vEnabled != true)) ? true : false;

        //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
        var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
                ? true : false;

        //判断
        if (flag2) {
            return false;
        }
        if (flag1) {
            return false;
        }
    }

    //禁止后退键 作用于Firefox、Opera
    document.onkeypress = banBackSpace;
    //禁止后退键  作用于IE、Chrome
    document.onkeydown = banBackSpace;

    $.fn.MailInput = function (options, param) {
        if (typeof options === "string") {
            switch (options.toUpperCase()) {
                case "ADD":
                    ItemHepler.AddUser(this[0], param.name, param.mail);
                    return;
                case "GETVALUES":
                    return GetCollectValue(this[0]);
                    return
            }
        };
        return this.each(function () {
            var opts = {};
            var $this = $(this);
            $this.addClass("mail_input");
            var state = $.data(this, 'MailInput.data');
            if (state) {
                $.extend(opts, state.options, options);
                state.options = opts
            } else {
                $.extend(opts, Defaluts, options);
                var $Mail_Container = WrapText(this);
                $this.data("MailInput.data", {
                    options: opts,
                    $Mail_Container: $Mail_Container
                });
                $this.CalvinAutoComplete({
                    dynamicStyle: true,
                    styleInfo: {
                        width: 250
                    },
                    min: opts.min,
                    dynamicSource: true,
                    ajaxOption: {
                        url: opts.url,
                        extendData: {},
                        error: function (xhr, $loading) {
                            alert("搜索单位信息发生错误!");
                        }
                    },
                    selected: function (event, ui) {
                        ItemHepler.AddUser($this[0], ui.text, ui.value);
                        $this.val("");
                        $this.parent().width(28)
                    }
                });
                EventHelper.setInputEvent($this)
            }
        });
    };
})();

