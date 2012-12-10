/********************************************************************************************
* 文件名称:	ZFBZEasySearch.js
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	住房保障快捷搜索菜单
*		
使用方法  $("#ZFBZEasySearch").ZFBZEasySearch({ top: 40, Title: "<span>便<br/>捷<br/>查<br/>询</span>" });
标签结构：<div id='ZFBZEasySearch'><a></a><a></a><a></a></div>
样式参考:CssDefault.css 的便捷搜索注释节点
参数：top:标签距离顶部的距离 Title切换按钮的标题
* 注意事项:	
*
* 版权所有:	Copyright (c) 2011, Fujian SIRC
*
* 修改记录: 	修改时间		人员		修改备注
*				----------		------		-------------------------------------------------
                 9-6 1.修改IE6的样式问题 并把滚动监视时间调大 2.增加移开鼠标时候关闭标签
                 9-7 鼠标移开 清空动画队列
*
********************************************************************************************/

var ZFBZEasySearchHepler = {
    timer: function(jqEle, topVal) {
        jqEle.animate({ top: topVal });
    }
};
(function($) {
    $.fn.ZFBZEasySearch = function(options) {
        /**
        * @description 默认参数
        */
        var defaults =
        {
            top: 20,
            Title: "<span>快<br/>捷<br/>查<br/>询</span>"
        }
        var options = $.extend(defaults, options);
        /**
        * @description 包裹标签
        * @param {JQelement} ItemsContainer要产生便捷搜索效果的容器ID
        */
        function WarpItem(ItemsContainer) {
            var data = $.data(ItemsContainer[0], "EasySearch.data");
            var Title = $(options.Title).wrapAll("<dt id='EasySearchSwitch'></dt>").parent();
            var temp1 = ItemsContainer.wrapAll("<dd  id='EasySearchItems'></dd>").parent();

            var temp2 = temp1.wrapAll("<dl id='EasySearchDrawer'></dl>").parent();
            temp2.append(Title);
            data.SwitchButton = Title;
            data.Items = temp1;
            data.Container = temp2;
            if (temp1.outerWidth() < 100) {
                $(">div", temp1).css("width", "180px");
            }
            data.width = temp1.outerWidth();

        }
        /**
        * @description 打开标签
        * @param {Num}  width 搜索节点容器宽度
        */
        function OpenSwitch(width) {
            $("#EasySearchDrawer").data("IsOpen", true);
            $("#EasySearchDrawer").stop(true).animate({ left: "0px" });


        }
        /**
        * @description 关闭标签
        * @param {Num}  width 搜索节点容器宽度
        */
        function HiddenSwitch(width) {
            $("#EasySearchDrawer").data("IsOpen", false);
            $("#EasySearchDrawer").stop(true).animate({ left: "-" + width + "px" });
        }
        return this.each(function() {
            var $this = $(this);
            this.style.visibility = "hidden";

            $.data(this, "EasySearch.data", {
                Title: options.Title,
                SwitchButton: null,
                Items: null,
                Container: null,
                width: null
            });


            WarpItem($this);
            if ($this.height() < 103) {
                $this.css("height", "103px");
            }
            var data = $.data(this, "EasySearch.data");

            this.style.visibility = "visible";

            data.Container.css({ "top": options.top + "px" });
            setInterval(function() {
                ZFBZEasySearchHepler.timer(data.Container, options.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0));
            }, 1000);

            $("#EasySearchSwitch").click(function() {
                if ($("#EasySearchDrawer").data("IsOpen") || $("#EasySearchDrawer").data("IsOpen") == undefined) {
                    HiddenSwitch(data.width);
                }
                else {
                    OpenSwitch(data.width);
                }
            });
            $("#EasySearchSwitch").trigger("click");
            data.Items.hover(function() {
                OpenSwitch(data.width);
            }, function() {
                HiddenSwitch(data.width);
            });

        });
    }

})(jQuery);