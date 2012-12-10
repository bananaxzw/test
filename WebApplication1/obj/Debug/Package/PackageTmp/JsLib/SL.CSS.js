/// <reference path="SL.Core.js" />
SL().create(function () {
    var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	ralpha = /alpha\([^)]*\)/,
	ropacity = /opacity=([^)]*)/,
	rfloat = /float/i,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
    rrgb = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
    //单位正则
    runit = /(em|pt|mm|cm|pc|in|ex|rem|vw|vh|vm|ch|gr)$/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = ["Left", "Right"],
	cssHeight = ["Top", "Bottom"],
     propCache = [],
     propFloat = ! +"\v1" ? 'styleFloat' : 'cssFloat';
    //把样式格式化成驼峰式 backgroundColor
    var camelize = function (attr) {
        return attr.replace(/\-(\w)/g, function (all, letter) {
            return letter.toUpperCase();
        });
    };
    //把样式格式化成横线连接试 background-color
    var hyphenize = function (attr) {
        return attr.replace(/([A-Z])/g, "-$1").toLowerCase();
    }

    var isQuirk = (document.documentMode) ? (document.documentMode == 5) ? true : false : ((document.compatMode == "CSS1Compat") ? false : true);

    //0-100
    function getNodeAlpha(node) {
        var val
        if (node.currentStyle) {
            return (val = ropacity.exec(node.currentStyle.filter)) ? parseInt(val[1]) : 100;
        }
        return (val = node.ownerDocument.defaultView.getComputedStyle(node, null).opacity) ? val * 100 : 100;
    }
    //0-100
    function setNodeAlpha(node, opacityValue) {
        opacityValue = parseInt(opacityValue, 10);
        opacityValue = opacityValue > 100 ? 100 : opacityValue < 0 ? 0 : opacityValue;
        if (!node.currentStyle) {
            node.style.opacity = opacityValue / 100;
        } else {
            var style = node.style, filter = style.filter;
            style.zoom = 1;
            var opacityString = opacityValue + "" === "NaN" ? "" : "alpha(opacity=" + opacityValue + ")";
            style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacityString) : opacityString;
        }
        return opacityValue;
    }

    //设置node对象的浮动
    function setNodeFloat(node, floatString) {
        if (node.currentStyle) {
            node.style.styleFloat = floatString;
        } else {
            node.style.cssFloat = floatString;
        }
        return floatString;
    }
    function getNodeFloat(node) {
        return getStyle(node, "float");
    }

    //缓存样式属性
    var memorize = function (prop) {
        return propCache[prop] || (propCache[prop] = prop == 'float' ? propFloat : camelize(prop));
    }
    var convertPixelValue = function (el, value) {
        var style = el.style, left = style.left, rsLeft = el.runtimeStyle.left;
        el.runtimeStyle.left = el.currentStyle.left;
        style.left = value || 0;
        var px = style.pixelLeft;
        style.left = left; //还原数据
        el.runtimeStyle.left = rsLeft; //还原数据
        return px + "px"
    }
    var rgb2hex = function (rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#" + tohex(rgb[1]) + tohex(rgb[2]) + tohex(rgb[3])
    }
    var tohex = function (x) {
        var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
    }
    //快速切换属性 一般获取某个样式的值 目前主要用在display:none的时候 获取height width
    //把display快速切换到block然后切换回来
    function swap(elem, options, callback, args) {
        var old = {};

        // Remember the old values, and insert the new ones
        for (var name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }

        callback.apply(elem, args);

        // Revert the old values
        for (var name in options) {
            elem.style[name] = old[name];
        }
    }
    function getWH(el, style) {
        var val = style === "width" ? el.offsetWidth : el.offsetHeight;
        if (val > 0) {
            var values = (style == 'width') ? ['left', 'right'] : ['top', 'bottom'];
            if (isQuirk) {
                return el[camelize("offset-" + style)] + "px"
            } else {
                var client = parseFloat(el[camelize("client-" + style)]),
                                paddingA = parseFloat(getStyle(el, "padding-" + values[0])),
                                paddingB = parseFloat(getStyle(el, "padding-" + values[1]));
                return (client - paddingA - paddingB) + "px";
            }
        }
        else {
            return val + "px";
        }

    }
    var getStyle = function (el, style) {
        //处理透明度
        if (style == "opacity") {
            return getNodeAlpha(el);
        }
        var value;
        //IE
        if (el.currentStyle) {
            value = el.currentStyle[memorize(style)];
            //特殊处理IE的height与width
            if (/^(height|width)$/.test(style)) {
                if (el.offsetWidth != 0) {
                    value = getWH(el, style);
                } else {

                    swap(el, { position: "absolute", visibility: "hidden", display: "block" }, getWH, [el, style]);
                }
            }
        } else {
            if (style == "float") {
                style = propFloat;
            }
            value = document.defaultView.getComputedStyle(el, null).getPropertyValue(style)
        }
        //下面部分全部用来转换上面得出的非精确值
        if (!/^\d+px$/.test(value)) {
            //转换可度量的值 em等等
            if (runit.test(value)) {
                return convertPixelValue(el, value);
            }
            //转换百分比，不包括字体
            if (/%$/.test(value) && style != "font-size") {
                return parseFloat(getStyle(el.parentNode, "width")) * parseFloat(value) / 100 + "px"
            }
            //转换border的thin medium thick
            if (/^(border).+(width)$/.test(style)) {
                var s = style.replace("width", "style"),
                            b = {
                                thin: ["1px", "2px"],
                                medium: ["3px", "4px"],
                                thick: ["5px", "6px"]
                            };
                if (value == "medium" && getStyle(el, s) == "none") {
                    return "0px";
                }
                return !!window.XDomainRequest ? b[value][0] : b[value][1];
            }
            //转换margin的auto
            if (/^(margin).+/.test(style) && value == "auto") {
                var father = el.parentNode;
                if (/MSIE 6/.test(navigator.userAgent) && getStyle(father, "text-align") == "center") {
                    var fatherWidth = parseFloat(getStyle(father, "width")),
                                _temp = getStyle(father, "position");
                    father.runtimeStyle.postion = "relative";
                    var offsetWidth = el.offsetWidth;
                    father.runtimeStyle.postion = _temp;
                    return (fatherWidth - offsetWidth) / 2 + "px";
                }
                return "0px";
            }
            // 1. 当没有设置 style.left 时，getComputedStyle 在不同浏览器下，返回值不同
            //    比如：firefox 返回 0, webkit/ie 返回 auto
            // 2. style.left 设置为百分比时，返回值为百分比
            // 对于第一种情况，如果是 relative 元素，值为 0. 如果是 absolute 元素，值为 offsetLeft - marginLeft
            // 对于第二种情况，大部分类库都未做处理，属于“明之而不 fix”的保留 bug
            if (/(top|left)/.test(style) && value == "auto") {
                var val = 0, nameFix = style == "left" ? "Left" : "Top";
                if (/absolute|fixed/.test(getStyle(el, "position"))) {

                    offset = el["offset" + nameFix];
                    // old-ie 下，elem.offsetLeft 包含 offsetParent 的 border 宽度，需要减掉
                    if (el.uniqueID && document.documentMode < 9 || window.opera) {
                        // 类似 offset ie 下的边框处理
                        // 如果 offsetParent 为 html ，需要减去默认 2 px == documentElement.clientTop
                        // 否则减去 borderTop 其实也是 clientTop
                        // http://msdn.microsoft.com/en-us/library/aa752288%28v=vs.85%29.aspx
                        // ie<9 注意有时候 elem.offsetParent 为 null ...
                        // 比如 DOM.append(DOM.create("<div class='position:absolute'></div>"),document.body)
                        offset -= el.offsetParent && el.offsetParent['client' + nameFix] || 0;
                    }
                    val = offset - (parseInt(getStyle(el, 'margin-' + name), 10) || 0) + "px";
                    return val;
                }
                return "0px";
            }
            //转换颜色
            if (style.search(/background|color/) != -1) {
                var color = {
                    aqua: '#0ff',
                    black: '#000',
                    blue: '#00f',
                    gray: '#808080',
                    purple: '#800080',
                    fuchsia: '#f0f',
                    green: '#008000',
                    lime: '#0f0',
                    maroon: '#800000',
                    navy: '#000080',
                    olive: '#808000',
                    orange: '#ffa500',
                    red: '#f00',
                    silver: '#c0c0c0',
                    teal: '#008080',
                    transparent: 'rgba(0,0,0,0)',
                    white: '#fff',
                    yellow: '#ff0'
                }
                if (!!color[value]) {
                    value = color[value]
                }
                if (value == "inherit") {
                    return getStyle(el.parentNode, style);
                }
                //FF rgb()格式
                if (rrgb.test(value)) {
                    return rgb2hex(value)
                } else if (/^#/.test(value)) {
                    value = value.replace('#', '');
                    return "#" + (value.length == 3 ? value.replace(/^(\w)(\w)(\w)$/, '$1$1$2$2$3$3') : value);
                }
                return value;
            }
        }
        return value; //如 0px
    };
    var setStyle = function (el, style, value) {
        if (style == "float") {
            return setNodeFloat(el, value);

        } else if (style == "opacity") {
            return setNodeAlpha(el, value);
        }
        if (el.style.setProperty) {
            //必须是连字符风格，el.style.setProperty('background-color','red',null);
            el.style.setProperty(hyphenize(style), value, null);
        } else {
            //必须是驼峰风格，如el.style.paddingLeft = "2em"
            el.style[camelize(style)] = value;
        }
        return value;

    };
    sl.css = window.css = function (node, style, value) {
        return sl.access([node], style, value, getStyle, setStyle);
    }
});