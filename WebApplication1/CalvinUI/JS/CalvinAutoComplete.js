/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../../JsLib/json2.js" />


/********************************************************************************************
* 文件名称:	CalvinComboBox.js
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	CalvinComboBox
* 注意事项：如果变量前面有带$表示的是JQ对象
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*
********************************************************************************************/

/// <reference path="CalvinTimeDelayMaker.js" />
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
    var styleHelper = {
        SetItemHover: function ($item) {
            $item.addClass("ui-menu-itemHover")
        },
        RemoveItemHoverStyle: function ($itemsContainer) {
            $(">li", $itemsContainer).removeClass("ui-menu-itemHover")
        },
        GetTextBoxStyle: function (textBox) {
            var $textBox = $(textBox),
				offset = $textBox.offset(),
				opts = $.data(textBox, 'CalvinAutoComplete.data').options,
				styleInfo;
            if (!opts.dynamicStyle) {
                if (styleInfo = $textBox.data("styleInfo")) {
                    return styleInfo
                }
            }
            styleInfo = {
                left: offset.left,
                top: offset.top,
                width: $textBox.width(),
                height: $textBox.outerHeight()
            };
            $textBox.data("styleInfo", styleInfo);
            return styleInfo
        }
    };
    var MenuItemHelper = {
        GenrateMenuItems: function (textBox, height, width, top, left) {
            var opts = $.data(textBox, 'CalvinAutoComplete.data').options;
            var $loading = GenerateLoading(textBox);
            $loading.show();
            var key = textBox.value;
            if (opts.dynamicSource) {
                var xmlhttp = $.ajax({
                    type: "POST",
                    url: opts.ajaxOption.url,
                    contentType: "application/json",
                    dataType: "json",
                    data: '{"key":"' + key + '"}',
                    success: function (data) {
                        opts.source = data.length ? data : data.d;
                        var $items = MenuItemHelper._GenrateMenuItems(textBox, otherHelper.FilterOptionSouces(opts, textBox.value), height, width, top, left);
                        $loading.hide();
                        return $items
                    },
                    error: function (xhr) {
                        if (opts.ajaxOption.error) {
                            opts.ajaxOption.error.call(this, xhr, $loading)
                        }
                        $loading.hide();
                        return null
                    }
                })
            } else {
                var $items = MenuItemHelper._GenrateMenuItems(textBox, otherHelper.FilterOptionSouces(opts, textBox.value), height, width, top, left);
                $loading.hide();
                return $items
            }
        },
        _GenrateMenuItems: function (textBox, SouceArray, height, width, top, left) {
            var opts = $.data(textBox, 'CalvinAutoComplete.data').options;
            MenuItemHelper.RemoveMenuItems(textBox);
            if (SouceArray == null || !SouceArray.length) return;
            var iframeLayer = $('<iframe style="position:absolute; z-index:-1;border:none;margin:0;padding:0;width:100%;top:0;left:0;" src="about:blank"></iframe>').css("opacity", 0);
            var $ItemsContainer = $("<ul class='ui-autocomplete ui-menu'></ul>");
            $.each(SouceArray, function (i, d) {
                var $MenuItem = $("<li class='ui-menu-item'></li>");
                var $MenuItemText = $("<a></a>");
                if ($.isPlainObject(d)) {
                    $MenuItem.data("MenuItem.Data", {
                        "text": d.text,
                        "value": d.value,
                        "Selected": false
                    });
                    $MenuItemText.append(d.text)
                } else {
                    $MenuItem.data("MenuItem.Data", {
                        "text": d,
                        "value": "",
                        "Selected": false
                    });
                    $MenuItemText.append(d)
                }
                $MenuItem.append($MenuItemText);
                $ItemsContainer.append($MenuItem);
                $MenuItem.mouseover(function () {
                    styleHelper.RemoveItemHoverStyle($ItemsContainer);
                    styleHelper.SetItemHover($MenuItem)
                });
                eventHelper.SetItemClickEvent($MenuItem, $(textBox))
            });
            $ItemsContainer.css({
                "left": left + "px",
                "width": width + "px",
                "top": (top + height) + "px"
            });
            if (opts.styleInfo) {
                $ItemsContainer.css(opts.styleInfo);
            };

            $ItemsContainer.appendTo("body");
            iframeLayer.height($ItemsContainer.height());
            $ItemsContainer.append(iframeLayer);
            $(textBox).data("CalvinAutoComplete.data").ItemsContainer = $ItemsContainer;
            return $ItemsContainer
        },
        RemoveMenuItems: function (textBox) {
            var $this = $(textBox);
            if ($this.data("CalvinAutoComplete.data")) {
                data = $this.data("CalvinAutoComplete.data");
                if (data.ItemsContainer) {
                    data.ItemsContainer.remove();
                    $this.data("CalvinAutoComplete.data").ItemsContainer = null
                }
            }
        },
        getSelectedItem: function ($itemContainer) {
            if (!$itemContainer) return;
            var $SelectedItem = $(">li.ui-menu-itemHover", $itemContainer[0]);
            if ($SelectedItem.length != 0) {
                return $SelectedItem.eq(0)
            }
            return null
        }
    };
    var eventHelper = {
        SetTextBoxKeyUpDownEvent: function (textBox) {
            var $this = $(textBox);
            var opts = $.data(textBox, 'CalvinAutoComplete.data').options;
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
                    case 38:
                        styleHelper.RemoveItemHoverStyle($itemContainer);
                        if (SelectIndex != 0) {
                            $SelectedItem.prev().addClass("ui-menu-itemHover")
                        }
                        break;
                    case 40:
                        styleHelper.RemoveItemHoverStyle($itemContainer);
                        if ($SelectedItem.length == 0) {
                            $items.eq(0).addClass("ui-menu-itemHover")
                        } else if (SelectIndex == itemsCount - 1) {
                            $items.eq(0).addClass("ui-menu-itemHover")
                        } else {
                            $SelectedItem.next().addClass("ui-menu-itemHover")
                        }
                        break;
                    default:
                        break
                }
                var $newSelectedItem = $(">li.ui-menu-itemHover", $itemContainer[0]).eq(0);
                if ($newSelectedItem.length != 0) {
                    $this.val($newSelectedItem.data("MenuItem.Data").text)
                }
            });
            $this.bind("keyup", CalvinTimeDelayMaker.debounce(100, function (event) {
                var StyleInfo = styleHelper.GetTextBoxStyle(textBox);
                var data = $this.data("CalvinAutoComplete.data");
                switch (event.keyCode) {
                    case 38:
                        break;
                    case 40:
                        break;
                    case 13:
                        var $SelectedItem = MenuItemHelper.getSelectedItem(data.ItemsContainer);
                        if ($SelectedItem != null) {
                            var ItemData = $SelectedItem.data("MenuItem.Data");
                            $SelectedItem.trigger("selected", [ItemData])
                        }
                        MenuItemHelper.RemoveMenuItems(textBox);
                        break;
                    case 8:
                        var minLength = opts.min;
                        if ($this.val().length >= minLength) {
                            MenuItemHelper.GenrateMenuItems(this, StyleInfo.height, StyleInfo.width, StyleInfo.top, StyleInfo.left)
                        } else {
                            MenuItemHelper.RemoveMenuItems(this)
                        }
                        break;
                    default:
                        var minLength = opts.min;
                        if ($this.val().length >= minLength) {
                            MenuItemHelper.GenrateMenuItems(this, StyleInfo.height, StyleInfo.width, StyleInfo.top, StyleInfo.left)
                        }
                        break
                }
            }, false))
        },
        SetItemClickEvent: function ($MenuItem, $textBox) {
            var opts = $textBox.data('CalvinAutoComplete.data').options;
            var ItemData = $MenuItem.data("MenuItem.Data");
            $MenuItem.bind("selected", opts.selected);
            $MenuItem.bind("click", function (e) {
                if (opts.AutoInput) {
                    $textBox.val(ItemData.text)
                }
                $MenuItem.trigger("selected", [ItemData]);
                if (opts.MenuHideAuto) {
                    $MenuItem.parent().hide()
                }
                ItemData.Selected = true;
                e.stopPropagation()
            })
        }
    };

    function GenerateLoading(target) {
        var $loadingHtml;
        if ($(target).data("CalvinAutoCompleteLoading")) {
            $loadingHtml = $(target).data("CalvinAutoCompleteLoading")
        } else {
            $loadingHtml = $("<div id='CalvinAutoCompleteLoading' class='autoCompleteLoading'></div>");
            $loadingHtml.appendTo("body");
            $(target).data("CalvinAutoCompleteLoading", $loadingHtml)
        }
        $loadingHtml.html("");
        var styleInfo = styleHelper.GetTextBoxStyle(target);
        $loadingHtml.css({
            "left": styleInfo.left + "px",
            "width": styleInfo.width + "px",
            "top": (styleInfo.top + styleInfo.height) + "px"
        });
        return $loadingHtml
    };
    var otherHelper = {
        FilterOptionSouces: function (opts, Key) {
            if (opts.source == null || opts.source.length == 0) return null;
            if (opts.dynamicSource) return opts.source;
            var fileterArray = new Array();
            $.each(opts.source, function (t, d) {
                if ($.isPlainObject(d)) {
                    var reg = new RegExp(".*" + Key + ".*", "g");
                    if (reg.test(d.text)) {
                        fileterArray.push(d)
                    }
                } else {
                    var reg = new RegExp(".*" + Key + ".*", "g");
                    if (reg.test(d)) {
                        fileterArray.push(d)
                    }
                }
            });
            return fileterArray
        },
        GetSource: function (opts, key) {
            var data = JSON.stringify($.extend({
                "key": key
            }, opts.ajaxOption.extendData));
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
                opts.source = returnData
            }
            return opts.source
        }
    };
    var defaults = {
        min: 1,
        source: [],
        selected: function (event, item) { },
        dynamicSource: false,
        ajaxOption: {
            url: "",
            extendData: {},
            error: function () { }
        },
        AutoInput: true,
        MenuHideAuto: true
    };
    $.fn.CalvinAutoComplete = function (options, param) {
        return this.each(function () {
            var opts = {};
            var $this = $(this);
            var state = $.data(this, 'CalvinAutoComplete.data');
            if (state) {
                $.extend(opts, state.options, options);
                state.options = opts
            } else {
                $.extend(opts, defaults, options);
                $this.data("CalvinAutoComplete.data", {
                    options: opts,
                    ItemsContainer: null
                });
                MenuItemHelper.RemoveMenuItems(this);
                eventHelper.SetTextBoxKeyUpDownEvent(this);
                $(document).click(function () {
                    MenuItemHelper.RemoveMenuItems($this[0])
                })
            }
        })
    }
})();