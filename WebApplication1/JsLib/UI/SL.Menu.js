/// <reference path="../sl.js" />

(function () {
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

    function menu(elem, options, param) {
        this.elem = elem;
        var $elem = $(elem), state = $elem.data("menu"), _this = this;
        if (state) {
            opts = sl.extend(state.options, options);
            state.options = opts;
        }
        else {

            opts = sl.extend(defaults, options);
            $elem.data("menu", { options: opts });
        }
        this.InitMenu(elem);
        //点击文档别的位置按钮消失

        $(document).bind('click', function () { _this.hideAllMenu($(elem)); });
    }
    menu.prototype = {
        InitMenu: function (elem) {
            var $target = $(elem);
            var data = sl.data(elem, "menu").options;
            this.buildTopMenu(elem, data);
            if (!data.autoOpen) {
                $target.hide();
            }
        },
        bindSubMenu: function (menuData, target) {
            var $subMenu = $("<div class='menu'></div>");
            $subMenu.css("z-index", opts.zIndex++);
            for (var i = 0, j = menuData.length; i < j; i++) {
                var itemData = menuData[i];
                var MenuItem = this.bindMenuItem($subMenu, itemData, target);
                if (itemData.sub) {
                    var $newSubMenu = arguments.callee.call(this, itemData.sub, target);
                    MenuItem.$subMenu = $newSubMenu;
                }
            }
            $subMenu.hide();
            $subMenu.css({ width: "140px" });
            $subMenu.appendTo("body");
            return $subMenu;
        },
        buildTopMenu: function (target, data) {
            var menuData = data.menuData;
            var $target = $(target);
            $target.addClass('menu-top').addClass("menu"); // the top menu
            $target.css({ "z-index": data.zIndex++, "left": data.left, "top": data.top });
            for (var i = 0, j = menuData.length; i < j; i++) {
                var itemData = menuData[i];
                var MenuItem = this.bindMenuItem($target, itemData, target);
                if (itemData.sub) {
                    var $subMenu = this.bindSubMenu(itemData.sub, target);
                    MenuItem.$subMenu = $subMenu;
                }
            }
            $target.css({ width: "140px" });
            $target.appendTo("body");
            data.onShow.call(target);
        },
        bindMenuItem: function ($menu, itemData, target) {

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
                this.bindMenuItemEvent($item.elements[0], target);
                //console.log("菜单项宽度"+$item.width());
                return $item.elements[0];
            }


        },
        showMenu: function ($menu, pos) {
            if (!$menu) return;
            if (pos) {
                $menu.css(pos);
            }
            $menu.show();

        },
        hideMenu: function ($menu) {
            var _this = this;
            if (!$menu) return;
            $menu.hide();
            $menu.find('div.menu-item').each(function () {
                if (this.$subMenu) {
                    _this.hideMenu(this.$subMenu);
                }
                $(this).removeClass('menu-active');
            });
        },
        hideAllMenu: function ($target) {
            var data = $target.data("menu");
            // var pts = $.data(target, 'menu').options;
            this.hideMenu($target);
            if (data.onHide) {
                data.onHide.call($target.elements[0]);
            }
            //  $(document).unbind('.menu');
            return false;
        },
        bindMenuItemEvent: function (menuItem, target) {
            this.howerEvent(menuItem, target);
            this.clickEvent(menuItem, target);

        },
        howerEvent: function (menuItem, target) {
            var _this = this;
            var $menuItem = $(menuItem);
            $menuItem.hover(
             function () {
                 //隐藏同级元素的菜单
                 $menuItem.siblings().each(function () {
                     if (this.$subMenu) {
                         _this.hideMenu(this.$subMenu);
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

                     var pos = { left: left + "px", top: itemPos.top + 3 + "px" };
                     _this.showMenu(menuItem.$subMenu, pos);

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
                         _this.hideMenu($submenu);
                     }

                 } else {
                     $menuItem.removeClass('menu-active');
                 }

             }
             );

        },
        clickEvent: function (menuItem, target) {
            var _this = this;
            var $menuItem = $(menuItem);
            $menuItem.click(function (e) {
                var itemData = $menuItem.data("itemData");
                if (itemData.selected && itemData.click) {
                    itemData.click.call(menuItem, itemData.text, itemData.value);
                };
                _this.hideAllMenu($(target));
                e.stopPropagation();

            });

        },
        bindMenuEvent: function (menu, target) {

        }

    };
    menu.prototype.manualFunction = function (options, param) {
        if (typeof options === "string") {
            if (!sl.data(this.elem, "menu")) {
                alert("请先创建菜单！");
                return;
            }
            switch (options.toUpperCase()) {
                case "SHOW":
                    this.hideAllMenu($(this.elem));
                    return this.showMenu($(this.elem), param);
                default:
                    return;

            }
        }
    };

    window.menu = menu;
})();