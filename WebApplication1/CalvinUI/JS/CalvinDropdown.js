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


(function () {
    $.fn.CalvinComboBox = function (options, param) {
        var defaults = { height: 200, minHeight: 200, maxHeight: 200, innerItem: "" };
        /**
        * @description 生成下拉菜单按钮并和textbox包裹
        * @param {textBox} textBox元素
        */
        function WrapTextBox(textbox) {
            var $textbox = $(textbox), data = $textbox.data("CalvinSelect.data");
            $textbox.wrap("<span class='combo'></span>");
            var $ContainerSpan = $textbox.parent();
            $textbox.addClass("combo-text");
            var $dropdownIcon = $("<span><span class='combo-arrow'></span></span>");
            $dropdownIcon.data("AllMenusItems", { AllMenusItems: null });
            $textbox.appendTo($ContainerSpan);
            $ContainerSpan.append($dropdownIcon);
            data.TextBoxContainer = $ContainerSpan;
            data.dropdownIcon = $dropdownIcon;
            var StyleInfo = GetElementStyle($ContainerSpan[0]);
            var $ItemsContainerAll = FormItemContainer(textbox, data.options, StyleInfo.height, StyleInfo.width, StyleInfo.top, StyleInfo.left);
            data.ItemsContainer = $ItemsContainerAll;
            $ItemsContainerAll.toggle();
            $dropdownIcon.bind("click", function (event) {
                event.cancelBubble = true;
                event.stopPropagation();
                if ($ItemsContainerAll.is(":hidden")) {
                    $ItemsContainerAll.show();
                    textbox.focus();
                }
                else {
                    $ItemsContainerAll.hide();
                }
            });
            return $ContainerSpan;
        }

        /**
        * @description 剩下下拉框的容器
        * @param {textBox} textBox元素
        */
        function FormItemContainer(textBox, options, height, width, top, left) {
            var style = 'max-height:' + parseFloat(options.maxHeight) + 'px;min-height:' + parseFloat(options.minHeight) + 'px;_height:expression(this.scrollHeight > ' + parseFloat(options.maxHeight) + ' ? ' + parseFloat(options.maxHeight) + 'px:(this.scrollHeight < ' + parseFloat(options.minHeight) + ' ?  ' + parseFloat(options.minHeight) + 'px:(this.scrollHeight+"px"))); ';
            var $ItemsContainer = $("<ul class='ui-autocomplete ui-menu' style='" + style + "'></ul>");
            $ItemsContainer.appendTo("body");
            $ItemsContainer.append($(options.innerItem));
            $ItemsContainer.css({ "left": left + "px", "width": width - 4 + "px", "top": (top + height) + "px" });
            return $ItemsContainer
        }

        function HideItemContainer(textBox) {
            var $textbox = $(textBox), data = $textbox.data("CalvinSelect.data");
            data.ItemsContainer.hide();
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


        return this.each(function () {
            var $this = $(this),
             opts = {}, data;

            if (data = $this.data("CalvinSelect.data")) {
                $.extend(opts, state.options, options);
                data.options = opts
            }
            else {
                $.extend(opts, options);
                $this.data("CalvinSelect.data", { options: opts, ItemsContainer: null, TextBoxContainer: null, dropdownIcon: null });
                WrapTextBox(this);
            }
            $(document).click(function (event) {
                HideItemContainer($this[0]);
            });
        });
    };
})();