/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
/// <reference path="SL.Mask.js" />

var Defaults = {
    title: "",
    footer: "",
    message: "",
    showTitle: true,
    showFooter: true,
    zIndex: 1000,
    showClose: true,
    autoShow: true,
    centerX: true,
    centerY: true,
    showOverlay: true,
    overlayCSS: {
        backgroundColor: '#000',
        opacity: 50
    },
    dialogCSS:
    {}
}

function SLDialog(elem, options) {
    if ((elem.nodeType && elem.nodeType === 9) || sl.InstanceOf.Window(elem) || elem.nodeName == "BODY") {
        this.elem = elem.body || elem.document.body;
        this.full = true; //window或者document为true
    }
    else {
        this.elem = elem;
        this.full = false; //window或者document为true
        //如果不是full的话 元素要设置position=relative 这样是为了方便遮罩层top:0 width100% left:0 height100%
        //遮盖元素
        if (sl.css(this.elem, 'position') == 'static')
            this.elem.style.position = 'relative';
    }
    this.ie6 = sl.Browser.ie == 6.0, this.boxModel = sl.Support.boxModel;
    this.options = sl.extend(Defaults, options);
    this.$dialog = DialogHelper.wrapDialog(this.elem, this.options, this.full);
    DialogHelper.setDialogStyle(this.$dialog, this.options, this.full);
    this.mask = DialogHelper.createMask(this.elem, this.options);
}

SLDialog.prototype = {
    close: function () {
        this.$dialog.hide();
    },
    open: function () {
        this.$dialog.show();
    }

}
var DialogHelper = {
    wrapDialog: function (container, opts, full) {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="container"></param>
        /// <param name="opts"></param>
        /// <param name="full">是否window或者document</param>
        var $container = $(container),
         $dialog = $("<div id='SLDialog' class='SLDialog' style='display:block;position:" + (full ? 'fixed' : 'absolute') + ";z-index:" + (opts.zIndex + 2) + ";margin: 0px;'></div>"),
         dialogContent = $('<div class="Dialog_content"></div>');
        if (opts.showTitle) {
            var dialogTitle = $('<div class="Dialog_title" id="Dialog_title" style="cursor: move;"><h4 style="float:left;display:inline-block;margin:0;">' + opts.title + '</h4></div>');
            if (opts.showClose) {
                var closeBtn = $('<a href="javascript:void(0)" title="关闭窗口" class="close_btn" id="closeBtn">×</a>');
                closeBtn.click(function () {
                    $dialog.hide();
                });
                dialogTitle.prepend(closeBtn);
            }

            dialogContent.append(dialogTitle);
            dialogContent.append("<div class='line'/>");
        }
        var dialogMessage = $('<div class="Dialog_message">' + opts.message + '</div>');
        dialogContent.append(dialogMessage);
        if (opts.showFooter) {
            dialogContent.append("<div class='line'/>");
            var dialogFooter = $('<div class="Dialog_footer">' + opts.footer + '</div>');
            dialogContent.append(dialogFooter);
        }
        $dialog.append(dialogContent);
        if (!opts.autoShow) {
            $dialog.hide();
        }
        $container.append($dialog);
        return $dialog;
    },
    createMask: function (elem, opts) {
        if (opts.showOverlay) {
            var mask = new Mask(elem, { baseZ: opts.zIndex++, overlayCSS: opts.overlayCSS });
            return mask;
        }
        return null;
    },
    setDialogStyle: function ($dialog, opts, full) {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="$dialog"></param>
        /// <param name="full">是否window或者documen</param>

        //IE6的话 可以采用setExpression来居中消息   其他的可以采用fiexed属性来居中
        if (sl.Browser.ie == 6.0 && full) {
            $dialog.css("position", 'absolute');
            $dialog.elements[0].style.setExpression('top', '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (document.documentElement.scrollTop||document.body.scrollTop) + "px"');
            $dialog.elements[0].style.setExpression('left', '(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (document.documentElement.scrollLeft||document.body.scrollLeft) + "px"');
        }
        else if (full) {
            $dialog.addClass('Dialogfull');
        }
        else {
            styleHelper.center($dialog.elements[0], opts.centerX, opts.centerY);
        }


    }
}
var EventHelper = {

    close: function ($dialog, opts) {
        $dialog.hide();
    }

};
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

        if (sl.Support.boxModel) {
            borderAndPaddingWidth = $p.outerWidth() - $p.width();
            borderAndPaddingHeight = $p.outerHeight() - $p.height();
        }

        var l, t;
        if (sl.Support.boxModel) {
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