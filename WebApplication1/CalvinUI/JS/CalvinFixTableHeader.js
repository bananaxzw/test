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
            $headerTable.wrap("<div class='fht-thead'></div>"); //包裹header
            helpers.insertDivToHeaders(table, $headerTable);



        }

        var helpers =
       {
           getHeaderCellWidth: function (table) {
               var cellWidth = [], i = 0;
               $("thead>tr", table).children().each(function () {
                   cellWidth[i] = $(this).width();
                   ++i;
               });
               return cellWidth;
           },
           insertDivToHeaders: function (table, cloneHeader) {
               var cellWidth = helpers.getHeaderCellWidth(table), i = 0;
               $("thead>tr", cloneHeader).children().each(function () {
                   $(this).append('<div style="width:' + cellWidth[i] + 'px;" class="fht-cell"></div>')
                   i++;

               });
           },
           fixStyle: function (table, cloneHeader) {
               var parent = $.data(table, "fixedHeaderTable").parent;
           }
       };


        return this.each(function () {
            var _this = this,
            $this = $(this),
            state = $.data(this, 'fixedHeaderTable'),
            opts;

            if (state) {
                // htmlHelper.destroy(this);
                opts = $.extend(state.options, options);
                state.options = opts;
            }
            else {
                opts = $.extend(defaults, options);
                $.data(this, "fixedHeaderTable", { options: opts, parent: $this.parent() });
                init(this);
            }

        });
    };
})();