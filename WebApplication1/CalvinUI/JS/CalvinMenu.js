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
    $.fn.menu = function (options, param) {
        var opts;

        var defaults = {
            zIndex: 110000,
            left: 0,
            top: 0,
            onShow: function () { },
            onHide: function () { },
            menuData: [],
            width: 140,
            autoOpen: false
        };

        function InitMenu(target) {
            var $target = $(target);
            var data = $.data(target, "menu");
            buildTopMenu(target, data);
            if (!data.autoOpen) {
                $target.hide();
            }
        };
        function buildTopMenu(target, data) {
            var menuData = data.menuData;
            var $target = $(target);
            $target.addClass('menu-top').addClass("menu"); // the top menu
            $target.css({ "z-index": opts.zIndex++, "keft": data.left, "top": data.top });
            for (var i = 0, j = menuData.length; i < j; i++) {
                var itemData = menuData[i];
                var MenuItem = bindMenuItem($target, itemData, target);
                if (itemData.sub) {
                    var $subMenu = bindSubMenu(itemData.sub, target);
                    MenuItem.$subMenu = $subMenu;
                }
            }
            $target.width(140);
            $target.appendTo("body");
            data.onShow.call(target);
        };
        function bindSubMenu(menuData, target) {

            var $subMenu = $("<div class='menu'></div>");
            $subMenu.css("z-index", opts.zIndex++);
            for (var i = 0, j = menuData.length; i < j; i++) {
                var itemData = menuData[i];
                var MenuItem = bindMenuItem($subMenu, itemData, target);
                if (itemData.sub) {
                    var $newSubMenu = arguments.callee(itemData.sub, target);
                    MenuItem.$subMenu = $newSubMenu;
                }
            }
            $subMenu.hide();
            $subMenu.width(140);
            $subMenu.appendTo("body");
            return $subMenu;
        };
        function bindMenuItem($menu, itemData, target) {
            if (itemData.line) {
                $menu.append("<div class='menu-sep'>&nbsp;</div>");
                return null;
            }
            else {
                var text = itemData.text, click = itemData.click, value = itemData.value, $item = $("<div style='height: 20px;' class='menu-item'> <div class='menu-text'>" + text + "</div></div>");

                //是否可以选择
                var selected = itemData.selected || itemData.click ? true : false || itemData.sub ? false : true;

                $item.data("itemData", { "text": text, "value": value, "click": click, "selected": selected });
                if (itemData.ico) {
                    $item.append("<div class='menu-icon " + itemData.ico + "'/>");
                }
                if (itemData.sub) {
                    $item.append("<div class='menu-rightarrow'/>");

                }
                $menu.append($item);
                eventHelper.bindMenuItemEvent($item[0], target);
                //console.log("菜单项宽度"+$item.width());
                return $item[0];
            }


        };
        var eventHelper = {
            bindMenuItemEvent: function (menuItem, target) {
                eventHelper.howerEvent(menuItem, target);
                eventHelper.clickEvent(menuItem, target);

            },
            howerEvent: function (menuItem, target) {
                var $menuItem = $(menuItem);
                $menuItem.hover(
             function () {
                 //隐藏同级元素的菜单
                 $menuItem.siblings().each(function () {
                     if (this.$subMenu) {
                         hideMenu(this.$subMenu);
                     }
                     $(this).removeClass('menu-active');
                 });

                 //激活样式
                 $menuItem.addClass("menu-active");
                 if (menuItem.$subMenu) {
                     var $subMenu = menuItem.$subMenu;
                     var itemPos = $menuItem.offset();
                     var left = itemPos.left + $menuItem.outerWidth() - 2;
                     //超过文档宽度 
                     if (left + $subMenu.outerWidth() > $(window).width()) {
                         left = itemPos.left - $subMenu.outerWidth() + 2;
                     }

                     var pos = { left: left, top: itemPos.top + 3 };
                     showMenu(menuItem.$subMenu, pos);

                 }
             },
             function (e) {
                 $menuItem.removeClass("menu-active");
                 var $submenu = menuItem.$subMenu;
                 if ($submenu) {
                     if (e.pageX >= parseInt($submenu.css('left'))) {
                         $menuItem.addClass('menu-active');
                     } else {
                         //hideAllMenu(target);
                         hideMenu($submenu);
                     }

                 } else {
                     $menuItem.removeClass('menu-active');
                 }

             }
             );

            },
            clickEvent: function (menuItem, target) {

                var $menuItem = $(menuItem);
                $menuItem.click(function (e) {
                    var itemData = $menuItem.data("itemData");
                    if (itemData.selected && itemData.click) {
                        itemData.click.call(menuItem, itemData.text, itemData.value);
                    };
                    hideAllMenu($(target));
                    e.stopPropagation();

                });

            },
            bindMenuEvent: function (menu, target) {

            }
        };
        function showMenu($menu, pos) {
            if (!$menu) return;
            if (pos) {
                $menu.css(pos);
            }
            $menu.show();

        };
        function hideMenu($menu) {
            if (!$menu) return;
            $menu.hide();
            $menu.find('div.menu-item').each(function () {
                if (this.$subMenu) {
                    hideMenu(this.$subMenu);
                }
                $(this).removeClass('menu-active');
            });
        };
        function hideAllMenu($target) {
            var data = $target.data("menu");
            // var pts = $.data(target, 'menu').options;
            hideMenu($target);
            data.onHide.call($target[0]);
            //  $(document).unbind('.menu');
            return false;
        };
        if(typeof options === "string") {
            if (!$.data(this[0], "menu")) {
                alert("请先创建菜单！");
                return;
            }
            switch (options.toUpperCase()) {
                case "SHOW":
                    hideAllMenu($(this));
                    return showMenu($(this), param);
                default:
                    return;

            }
        };
        return this.each(function () {
            var _this = this;
            var $this = $(this);
            var state = $.data(this, 'menu');

            if (state) {
                // htmlHelper.destroy(this);
                opts = $.extend(state.options, options);
                state.options = opts;
            }
            else {

                opts = $.extend(defaults, options);
                $.data(this, "menu", opts);

            }
            InitMenu(this);
            //点击文档别的位置按钮消失

            $(document).bind('click.menu', function () { hideAllMenu($(_this)); });
            //$(document).bind('mouseover.menu', function () { hideAllMenu(_this); });

        });
    };
})();