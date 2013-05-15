/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../../JsLib/json2.js" />


/********************************************************************************************
* 文件名称:	CalvinAutoComplete.js
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	AutoComplete
* 注意事项：如果变量前面有带$表示的是JQ对象
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*
********************************************************************************************/


(function () {


    var defaults = {};
    var panelHelper = {
        getPanels: function (elem) {
            var data = $(elem).data("CalvinAccordion.data");
            if (data.panels) {
                return data.panels;
            }
            var $panels = $("AccordionPanel", elem);
            $(elem).data("CalvinAccordion.data").panels = $panels;
            return $panels;
        },
        getPanelIndex: function (elem, panel) {
            var i = -1;
            $.each(panelHelper.getPanels(elem), function () {
                ++i;
                if (this == panel) {
                    return false;
                }
            });
            return i;

        },
        getOpenedPanel: function (elem) {
            return $("div.AccordionPanelOpen", elem);
        },
        openPanel: function (elem, panel) {
            var $openedPanel = panelHelper.getOpenedPanel(elem);
            if (openedPanel[0] == panel) {
                return;
            } else {
                $openedPanel.removeClass("AccordionPanelOpen")
            
            }
        }
    };

    var eventHelper = {
        bindEevents: function (elem) {

            $.each(panelHelper.getPanels(elem), function () {

                $(".AccordionPanelTab", this).click(function () {


                });


            });

        }
    }
    $.fn.CalvinAccordion = function (options, param) {

        return this.each(function () {
            var opts = {};
            var $this = $(this);
            var state = $.data(this, 'CalvinAccordion.data');

            if (state) {
                $.extend(opts, state.options, options);
                state.options = opts;
            }
            else {
                $.extend(opts, defaults, options);
                $this.data("CalvinAccordion.data", { options: opts, panels: panelHelper.getPanels(this) });

            }
        });
    };
})();