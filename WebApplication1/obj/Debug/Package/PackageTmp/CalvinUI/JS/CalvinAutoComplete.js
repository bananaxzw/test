﻿/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../../JsLib/json2.js" />


/********************************************************************************************
* 文件名称:	CalvinAutoComplete.js
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	AutoComplete
* 注意事项：如果变量前面有带$表示的是JQ对象
*
********************************************************************************************/


(function () {
    var opts;
    var styleHelper = {
        /**
        * @description  设置选项移动上去的样式
        * @param {itemsContainer} item的容器元素 也就是ul
        * @param {item} item的元素 也就是li
        */
        SetItemHover: function ($item) {
            $item.addClass("ui-menu-itemHover");
        },


        /**
        * @description  移除item的选中样式
        * @param {itemsContainer} item的容器元素 也就是ul
        */
        RemoveItemHoverStyle: function ($itemsContainer) {
            $(">li", $itemsContainer).removeClass("ui-menu-itemHover");
        },
        /**
        * @description  获取产生自动补全效果的textbox的位置和宽高信息
        * @param {textBox} textbox DOM元素
        */
        GetTextBoxStyle: function (textBox) {
            var $textBox = $(textBox);
            var styleInfo;
            if (styleInfo = $textBox.data("styleInfo")) {
                return styleInfo;
            }
            var offset = $textBox.offset();
            styleInfo = { left: offset.left, top: offset.top, width: $textBox.width(), height: $textBox.outerHeight() };

            $textBox.data("styleInfo", styleInfo);
            return styleInfo;

        }


    };

    var MenuItemHelper =
    {


        GenrateMenuItems: function (textBox, height, width, top, left) {
            var $loading = GenerateLoading(textBox);
            $loading.show();
            var key = textBox.value;
            var params = JSON.stringify($.extend({ "key": key }, opts.ajaxOption.extendData));
            if (opts.dynamicSource) {
                var xmlhttp = $.ajax({
                    type: "POST",
                    url: opts.ajaxOption.url,
                    contentType: "application/json",
                    dataType: "json",
                    data: params,
                    success: function (data) {
                        opts.source = data;
                        var $items = MenuItemHelper._GenrateMenuItems(textBox, otherHelper.FilterOptionSouces(textBox.value), height, width, top, left);
                        $loading.hide();
                        return $items;
                    },
                    error: function (xhr) {
                        $loading.hide();
                        return null;
                    }
                });


            }
            else {
                var $items = MenuItemHelper._GenrateMenuItems(textBox, otherHelper.FilterOptionSouces(textBox.value), height, width, top, left);
                $loading.hide();
                return $items;
            }


        },
        /**
        * @description 生成自动补全菜单
        * @param {textBox} textBox元素
        * @param {SouceArray} 数组元素[{text:'',value:''}]或者["fsa","safsafs"]
        * @param  {height } 产生自动补全的textbox的高度
        * @param  {width } 产生自动补全的textbox的宽度
        * @param  {top } 产生自动补全的textbox的top属性
        * @param  {left } 产生自动补全的textbox的left属性
        */
        _GenrateMenuItems: function (textBox, SouceArray, height, width, top, left) {
            MenuItemHelper.RemoveMenuItems(textBox);
            if (SouceArray == null || !SouceArray.length) return;
            var $ItemsContainer = $("<ul class='ui-autocomplete ui-menu'></ul>");
            //遍历产生item源数组
            $.each(SouceArray, function (i, d) {
                var $MenuItem = $("<li class='ui-menu-item'></li>");

                var $MenuItemText = $("<a></a>");
                if ($.isPlainObject(d)) {
                    $MenuItem.data("MenuItem.Data", { "text": d.text, "value": d.value, "Selected": false });
                    $MenuItemText.append(d.text);
                }
                else {
                    $MenuItem.data("MenuItem.Data", { "text": d, "value": "", "Selected": false });
                    $MenuItemText.append(d);
                }
                $MenuItem.append($MenuItemText);
                $ItemsContainer.append($MenuItem);
                //设置item属性移动上去的样式
                $MenuItem.mouseover(function () {
                    styleHelper.RemoveItemHoverStyle($ItemsContainer);
                    styleHelper.SetItemHover($MenuItem);
                });
                //绑定点击事件
                eventHelper.SetItemClickEvent($MenuItem, $(textBox));

            });
            //设置只能提示选项的位置
            $ItemsContainer.css({ "left": left + "px", "width": width + "px", "top": (top + height) + "px" });
            $ItemsContainer.appendTo("body");
            $(textBox).data("CalvinAutoComplete.data").ItemsContainer = $ItemsContainer;
            return $ItemsContainer;
        },
        /**
        * @description 移除自动补全菜单
        * @param {textBox} textBox元素
        **/
        RemoveMenuItems: function (textBox) {
            var $this = $(textBox);
            if ($this.data("CalvinAutoComplete.data")) {
                data = $this.data("CalvinAutoComplete.data");
                if (data.ItemsContainer) {
                    data.ItemsContainer.remove();
                    $this.data("CalvinAutoComplete.data").ItemsContainer = null;
                }

            }

        },
        /**
        * @description 获取选中的元素
        * @param {$itemContainer} textBox元素
        * @return 返回选中元素的jq对象
        */
        getSelectedItem: function ($itemContainer) {
            var $SelectedItem = $(">li.ui-menu-itemHover", $itemContainer[0]);
            if ($SelectedItem.length != 0) {
                return $SelectedItem.eq(0);
            }
            return null;
        }
    };

    var eventHelper = {
        /**
        * @description  绑定textbox事件 包括键盘上下键和键盘输入字符事件
        * @param {textBox} textbox元素
        */
        SetTextBoxKeyUpDownEvent: function (textBox) {
            var $this = $(textBox);
            //首先取消绑定事件
            $this.unbind("keydown");
            $this.unbind("keyup");
            //这里keydown主要是为了捕获键盘上下键选择事件
            $this.keydown(function (event) {
                var data = $this.data("CalvinAutoComplete.data");
                if (data == null || data.ItemsContainer == null) return;

                var $itemContainer = data.ItemsContainer;
                var $items = $(">li", $itemContainer[0]);
                var itemsCount = $items.length;
                var $SelectedItem = $(">li.ui-menu-itemHover", $itemContainer[0]);
                var SelectIndex = $items.index($SelectedItem[0]);
                switch (event.keyCode) {
                    //向上                                                                                                                    
                    case 38:
                        styleHelper.RemoveItemHoverStyle($itemContainer);

                        if (SelectIndex != 0) {
                            $SelectedItem.prev().addClass("ui-menu-itemHover");
                        }
                        break;
                    //向下                                                                                                                 
                    case 40:
                        styleHelper.RemoveItemHoverStyle($itemContainer);
                        //没有选中的项
                        if ($SelectedItem.length == 0) {
                            $items.eq(0).addClass("ui-menu-itemHover");
                        }
                        else if (SelectIndex == itemsCount - 1) {
                            $items.eq(0).addClass("ui-menu-itemHover");
                        }
                        else {
                            $SelectedItem.next().addClass("ui-menu-itemHover");
                        }
                        break;
                    default:
                        break;
                }
                var $newSelectedItem = $(">li.ui-menu-itemHover", $itemContainer[0]).eq(0);
                if ($newSelectedItem.length != 0) {
                    $this.val($newSelectedItem.data("MenuItem.Data").text);
                }

            });

            $this.bind("keyup", function (event) {
                var StyleInfo = styleHelper.GetTextBoxStyle(textBox);
                var data = $this.data("CalvinAutoComplete.data");
                switch (event.keyCode) {
                    case 38:
                        break;
                    case 40:
                        break;
                    case 13: //回车键
                        var $SelectedItem = MenuItemHelper.getSelectedItem(data.ItemsContainer);
                        if ($SelectedItem != null) {
                            var ItemData = $SelectedItem.data("MenuItem.Data");
                            $SelectedItem.trigger("selected", [ItemData]);
                        }
                        MenuItemHelper.RemoveMenuItems(textBox);
                        break;
                    //删除键                                                       
                    case 8:
                        var minLength = opts.min;
                        if ($this.val().length >= minLength) {
                            MenuItemHelper.GenrateMenuItems(this, StyleInfo.height, StyleInfo.width, StyleInfo.top, StyleInfo.left);

                        }
                        else {
                            MenuItemHelper.RemoveMenuItems(this);
                        }
                        break;
                    default:

                        var minLength = opts.min;
                        if ($this.val().length >= minLength) {
                            MenuItemHelper.GenrateMenuItems(this, StyleInfo.height, StyleInfo.width, StyleInfo.top, StyleInfo.left);

                        }
                        break;
                }
            });

        },
        /**
        * @description  设置item（li元素）的点击事件
        * @param {$MenuItem} 选项元素
        *@param {$textBox} textbox元素
        */
        SetItemClickEvent: function ($MenuItem, $textBox) {
            var ItemData = $MenuItem.data("MenuItem.Data");
            $MenuItem.bind("selected", opts.selected);
            //设置item点击的事件 默认事件自动填写text框
            $MenuItem.bind("click", function () {
                $textBox.val(ItemData.text);
                $MenuItem.trigger("selected", [ItemData]);
                $MenuItem.parent().hide();
                ItemData.Selected = true;

            });
        }


    };
    function GenerateLoading(target) {
        if ($(target).data("CalvinAutoCompleteLoading")) {
            return $(target).data("CalvinAutoCompleteLoading");

        }
        else {
            var $LoadingHtml = $("<div id='CalvinAutoCompleteLoading' class='autoCompleteLoading'></div>");
            var styleInfo = styleHelper.GetTextBoxStyle(target);
            $LoadingHtml.css({ "left": styleInfo.left + "px", "width": styleInfo.width + "px", "top": (styleInfo.top + styleInfo.height) + "px" });
            $LoadingHtml.appendTo("body");
            $(target).data("CalvinAutoCompleteLoading", $LoadingHtml);
            return $LoadingHtml;
        }

    }
    var otherHelper = {

        /**
        * @description 根据指定的key 过滤options.sources数组 以便再生成菜单
        * @param {Key} 值
        **/
        FilterOptionSouces: function (Key) {
            if (opts.source == null || opts.source.length == 0)
                return null;
            var fileterArray = new Array();

            $.each(opts.source, function (t, d) {
                if ($.isPlainObject(d)) {
                    var reg = new RegExp(".*" + Key + ".*", "g");
                    if (reg.test(d.text)) {
                        fileterArray.push(d);
                    }
                }
                else {
                    var reg = new RegExp(".*" + Key + ".*", "g");
                    if (reg.test(d)) {
                        fileterArray.push(d);
                    }
                }
            });
            return fileterArray;
        },
        /**
        * @description 获取补全
        * @param  {key } 获取产生下拉菜单的数组 如果是静态数据就返回options.source 
        *                如果是动态数据 则采用文本框的key然后 ajax取数据 采用同步的方式
        */
        GetSource: function (key) {
            var data = JSON.stringify($.extend({ "key": key }, opts.ajaxOption.extendData));
            if (opts.dynamicSource) {
                var xmlhttp = $.ajax({
                    type: "POST",
                    url: opts.ajaxOption.url,
                    contentType: "application/json",
                    dataType: "json",
                    data: data,
                    async: false
                });
                var returnData = JSON.parse(xmlhttp.responseText);
                opts.source = returnData;
            }
            return opts.source;
        }
    };

    var defaults = { min: 1, source: [], selected: function (event, item) { }, dynamicSource: false, ajaxOption: { url: "", extendData: {}} };

    $.fn.CalvinAutoComplete = function (options, param) {
        return this.each(function () {
            var $this = $(this);
            var state = $.data(this, 'panel');
            if (state) {
                // htmlHelper.destroy(this);
                opts = $.extend(state.options, options);
                state.options = opts;
            }
            else {
                opts = $.extend(defaults, options);
                $this.data("CalvinAutoComplete.data", { options: opts, ItemsContainer: null });
                //移除现有的Items元素
                MenuItemHelper.RemoveMenuItems(this);
                eventHelper.SetTextBoxKeyUpDownEvent(this);
                $(document).click(function () {
                    MenuItemHelper.RemoveMenuItems($this[0]);
                });
            }
        });
    };
})();