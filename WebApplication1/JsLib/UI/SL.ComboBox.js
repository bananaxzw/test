/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
var yyyyyy = sl;
(function () {
    var defaults = { min: 1, url: "", height: 200, source: [], selected: function (event, item) { } };
    function CalvinComboBox(elem, options, param) {
        this.options = sl.extend(defaults, options);
        var $this = $(elem), _this = this;
        if (data = $this.data("CalvinAutoComplete.data")) {
            this.clearAll(elem);
            data.ItemsContainer = null, data.TextBoxContainer = null, data.dropdownIcon = null;

        }
        else {
            $this.data("CalvinAutoComplete.data", {});
        }

        this.WrapTextBox(elem);
        this.RemoveMenuItems(elem);
        //移除现有的Items元素
        this.SetTextBoxKeyUpDownEvent(elem);

        $(document).click(function (event) {
            _this.RemoveMenuItems(elem);
        });
    };


    var EventHelper = {
        /**
        * @description  设置item（li元素）的点击事件
        * @param {$MenuItem} 选项元素
        *@param {$textBox} textbox元素
        */
        SetMenuItemClickEvent: function ($MenuItem, $textBox) {

            var ItemData = $MenuItem.data("MenuItem.Data"), _this = this;
            $MenuItem.bind("selected", this.options.selected);
            //设置item点击的事件 默认事件自动填写text框
            $MenuItem.bind("click", function () {
                $textBox.val(ItemData.text);
                $MenuItem.trigger("selected", [ItemData]);
                $MenuItem.parent().hide();
                ItemData.Selected = true;
                _this.RemoveMenuItems($textBox.elements[0]);
            });


        },

        /**
        * @description  设置textbox的键盘事件
        * @param {textBox} textbox元素
        */
        SetTextBoxKeyUpDownEvent: function (textBox) {
            var $this = $(textBox), _this = this;

            $this.unbind("keydown");
            $this.unbind("keyup");

            $this.keydown(function (event) {
                var data = $this.data("CalvinAutoComplete.data");
                var dropDownIconData = data.dropdownIcon.data("AllMenusItems");
                if ((data == null || data.ItemsContainer == null) && (dropDownIconData == null || dropDownIconData.AllMenusItems == null || dropDownIconData.AllMenusItems.is(":hidden"))) return;

                var $itemContainer = data.ItemsContainer || dropDownIconData.AllMenusItems;
                var $items = $(">li", $itemContainer.elements[0]);
                var itemsCount = $items.length;
                var $SelectedItem = $(">li.ui-menu-itemHover", $itemContainer.elements[0]);
                var SelectIndex = $items.index($SelectedItem.elements[0]);
                switch (event.keyCode) {
                    //向上                                                                                                                                                                         
                    case 38:
                        _this.RemoveItemHoverStyle($itemContainer);

                        if (SelectIndex != 0) {
                            $SelectedItem.prev().addClass("ui-menu-itemHover");
                        }
                        _this.ScrollToSelectedItem($itemContainer, _this.options);
                        break;
                    //向下                                                                                                                                                                      
                    case 40:
                        _this.RemoveItemHoverStyle($itemContainer);
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
                        _this.ScrollToSelectedItem($itemContainer, _this.options);
                        break;
                    default:
                        break;
                }
                var $newSelectedItem = $(">li.ui-menu-itemHover", $itemContainer.elements[0]).eq(0);
                if ($newSelectedItem.length != 0) {
                    $this.val($newSelectedItem.data("MenuItem.Data").text);
                }

            });

            $this.bind("keyup", function (event) {
                var $textBoxContainer = $this.data("CalvinAutoComplete.data").TextBoxContainer;
                var StyleInfo = GetElementStyle($textBoxContainer.elements[0]);
                var data = $this.data("CalvinAutoComplete.data");
                var $dropdownIcon = data.dropdownIcon;
                var dropdownIconData = $dropdownIcon.data("AllMenusItems");
                switch (event.keyCode) {
                    case 38:
                        break;
                    case 40:
                        break;
                    case 13: //回车键
                        var $SelectedItem = _this.getSelectedItem(data.ItemsContainer || dropdownIconData.AllMenusItems);
                        if ($SelectedItem != null) {
                            var ItemData = $SelectedItem.data("MenuItem.Data");
                            $SelectedItem.trigger("selected", [ItemData]);
                        }
                        _this.RemoveMenuItems(textBox);


                        break;
                    default:
                        _this.RemoveMenuItems(textBox);
                        if ($dropdownIcon) {
                            $dropdownIcon.data("AllMenusItems").AllMenusItems.hide();
                        }
                        var minLength = _this.options.min;
                        if ($this.val().length >= minLength) {
                            var $MenuItems = _this.GenrateMenuItems(this, _this.FilterOptionSouces($this.val()), StyleInfo.height, StyleInfo.width, StyleInfo.top, StyleInfo.left);
                            $this.data("CalvinAutoComplete.data").ItemsContainer = $MenuItems;
                        }
                        break;
                }
            });

        }

    };
    var MenuItemHelper = {

        /**
        * @description 生成自动补全菜单
        * @param {textBox} textBox元素
        * @param {SouceArray} 数组元素[{text:'',value:''}]或者["fsa","safsafs"]
        * @param  {height } 产生自动补全的textbox的高度
        * @param  {width } 产生自动补全的textbox的宽度
        * @param  {top } 产生自动补全的textbox的top属性
        * @param  {left } 产生自动补全的textbox的left属性
        */
        GenrateMenuItems: function (textBox, SouceArray, height, width, top, left) {
            if (!SouceArray.length) return;
            var $ItemsContainer = $("<ul class='ui-autocomplete ui-menu'></ul>");
            //遍历产生item源数组
            var _this = this;
            sl.each(SouceArray, function (i, d) {
                var $MenuItem = $("<li class='ui-menu-item'></li>");

                var $MenuItemText = $("<a></a>");
                if (sl.InstanceOf.PlainObject(d)) {
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
                    _this.RemoveItemHoverStyle($ItemsContainer);
                    _this.SetItemHover($MenuItem);
                });
                //绑定点击事件
                _this.SetMenuItemClickEvent($MenuItem, $(textBox));

            });

            $ItemsContainer.appendTo("body");
            if ($ItemsContainer.height() <= this.options.height) {
                //设置只能提示选项的位置
                $ItemsContainer.css({ "left": left, "width": width - 4, "top": top + height });
            }
            else {
                $ItemsContainer.css({ "height": this.options.height, "left": left, "width": width - 4, "top": top + height });
            }
            return $ItemsContainer
        },
        /**
        * @description  设置选项移动上去的样式
        * @param {itemsContainer} item的容器元素 也就是ul
        * @param {item} item的元素 也就是li
        */
        SetItemHover: function ($item) {
            $item.addClass("ui-menu-itemHover");
        },

        /**
        * @description 获取选中的元素
        * @param {$itemContainer} textBox元素
        * @return 返回选中元素的jq对象
        */
        getSelectedItem: function ($itemContainer) {
            var $SelectedItem = $(">li.ui-menu-itemHover", $itemContainer.elements[0]);
            if ($SelectedItem.length != 0) {
                return $SelectedItem.eq(0);
            }
            return null;
        },
        /*
        * @description输入框有值时候 打开下拉按钮时候 匹配到第一项选中的
        */
        ScrollToMarchedItem: function (key, $itemContainer, options) {

            var hasMatched = false;
            var height = 0;
            var _this = this;
            $(">li", $itemContainer).each(function (i, d) {
                height += $(d).height();
                if (key === $(d).data("MenuItem.Data").text) {
                    hasMatched = true;
                    _this.SetItemHover($(d));
                    return false;
                }
            });
            if (hasMatched) {
                if (height > _this.options.height) {
                    $itemContainer.scrollTop(height - _this.options.height);
                }
            }
        },
        /*
        * @description移动键盘上下键的时候 滚动到选中的项目
        */
        ScrollToSelectedItem: function ($itemContainer, options) {
            var hasMatched = false, height = 0, _this = this;
            $(">li", $itemContainer).each(function (i, d) {
                height += $(d).height();
                if ($(d).is(".ui-menu-itemHover")) {
                    hasMatched = true;
                    _this.SetItemHover($(d));
                    return false;
                }
            });
            if (hasMatched) {

                if (height > options.height) {
                    $itemContainer.scrollTop(height - options.height);
                }
                else {
                    if ($itemContainer.scrollTop()) {
                        $itemContainer.scrollTop(0);
                    }
                }

            }
        },

        /**
        * @description 移除自动补全菜单 并且隐藏下拉的菜单
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
            var $dropdownIcon = $this.data("CalvinAutoComplete.data").dropdownIcon;
            if ($dropdownIcon && $dropdownIcon.length) {
                $dropdownIcon.data("AllMenusItems").AllMenusItems.hide();
            }
        },

        /**
        * @description  移除item的选中样式
        * @param {itemsContainer} item的容器元素 也就是ul
        */
        RemoveItemHoverStyle: function ($itemsContainer) {
            $(">li", $itemsContainer).removeClass("ui-menu-itemHover");
        },

        clearAll: function (textBox) {

            var $this = $(textBox);
            var data = $this.data("CalvinAutoComplete.data");
            if (data) {
                if (data.dropdownIcon && data.dropdownIcon.data("AllMenusItems") && data.dropdownIcon.data("AllMenusItems").AllMenusItems) {
                    data.dropdownIcon.data("AllMenusItems").AllMenusItems.remove();
                }
                if (data.ItemsContainer) {
                    data.ItemsContainer.remove();
                }
                if (data.TextBoxContainer) {
                    $this.next().remove();
                    $this.unwrap();
                    //data.TextBoxContainer.remove();
                }

            }
        }
    };
    var OtherHelper = {

        /**
        * @description 根据指定的key 过滤options.sources数组 以便再生成菜单
        * @param {Key} 值
        **/
        FilterOptionSouces: function (Key) {
            var fileterArray = new Array();
            sl.each(this.options.source, function (t, d) {
                if (sl.InstanceOf.PlainObject(d)) {
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
    };
    /**
    * @description 生成下拉菜单按钮并和textbox包裹
    * @param {textBox} textBox元素
    */
    function WrapTextBox(textbox) {
        var $textbox = $(textbox), _this = this;
        $textbox.wrap("<span class='combo'></span>");
        var $ContainerSpan = $textbox.parent();
        $textbox.addClass("combo-text");
        var $dropdownIcon = $("<span><span class='combo-arrow'></span></span>");
        $dropdownIcon.data("AllMenusItems", { AllMenusItems: null });
        $textbox.appendTo($ContainerSpan);
        $ContainerSpan.append($dropdownIcon);
        $textbox.data("CalvinAutoComplete.data").TextBoxContainer = $ContainerSpan;
        $textbox.data("CalvinAutoComplete.data").dropdownIcon = $dropdownIcon;
        var StyleInfo = GetElementStyle($ContainerSpan.elements[0]);
        var $ItemsContainerAll = this.GenrateMenuItems(textbox, this.options.source, StyleInfo.height, StyleInfo.width, StyleInfo.top, StyleInfo.left);
        $dropdownIcon.data("AllMenusItems").AllMenusItems = $ItemsContainerAll;
        $ItemsContainerAll.toggle();
        $dropdownIcon.bind("click", function (event) {
            event.cancelBubble = true;
            event.stopPropagation();
            _this.RemoveItemHoverStyle($ItemsContainerAll);
            if ($ItemsContainerAll.is(":hidden")) {
                $ItemsContainerAll.show();
                _this.ScrollToMarchedItem($textbox.val(), $ItemsContainerAll, _this.options);
                textbox.focus();
            }
            else {
                $ItemsContainerAll.hide();
            }
            if ($textbox.data("CalvinAutoComplete.data").ItemsContainer) {
                $textbox.data("CalvinAutoComplete.data").ItemsContainer.hide();

            }
        });
        return $ContainerSpan;
    }
    /**
    * @description  获取产生自动补全效果的textbox的位置和宽高信息
    * @param {textBox} textbox DOM元素
    */
    function GetElementStyle(ele) {
        var $ele = $(ele);
        var offset = $ele.offset();
        return { left: offset.left, top: offset.top, width: $ele.width(), height: $ele.outerHeight() };
    }

    yyyyyy.extend(CalvinComboBox.prototype, EventHelper, MenuItemHelper, OtherHelper, { WrapTextBox: WrapTextBox, GetElementStyle: GetElementStyle });
    window.CalvinComboBox = CalvinComboBox;
})();
