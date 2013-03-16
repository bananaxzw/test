/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../../JsLib/jq1.72.js" />


(function () {

    var ItemHepler = {
        AddUser: function (container, name, mail) {
            var str = "<div style='float: left; white-space: nowrap;' class='addr_base addr_normal'"
   + "title='" + mail + "'>"
            + "<b>" + name + "</b> <span>&lt;" + mail + "&gt;</span>"
             + "<span class='semicolon'>;</span>"
             + "<a class='addr_del' href='javascript:;' name='del'></a>"
+ "</div>";
            $(container).prepend(str);

        }

    }


    $.fn.MailInput = function (options, param) {




        this.delegate("div", "click", function () {
            alert("saf");
        });
        if (typeof options === "string") {
            switch (options.toUpperCase()) {

                case "ADD":
                    ItemHepler.AddUser(this[0], param.name, param.mail);
            }

        }
    }

})();