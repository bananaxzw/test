﻿/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../../JsLib/jq1.72.js" />


(function () {

    var ItemHepler = {
        AddUser: function (container, name, mail) {
            var str = "<div style='float: left; white-space: nowrap;' class='addr_base addr_normal'"
   + "title='" + mail + "'>"
            + "<b>" + name + "</b><span>&lt;" + mail + "&gt;</span>"
             + "<span class='semicolon'>;</span>"
             + "<a class='addr_del' href='javascript:;' name='del'></a>"
+ "</div>";
            var $UserAddr = $(str);
            $(container).prepend($UserAddr);
            // EventHelper.BindUserAddr($UserAddr);
            $UserAddr.click(function () {
                $("div.addr_base").removeClass("addr_select fn_list");
                $(this).addClass("addr_select fn_list");
            })
            $UserAddr.dblclick(function () {
                $(this).text()._getLength();
                $(this).hide().after($(".addr_text").css("width", "20px").val(''));
            })


        }

    }
    var EventHelper = {

        BindUserAddrEvent: function ($UserAddr) {
            //鼠标悬浮样式
            $UserAddr.hover(function () {
                $(this).addClass("addr_over");
            }, function () {
                $(this).removeClass("addr_over");
            });


        }
    }


    $.fn.MailInput = function (options, param) {


        var _this = this;

        this.delegate("div", "click", function (e) {
            // alert(e);
        });
        //        this.delegate("span.cusorPosition", "click", function (e) {
        //            $(".cusorPosition").show();

        //            $(this).hide().after($(".addr_text").css("width", "20px").val(''));
        //            e.stopPropagation();

        //        });
        if (typeof options === "string") {
            switch (options.toUpperCase()) {

                case "ADD":
                    ItemHepler.AddUser(this[0], param.name, param.mail);
            }

        }
    }

})();