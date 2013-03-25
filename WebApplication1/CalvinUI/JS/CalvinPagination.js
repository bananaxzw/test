
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
    $.fn.CalvinPagination = function () {

        function buildToolbar(target) {
            var opts = $.data(target, 'pagination').options;
            //清空
            var pager = $(target).addClass('pagination').empty();
            //创建表格
            var t = $('<table cellspacing="0" cellpadding="0" border="0"><tr></tr></table>').appendTo(pager);
            var tr = $('tr', t);
            //创建页大小下拉框
            if (opts.showPageList) {
                var ps = $('<select class="pagination-page-list"></select>');
                var options = "";
                for (var i = 0; i < opts.pageList.length; i++) {
                    options += "<option selected='" + opts.pageList[i] == opts.pageSize ? 'selected' : '' + "'>" + opts.pageList[i] + "</option>"

                }
                ps.html(options);

                $('<td></td>').append(ps).appendTo(tr);

                opts.pageSize = parseInt(ps.val());
                //创建分割符
                $('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
            }

            //创建第一页 前一页按钮
            /*
            $('<td><a href="javascript:void(0)" icon="pagination-first"></a></td>').appendTo(tr);
            $('<td><a href="javascript:void(0)" icon="pagination-prev"></a></td>').appendTo(tr);
            $('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);*/
            $('<td><a href="javascript:void(0)" icon="pagination-first"></a></td><td><a href="javascript:void(0)" icon="pagination-prev"></a></td><td><div class="pagination-btn-separator"></div></td>').appendTo(tr);


            $('<td><span style="padding-left:6px;">' + opts.beforePageText + '</span></td>').appendTo(tr);
            //页码文本框
            $('<td><input class="pagination-num" type="text" value="1" size="2"></td>').appendTo(tr);
            $('<td><span style="padding-right:6px;"></span></td>').appendTo(tr);


            //创建后一页 最后一页按钮
            /*
            $('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
            $('<td><a href="javascript:void(0)" icon="pagination-next"></a></td>').appendTo(tr);
            $('<td><a href="javascript:void(0)" icon="pagination-last"></a></td>').appendTo(tr);*/
            $('<td><div class="pagination-btn-separator"></div></td><td><a href="javascript:void(0)" icon="pagination-next"></a></td><td><a href="javascript:void(0)" icon="pagination-last"></a></td>').appendTo(tr);

            //创建刷新按钮
            if (opts.showRefresh) {
            /*
                $('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
                $('<td><a href="javascript:void(0)" icon="pagination-load"></a></td>').appendTo(tr);*/
                $('<td><div class="pagination-btn-separator"></div></td><td><a href="javascript:void(0)" icon="pagination-load"></a></td>').appendTo(tr);
                //			if (opts.loading) {
                //				$('<td><a class="pagination-refresh" href="javascript:void(0)" icon="pagination-loading"></a></td>').appendTo(tr);
                //			} else {
                //				$('<td><a class="pagination-refresh" href="javascript:void(0)" icon="pagination-load"></a></td>').appendTo(tr);
                //			}
            }
            //创建自定义按钮
            if (opts.buttons) {
                $('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
                for (var i = 0; i < opts.buttons.length; i++) {
                    var btn = opts.buttons[i];
                    if (btn == '-') {
                        $('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
                    } else {
                        var td = $('<td></td>').appendTo(tr);
                        $('<a href="javascript:void(0)" class="l-btn" style="float:left">' + btn.text + '</a>')
							.attr('icon', btn.iconCls || '')
							.bind('click', eval(btn.handler || function () { }))
							.appendTo(td)
							.linkbutton({ plain: true });
                    }
                }
            }

            $('<div class="pagination-info"></div>').appendTo(pager);
            $('<div style="clear:both;"></div>').appendTo(pager);


            $('a[icon^=pagination]', pager).linkbutton({ plain: true });

            pager.find('a[icon=pagination-first]').unbind('.pagination').bind('click.pagination', function () {
                if (opts.pageNumber > 1) selectPage(target, 1);
            });
            pager.find('a[icon=pagination-prev]').unbind('.pagination').bind('click.pagination', function () {
                if (opts.pageNumber > 1) selectPage(target, opts.pageNumber - 1);
            });
            pager.find('a[icon=pagination-next]').unbind('.pagination').bind('click.pagination', function () {
                var pageCount = Math.ceil(opts.total / opts.pageSize);
                if (opts.pageNumber < pageCount) selectPage(target, opts.pageNumber + 1);
            });
            pager.find('a[icon=pagination-last]').unbind('.pagination').bind('click.pagination', function () {
                var pageCount = Math.ceil(opts.total / opts.pageSize);
                if (opts.pageNumber < pageCount) selectPage(target, pageCount);
            });
            pager.find('a[icon=pagination-load]').unbind('.pagination').bind('click.pagination', function () {
                if (opts.onBeforeRefresh.call(target, opts.pageNumber, opts.pageSize) != false) {
                    selectPage(target, opts.pageNumber);
                    opts.onRefresh.call(target, opts.pageNumber, opts.pageSize);
                }
            });
            pager.find('input.pagination-num').unbind('.pagination').bind('keydown.pagination', function (e) {
                if (e.keyCode == 13) {
                    var pageNumber = parseInt($(this).val()) || 1;
                    selectPage(target, pageNumber);
                }
            });
            pager.find('.pagination-page-list').unbind('.pagination').bind('change.pagination', function () {
                opts.pageSize = $(this).val();
                opts.onChangePageSize.call(target, opts.pageSize);

                var pageCount = Math.ceil(opts.total / opts.pageSize);
                selectPage(target, opts.pageNumber);
            });
        }
        var Defaults = {
            total: 1,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50],
            loading: false,
            buttons: null,
            showPageList: true,
            showRefresh: true,

            onSelectPage: function (pageNumber, pageSize) { },
            onBeforeRefresh: function (pageNumber, pageSize) { },
            onRefresh: function (pageNumber, pageSize) { },
            onChangePageSize: function (pageSize) { },

            beforePageText: 'Page',
            afterPageText: 'of {pages}',
            displayMsg: 'Displaying {from} to {to} of {total} items'
        };

        return this.each(function () {
            var opts;
            var state = $.data(this, 'pagination');
            if (state) {
                opts = $.extend(state.options, options);
            } else {
                opts = $.extend({}, Defaults, options);
                $.data(this, 'pagination', {
                    options: opts
                });
            }

            buildToolbar(this);
            showInfo(this);

        });
    };
})();