/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
var Defaults = {
    title: "",
    footer: "",
    content:"",
    zIndex: 1000
}
var styleHelper = {
    /*
    *@description 让对象在父元素中居中
    *@param  {el} 要居中的对象
    *@param {x} 是否X方向居中
    *@param {Y} 是否Y方向居中
    */
    center: function (el, x, y) {
        if (!x && !y) return;
        var p = el.parentNode, s = el.style;
        var $p = $(p);
        var borderAndPaddingWidth, borderAndPaddingHeight;

        if ($.support.boxModel) {
            borderAndPaddingWidth = $p.outerWidth() - $p.width();
            borderAndPaddingHeight = $p.outerHeight() - $p.height();
        }

        var l, t;
        if ($.support.boxModel) {
            l = ((p.offsetWidth - el.offsetWidth) / 2) - (borderAndPaddingWidth / 2);
            t = ((p.offsetHeight - el.offsetHeight) / 2) - (borderAndPaddingHeight / 2);

        }
        else {
            l = (p.offsetWidth - el.offsetWidth) / 2;
            t = (p.offsetHeight - el.offsetHeight) / 2;
        }
        if (x) s.left = l > 0 ? (l + 'px') : '0';
        if (y) s.top = t > 0 ? (t + 'px') : '0';
    }


};
function SLDialog(elem, options) {


}

SLDialog.prototype = {


}
/*
   <div id="easyDialogWrapper" class="easyDialog_wrapper" style="display: block; margin: 0px;">
        <div class="easyDialog_content">
            <h4 class="easyDialog_title" id="easyDialogTitle" style="cursor: move;">
                <a href="javascript:void(0)" title="关闭窗口" class="close_btn" id="closeBtn">×</a>弹出层标题</h4>
            <div class="easyDialog_text">
                欢迎使用easyDialog : )</div>
            <div class="easyDialog_footer">
                <button class="btn_normal" id="easyDialogNoBtn">
                    取消</button>
                <button class="btn_highlight" id="easyDialogYesBtn">
                        确定</button></div>
        </div>
    </div>*/
var DialogHelper = {
    wrapDialogHelper: function (container, opts) {
        var $container = $(container),
         dialog = $("<div id='easyDialogWrapper' class='easyDialog_wrapper' style='display: block; margin: 0px;'></div>"),
         dialogContent = $('iv class="easyDialog_content"></div>');
         dialog.append(dialogContent);
        $container.append(dialog);
        dialog.append(
        if (opts.showTitle) {

        }
    }
}