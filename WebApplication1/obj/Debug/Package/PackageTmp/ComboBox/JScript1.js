/// <reference path="../jquery-1.4.1-vsdoc.js" />

/********************************************************************************************
* 文件名称:	CalvinComboBox.js
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	CalvinComboBox
* 注意事项：如果变量前面有带$表示的是JQ对象
*
********************************************************************************************/


(function () {

    var MenuItemHelper =
    {
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
    $.fn.CalvinCombobox = function (options, param) {
        var defaults = { min: 1, source: [], selected: function (event, item) { } };
        var options = $.extend(defaults, options);
        /**
        * @description 生成自动补全菜单
        * @param {textBox} textBox元素
        * @param {SouceArray} 数组元素[{text:'',value:''}]或者["fsa","safsafs"]
        * @param  {height } 产生自动补全的textbox的高度
        * @param  {width } 产生自动补全的textbox的宽度
        * @param  {top } 产生自动补全的textbox的top属性
        * @param  {left } 产生自动补全的textbox的left属性
        */
        function GenrateMenuItems(textBox, SouceArray, height, width, top, left) {
            if (!SouceArray.length) return;
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
                    RemoveItemHoverStyle($ItemsContainer);
                    SetItemHover($MenuItem);
                });
                //绑定点击事件
                SetItemClickEvent($MenuItem, $(textBox));

            });
            //设置只能提示选项的位置
            $ItemsContainer.css({ "left": left + "px", "width": width + "px", "top": (top + height) + "px" });
            $ItemsContainer.appendTo("body");
            return $ItemsContainer
        }

        /**
        * @description 生成下拉菜单按钮并和textbox包裹
        * @param {textBox} textBox元素
        */
        function WrapTextBox(textbox) {
            var $ContainerSpan = $("<span class='combo'></span>");
            var $textbox = $(textbox);
            $textbox.addClass("combo-text");
            var $dropdownIcon = $("<span><span class='combo-arrow'></span></span>")
            $ContainerSpan.append($textbox);
            $ContainerSpan.append($dropdownIcon);
            return $ContainerSpan;
        }


        /**
        * @description 移除自动补全菜单
        * @param {textBox} textBox元素
        **/
        function RemoveMenuItems(textBox) {
            var $this = $(textBox);
            if ($this.data("CalvinAutoComplete.data")) {
                data = $this.data("CalvinAutoComplete.data");
                if (data.ItemsContainer) {
                    data.ItemsContainer.remove();
                }
                $this.data("CalvinAutoComplete.data", { ItemsContainer: null });
            }
        }

        /**
        * @description 根据指定的key 过滤options.sources数组 以便再生成菜单
        * @param {Key} 值
        **/
        function FilterOptionSouces(Key) {
            var fileterArray = new Array();
            $.each(options.source, function (t, d) {
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
        }


        /**
        * @description  设置选项移动上去的样式
        * @param {itemsContainer} item的容器元素 也就是ul
        * @param {item} item的元素 也就是li
        */
        function SetItemHover($item) {
            $item.addClass("ui-menu-itemHover");
        }


        /**
        * @description  移除item的选中样式
        * @param {itemsContainer} item的容器元素 也就是ul
        */
        function RemoveItemHoverStyle($itemsContainer) {
            $(">li", $itemsContainer).removeClass("ui-menu-itemHover");
        }


        /**
        * @description  设置item（li元素）的点击事件
        * @param {$MenuItem} 选项元素
        *@param {$textBox} textbox元素
        */
        function SetItemClickEvent($MenuItem, $textBox) {
            var ItemData = $MenuItem.data("MenuItem.Data");
            $MenuItem.bind("selected", options.selected);
            //设置item点击的事件 默认事件自动填写text框
            $MenuItem.bind("click", function () {
                $textBox.val(ItemData.text);
                $MenuItem.trigger("selected", [ItemData]);
                $MenuItem.parent().hide();
                ItemData.Selected = true;

            });
        }
        /**
        * @description  设置textbox的键盘事件
        * @param {textBox} textbox元素
        */
        function SetTextBoxKeyUpDownEvent(textBox) {
            var $this = $(textBox);

            $this.unbind("keydown");
            $this.unbind("keyup");

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
                        RemoveItemHoverStyle($itemContainer);

                        if (SelectIndex != 0) {
                            $SelectedItem.prev().addClass("ui-menu-itemHover");
                        }
                        break;
                    //向下                                                        
                    case 40:
                        RemoveItemHoverStyle($itemContainer);
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
                var StyleInfo = GetTextBoxStyle(textBox);
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
                        RemoveMenuItems(textBox);


                        break;
                    default:
                        RemoveMenuItems(textBox);
                        var minLength = options.min;
                        if ($this.val().length >= minLength) {
                            var $MenuItems = GenrateMenuItems(this, FilterOptionSouces($this.val()), StyleInfo.height, StyleInfo.width, StyleInfo.top, StyleInfo.left);
                            $this.data("CalvinAutoComplete.data", { ItemsContainer: $MenuItems });
                        }
                        break;
                }
            });

        }


        /**
        * @description  获取产生自动补全效果的textbox的位置和宽高信息
        * @param {textBox} textbox DOM元素
        */
        function GetTextBoxStyle(textBox) {
            var $textBox = $(textBox);
            var offset = $textBox.offset();
            return { left: offset.left, top: offset.top, width: $textBox.width(), height: $textBox.outerHeight() };
        }


        return this.each(function () {
            var $this = $(this);
            //移除现有的Items元素
            RemoveMenuItems(this);
            SetTextBoxKeyUpDownEvent(this);
        });
    };
})();