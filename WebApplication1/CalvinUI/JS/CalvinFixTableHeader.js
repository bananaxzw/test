/// <reference path="jquery-1.4.1-vsdoc.js" />
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
    $.fn.CalvinfixedHeaderTable = function (options, param) {

        // plugin's default options
        var defaults = {

            width: '100%',
            height: '100%',
            themeClass: 'fht-default',
            borderCollapse: true,
            fixedColumns: 0, // fixed first columns
            fixedColumn: false, // For backward-compatibility
            sortable: false,
            autoShow: true, // hide table after its created
            footer: false, // show footer
            cloneHeadToFoot: false, // clone head and use as footer
            autoResize: false, // resize table if its parent wrapper changes size
            create: null // callback after plugin completes
        };

        var helpers = {


        }

        function init(table) {
            var $this = $(table), $theader, $tbody, $headerTable, $wrapper;
            $theader = $("thead", table);
            $headerTable = $this.clone(); //克隆头部
            $("tbody", $headerTable).remove(); //移除标头的tbody内容
            $wrapper = $this.wrap("<div class='fht-table-wrapper' style='height:100%;width:100%;display:block;'><div class='fht-tbody'></div></div>").parent().parent();
            $wrapper.prepend($headerTable);
            $.data(table, "fixedHeaderTable").wrapper = $wrapper;
            $headerTable.wrap("<div class='fht-thead'></div>"); //包裹header
            helpers.insertDivToHeaders(table, $headerTable);
            helpers.fixStyle(table, $headerTable);
        }

        var helpers =
       {
           getHeaderCellWidth: function (table) {
               var cellWidth = [];
               $("thead>tr", table).children().each(function (index) {
                   var bwidth = ($(this).outerWidth() - $(this).innerWidth()) / 2;
                   cellWidth[index] = parseInt($(this).width() + bwidth);
               });
               return cellWidth;
           },
           insertDivToHeaders: function (table, cloneHeader) {
               var cellWidth = helpers.getHeaderCellWidth(table);
               $("thead>tr", cloneHeader).children().each(function (index) {
                   $(this).append('<div style="width:' + cellWidth[index] + 'px;" class="fht-cell"></div>')
               });
               $("thead>tr", table).children().each(function (index) {
                   $(this).append('<div style="width:' + cellWidth[index] + 'px;" class="fht-cell"></div>')
               });
           },
           fixStyle: function (table, cloneHeader) {
               var data = $.data(table, "fixedHeaderTable");
               var parent = data.parent, pHeight = parent.innerHeight(), warper = data.warpper, headerHieght = cloneHeader.parent().outerHeight();
               //设置div包裹table的高度
               var divdtbody = $("div.fht-tbody", warper).height(pHeight - headerHieght);
               //设置table表头maegin以便隐藏
               var table = $("div.fht-tbody>table", warper).css("margin-top", -headerHieght);

           }
       };


        return this.each(function () {
            var _this = this,
            $this = $(this).addClass("fht-table"),
            state = $.data(this, 'fixedHeaderTable'),
            opts;

            if (state) {
                // htmlHelper.destroy(this);
                opts = $.extend(state.options, options);
                state.options = opts;
            }
            else {
                opts = $.extend(defaults, options);
                $.data(this, "fixedHeaderTable", { options: opts, parent: $this.parent(), warpper: null });
                init(this);
            }

        });
    };
})();