/// <reference path="SL.Core.js" />
/// <reference path="SL.CSS.js" />
/// <reference path="SL.support.js" />

var uu = new SL();
function offset() {
    this.init = function () {
        var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat(jQuery.curCSS(body, "marginTop", true)) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

        uu.extend(container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" });

        container.innerHTML = html;
        body.insertBefore(container, body.firstChild);
        innerDiv = container.firstChild;
        checkDiv = innerDiv.firstChild;
        td = innerDiv.nextSibling.firstChild.firstChild;

        //定位的时候 是否加上offsetParent的边框width
        this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
        //定位的时候  rd是否已经加上边框
        this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

        checkDiv.style.position = "fixed", checkDiv.style.top = "20px";
        // safari subtracts parent border width here which is 5px
        //是否支持fixed
        this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
        checkDiv.style.position = checkDiv.style.top = "";

        innerDiv.style.overflow = "hidden", innerDiv.style.position = "relative";
        this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);
        //body的offset是否包含了margin
        this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

        body.removeChild(container);
        body = container = innerDiv = checkDiv = table = td = null;
    }
}

offset.prototype = {
    bodyOffset: function (body) {
        var top = body.offsetTop, left = body.offsetLeft;

        this.init();

        if (this.doesNotIncludeMarginInBodyOffset) {
            top += parseFloat(css(body, "marginTop")) || 0;
            left += parseFloat(css(body, "marginLeft", true)) || 0;
        }

        return { top: top, left: left };
    },
    getOffset: function (node) {
        if ("getBoundingClientRect" in document.documentElement) {
            jQuery.fn.offset = function (options) {
                var node = this[0];

                if (!node || !node.ownerDocument) {
                    return null;
                }

                //                if (options) {
                //                    return this.each(function (i) {
                //                        this.setOffset(this, options, i);
                //                    });
                //                }

                if (node === node.ownerDocument.body) {
                    return this.bodyOffset(node);
                }

                var box = node.getBoundingClientRect(), doc = node.ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top = box.top + (self.pageYOffset || sl.Support.boxModel && docElem.scrollTop || body.scrollTop) - clientTop,
			left = box.left + (self.pageXOffset || sl.Support.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;

                return { top: top, left: left };
            };

        }
        //其实 FF3.0+和Opera9.5+ 就已经支持 getBoundingClientRect无所谓下面的代码了
        else {
            var node = this[0];

            if (!node || !node.ownerDocument) {
                return null;
            }

            if (options) {
                return this.each(function (i) {
                    this.setOffset(this, options, i);
                });
            }

            if (node === node.ownerDocument.body) {
                return this.bodyOffset(node);
            }

            this.init();

            var offsetParent = node.offsetParent, prevOffsetParent = node,
			doc = node.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle(node, null) : node.currentStyle,
			top = node.offsetTop, left = node.offsetLeft;

            while ((node = node.parentNode) && node !== body && node !== docElem) {
                if (this.supportsFixedPosition && prevComputedStyle.position === "fixed") {
                    break;
                }

                computedStyle = defaultView ? defaultView.getComputedStyle(node, null) : node.currentStyle;
                top -= node.scrollTop;
                left -= node.scrollLeft;

                if (node === offsetParent) {
                    top += node.offsetTop;
                    left += node.offsetLeft;

                    if (this.doesNotAddBorder && !(this.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(node.nodeName))) {
                        top += parseFloat(computedStyle.borderTopWidth) || 0;
                        left += parseFloat(computedStyle.borderLeftWidth) || 0;
                    }

                    prevOffsetParent = offsetParent, offsetParent = node.offsetParent;
                }

                if (this.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
                    top += parseFloat(computedStyle.borderTopWidth) || 0;
                    left += parseFloat(computedStyle.borderLeftWidth) || 0;
                }

                prevComputedStyle = computedStyle;
            }

            if (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static") {
                top += body.offsetTop;
                left += body.offsetLeft;
            }

            if (this.supportsFixedPosition && prevComputedStyle.position === "fixed") {
                top += Math.max(docElem.scrollTop, body.scrollTop);
                left += Math.max(docElem.scrollLeft, body.scrollLeft);
            }

            return { top: top, left: left };
        }

    },
    setOffset: function (node) {

        var computedStyle = defaultView ? defaultView.getComputedStyle(node, null) : node.currentStyle;
        if (/static/.test(css(node, "position"))) {
            css(node, "position", "relative");
        }
        var curOffset = this.getOffset(node);
        curTop = parseInt(computedStyle.left, 10) || 0,
		curLeft = parseInt(computedStyle.left, 10) || 0;

        if (uu.InstanceOf.Function(options)) {
            options = options.call(node, i, curOffset);
        }

        var props = {
            top: (options.top - curOffset.top) + curTop,
            left: (options.left - curOffset.left) + curLeft
        };
        css(node, props);
    }
}
