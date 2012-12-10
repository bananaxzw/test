/**********************************************************************文件注释*************************************************************************
* * 文 件 名:xuzhiwei.js
* * 文件编号:xuzhiwei_js_0002
* * 内部版本号:0.8.2
* * CopyRight (c) 2008-2010 xuzhiwei
*-------------------------------------------------------------------------------------------------------------------------------------------------------
* * 创 建 人:xuzhiwei(空间许志伟),Franky,wait
* * 创建日期:2009-3-30
* * 描    述:javascript 扩展类库. 
* *         :适应浏览器 ie6+ ff2.0+ opera9+ safari3+ chrome1.0+
* *         :xhtml1.0+dtd下正常工作!!!
*-------------------------------------------------------------------------------------------------------------------------------------------------------
* * 修 改 人:Franky
* * 修改日期:2009-8-12
* * 修改描述:修改了getAbsolute_Size 以及 toJSONString 两个方法
*-------------------------------------------------------------------- 属性方法列表---------------------------------------------------------------------
* 1.
* 2.
* 
* 
* *******************************************************************************************************************************************************/
if (!window.xuzhiwei || !xuzhiwei.init) {//初始化检测
    window.xuzhiwei = {
        ///<summary>
        ///xuzhiwei类型
        ///</summary>

    };
    xuzhiwei.toString = xuzhiwei.valueOf = function () { return 'xuzhiwei'; };
    window.xuzhiwei.clientCtrls = {};
    (function () {
        var ns = this; //引用伪命名空间
        //alert(this == xuzhiwei);
        var undefined;
        (function () {//浏览器判断
            ns.clientBrowser = _getBrowser();
            ns.clientBrowser.is_ie =
        ns.clientBrowser.is_ie6 =
        ns.clientBrowser.is_ie7 =
        ns.clientBrowser.is_ie8 =
        ns.clientBrowser.is_ff =
        ns.clientBrowser.is_opear =
        ns.clientBrowser.is_safari =
        ns.clientBrowser.is_chrome =
        ns.clientBrowser.is_others = false;
            ns.clientBrowser.is_gecko = navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1;
            ns.clientBrowser.is_webkit = navigator.userAgent.indexOf('AppleWebKit/') > -1;
            switch (ns.clientBrowser.toString()) {
                case 'ie':
                    ns.clientBrowser.is_ie = true;
                    navigator.userAgent.indexOf("MSIE 6.0") > 0 && (ns.clientBrowser.is_ie6 = true);
                    navigator.userAgent.indexOf("MSIE 7.0") > 0 && (ns.clientBrowser.is_ie7 = true);
                    navigator.userAgent.indexOf("MSIE 8.0") > 0 && (ns.clientBrowser.is_ie8 = true);
                    break;
                case 'ff':
                    ns.clientBrowser.is_ff = true;
                    break;
                case 'opera':
                    ns.clientBrowser.is_opera = true;
                    ns.clientBrowser['is_opera' + parseInt(window.opera.version())] = true;
                    break;
                case 'safari':
                    ns.clientBrowser.is_safari = true;
                    break;
                case 'chrome':
                    ns.clientBrowser.is_chrome = true;
                    break;
                case 'others':
                    ns.clientBrowser.is_others = true;
                    break;
            }

            function _getBrowser() {
                var clientBrowser = new String(navigator.userAgent);
                if ((clientBrowser.indexOf('MSIE') >= 0) && (clientBrowser.indexOf('Opera') < 0)) return new String('ie');
                if (clientBrowser.indexOf('Firefox') >= 0) return new String('ff');
                if (clientBrowser.indexOf('Opera') >= 0) return new String('opera');
                if (clientBrowser.indexOf('Chrome') >= 0) return new String('chrome'); // 必须放到Safari前判断.
                if (clientBrowser.indexOf('Safari') >= 0) return new String('safari');
                return new String('others');
            }
        })();

        this.enums = {//自定义定义枚举
            xmlHead: '<?xml version="1.0" encoding="utf-8" ?>'
        };

        this.RegExp = {//正则有待扩展.
            validator: {
                userName: /^[\w]\w{2,16}[0-9a-zA-Z]$/,
                password: /^[\S]{6,20}$/,
                email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
                mobile: /^((\(\d{3}\))|(\d{3}\-))?13\d{9}$/,
                phone: /(\d{3}-|\d{4}-)?(\d{8}|\d{7})?/,
                idCard: /^\d{15}$|^\d{17}[\dxXyY]$/, //身份证
                lDate: /^(\d{4})[\-\/](\d{2})[\-\/](\d{2}) (\d{2}):(\d{2}):(\d{2})$/, //yyyy-mm-dd hh:mm:ss
                sDate: /^(\d{4})[\-\/](\d{2})[\-\/](\d{2})$/ //yyyy-mm-dd
            },
            currency: /^\d+(\.\d+)?$/, //货币
            url: new RegExp('^[a-zA-z]+://(\\w+(-\\w+)*)(\\.(\\w+(-\\w+)*))*(\\?\\S*)?$'),
            img: /^[^\?]*\.(gif|jpg|png)$/i,
            uInt: /^\d+$/, //正整数
            Int: /^-?\d+$/ //整数

        };
        //Object类扩展-----------------------------------------------------------------------------------------------------------------
        this.Object = {
            //对象扩展.把参数2的属性抄写到参数1上去
            extend: extend,
            //clone object  obj不能是dom对象或bom对象。其属性也不能包含 dom节点 否则可能造成无限递归.
            clone: clone,

            //相等性判断..
            compare: compare,

            //对象转数组
            toArray: convertToArray,
            serializer: serializer, //序列化化对象
            deSerializer: deSerializer, //反序列化

            //判断对象常用类型
            isString: isString,
            isArray: isArray,
            isNumber: isNumber,
            isBoolean: isBoolean,
            isDate: isDate,
            isRegExp: isRegExp,
            isFunction: isFunction,
            isUndefined: isUndefined,
            isNull: isNull,
            isArguments: isArguments,
            isObject: isObject,
            isHash: isHash,
            isDelegate: isDelegate,
            isElement: isElement,
            isAttribute: isAttribute,
            isTextNode: isTextNode,
            isNodeList: isNodeList,
            isDocumentFragment: isDocumentFragment,
            isXMLDoc: isXMLDocument,

            //创建哈希表对象
            //实例化同时可传一个对象.来进行操作.不传,则默认建立一个空对象操作。参数2控制是否clone对象作为hashtable对象操作
            createHashTable: function (obj, isCloneObj) {
                return new hashTable(obj, isCloneObj);
            }
        };

        //String类的扩展方法 -----------------------------------------------------------------------------------------------------------
        this.String = {
            ///<summary>
            /// string操作
            ///</summary>
            empty: '',
            repeat: function (sChar, nCount) {
                return new Array(nCount + 1).join(sChar);
            },
            most: function (str) {
                ///<summary>
                /// 返回对象 .Char str中出现次数最多的字符 .length 出现的次数
                ///</summary>
                ///<param name="str" type="String">字符串</param>
                var max = 0, sChar = null, tc;
                for (var i = 0, j = 0; i < str.length; i++, j = 0) {
                    str = str.replace(
                    new RegExp(
                        ns.String.isInList(
                            tc = str.substr(0, 1),
                            ['\\', '^', '$', '*', '+', '.', '|']
                        ) ? '\\' + tc : tc,
                        'g'
                    ),
                    f
                );
                }
                return { Char: sChar, length: max };
                function f(m) { ++j > max && ((max = j), sChar = m); return ''; }
            },
            //模拟 c#上中的Format()方法
            format: function (str) {
                var args = arguments;
                return new String(str).replace(/\{(\d+)\}/g,
        function (m, i) {
            i = parseInt(i);
            return args[i + 1];
        }).toString();
            },

            //替换全部匹配字符..a替换为b
            replaceAll: function (str, a, b) {
                return new String(str).replace(new RegExp(ns.String.isInList(a, ['\\', '^', '$', '*', '+', '.', '|']) ? '\\' + a : a, 'g'), b).toString();
            },
            //字符串转化成字符数组
            toArray: function (str) {
                return new String(str).split('');
            },

            //验证字符串是否在所给参数列表中 参数可以是数组 也可以是多个字符串或多个数组
            isInList: function (str, args) {
                var length = arguments.length;
                for (var i = 1; i < length; i++) {
                    if (compare(str, arguments[i])) return true;
                    else if (isArray(arguments[i])) {
                        for (var j = 0, _length = arguments[i].length; j < _length; j++) {
                            if (compare(str, arguments[i][j])) return true;
                        }
                    }
                }
                return false;
            },

            //验证字符串str 是否 包含参数containedStr
            isContains: function (str, containedStr) {
                return new String(str).indexOf(containedStr) > -1;
            },
            //验证字符串str是否 被参数containsStr包含
            isContained: function (str, containsStr) {
                return new String(containsStr).indexOf(str) > -1;
            },
            //判断字符串str 是否以 startStr开始
            isStartWith: function (str, startStr) {
                return (new String(str).indexOf(startStr) == 0);
            },
            insert: function (str, nPosition, sInsertStr) {//在字符串指定位置后面插入指定字符串 如 "abc" 位置0 插入"d" 则 为dabc
                str = new String(str);
                sInsertStr = sInsertStr || '';
                if (nPosition <= 0) return sInsertStr + str;
                if (nPosition >= str.length) return str + sInsertStr;
                return str.substr(0, nPosition) + sInsertStr + str.substr(nPosition);
            },
            padLeft: function (str, nLen, sPaddingChar) {//模拟 c# string.padLeft 即 str.length<nLen 时  str左边补充 nLen-length 个 paddingChar字符
                str = new String(str);
                var len = str.length;
                if (len >= nLen) return str.toString();
                return ns.String.repeat(sPaddingChar || ' ', (nLen - len) || 0) + str;
            },
            padRight: function (str, nLen, sPaddingChar) {//模拟 c# string.padRight 即 str.length<nLen 时  str右边补充 nLen-length 个 paddingChar字符
                str = new String(str);
                var len = str.length;
                if (len >= nLen) return str.toString();
                return str + ns.String.repeat(sPaddingChar || ' ', (nLen - len) || 0);
            },
            //判断字符串str 是否以 endStr 结束
            isEndWith: function (str, endStr) {
                var tLen = new String(str).length;
                var len = new String(endStr).length;
                if (len > tLen) return false;
                return (len == 0 || new String(str).substr(tLen - len) == endStr);
            },
            //去全部空格
            trimAll: function (str) {
                return new String(str).replace(/\s/g, '').toString();
            },
            //去前后空格
            trim: function (str) {
                return new String(str).replace(/(^\s*)|(\s*$)/g, '').toString();
            },

            //去前空格
            lTrim: function (str) {
                return new String(str).replace(/^\s*/g, '').toString();
            },

            //去后空格
            rTrim: function (str) {
                return new String(str).replace(/\s*$/g, '').toString();
            },
            //去字符串头部 指定长度的字符 或 如果参数2是字符串则先判断是否以该字符串开头。如果是则删除掉
            deleteStart: function (str, nLen_sStr) {
                str = new String(str);
                if (isNumber(nLen_sStr)) str = str.substr(nLen_sStr);
                else if (isString(nLen_sStr)) str = ns.String.isStartWith(str, nLen_sStr) ? str.replace(nLen_sStr, '') : str;
                return str.toString();
            },
            //去字符串尾部 指定长度的字符 或 如果参数2是字符串 则先判断是否以该字符串开头。如果是则删除掉
            deleteEnd: function (str, nLen_sStr) {
                str = new String(str);
                if (isNumber(nLen_sStr)) str = str.substr(0, str.length - nLen_sStr);
                else if (isString(nLen_sStr)) str = ns.String.isEndWith(str, nLen_sStr) ? str.substr(0, str.length - nLen_sStr.length) : str;
                return str.toString();
            },

            //首字母大写
            uCaseFirstChar: function (str) {
                str = new String(str);
                return str.substr(0, 1).toUpperCase() + str.substr(1).toString();
            },

            //abc-def-ghi 转换成abcDefGhi格式
            camelize: function (str) {
                return new String(str).replace(/-(\D)/g, function (m, $1) {
                    return $1.toUpperCase();
                });
            },
            uncamelize: function (str) {//abcDefGhi 转换成 abc-def-ghi
                return new String(str).replace(/[A-Z]/g, function (m) {
                    return '-' + m.toLowerCase();
                });
            },
            //获取字符串字节数
            getBit: function (str) {
                return new String(new String(str).replace(/[^\x00-\xff]/g, '..')).length;
            },

            //stringBuffer
            createBuffer: function (sFirstString) {
                return new stringBuffer(sFirstString);
            }

        };
        //Array类的扩展方法 ----------------------------------------------------------------------------------------------------

        this.Array = {//Array类的扩展方法

            //复制当前数组 并返回该数组
            copy: function (arr) {
                return arr.concat();
            },
            //清空当前数组
            clear: function (arr) {
                arr.length = 0;
            },

            //模拟js1.6 Array.prototype.indexOf方法.并修复ff等其他实现 indexOf方法的浏览器中值类型于引用类型比较相等性一律返回false问题
            indexOf: function (arr, obj) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (compare(arr[i], obj)) return i;
                }
                return -1;
            },
            //模拟js1.6 Array.prototype.lastIndexOf方法.并修复ff等其他实现 indexOf方法的浏览器中值类型于引用类型比较相等性一律返回false问题
            lastIndexOf: function (arr, obj) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (compare(arr[i], obj)) return i;
                }
                return -1;
            },
            //验证 array元素中 是否包含某个元素
            contains: function (arr, obj) {
                return ns.Array.indexOf(arr, obj) > -1;
            },

            // 在指定位置前插入元素.
            insertBefore: function (arr, obj, index, isReturnNew) {
                var o = arr.splice(index, 0, obj);
                if (!isReturnNew) return o;
                return obj;
            },
            // 在指定位置后插入元素.
            insertAfter: function (arr, obj, index, isReturnNew) {
                var o = arr.splice(index + 1, 0, obj);
                if (!isReturnNew) return o;
                return obj;
            },
            //根据索引 替换当前元素
            replace: function (arr, obj, index, isReturnNew) {
                var o = arr.splice(index, 1, obj);
                if (!isReturnNew) return o;
                return obj;
            },
            //删除指定数组元素

            remove: function (arr, index) {
                return arr.splice(index, 1);
            },

            //删除 当前数组中重复的项.
            deleteRepeater: function (arr) {
                if (arr.length < 2) return arr;
                var aT = arr.concat();
                arr.length = 0;
                for (var i = 0; i < aT.length; i++) {
                    arr.push(aT.splice(i--, 1)[0]);
                    for (var j = 0; j < aT.length; j++) {
                        if (compare(aT[j], arr[arr.length - 1])) aT.splice(j--, 1);
                    }
                }
                return arr;
            },
            // 模拟js1.6 Array.prototype.forEach
            forEach: function (arr, f, oThis) {
                oThis = oThis || window;
                if (Array.prototype.forEach) arr.forEach(f, oThis);
                else {
                    for (var i = 0, len = arr.length; i < len; i++) {
                        f.call(oThis, arr[i], i, arr); //p1 上下文环境 p2 数组元素 p3 索引 p4 数组对象
                    }
                }
                return arr;
            },

            //模拟js1.6 Array.prototype.filter
            filter: function (arr, f, oThis) {
                oThis = oThis || window;
                if (Array.prototype.filter) return arr.filter(f, oThis);
                var a = [];
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (f.call(oThis, arr[i], i, arr)) a.push(arr[i]);
                }
                return a;
            },
            //模拟js1.6 Array.prototype.map

            map: function (arr, f, oThis) {
                oThis = oThis || window;
                if (Array.prototype.map) return arr.map(f, oThis);
                var a = [];
                for (var i = 0, len = arr.length; i < len; i++) {
                    a.push(f.call(oThis, arr[i], i, arr));
                }
                return a;
            },

            //模拟 js1.6 Array.prototype.every
            every: function (arr, f, oThis) {
                oThis = oThis || window;
                if (Array.prototype.every) return arr.every(f, oThis);
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (!f.call(oThis, arr[i], i, arr)) return false;
                }
                return true;
            },

            //模拟 js1.6 Array.prototype.some
            some: function (arr, f, oThis) {
                oThis = oThis || window;
                if (Array.prototype.some) return arr.some(f, oThis);
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (f.call(oThis, arr[i], id, arr)) return true;
                }
                return false;
            }
        };

        //Math类扩展-------------------------------------------------------------------------------------------------------------------
        this.Math = {
            //修正了加减乘除运算。 6位浮点 可信任.
            //减法
            sub: sub,
            //加法
            add: add,
            //乘法
            mul: mul,
            //除法
            div: div,
            //获取指定范围随机整数参数1 为最小整数 参数2位最大整数.
            getRandomFrom: getRandomFrom

        };

        //Date类扩展------------------------------------------------------------------------------------------------------------------

        this.Date = {//获取中文格式日期
            getLocaleTimeString: function (str) {
                var dt = new Date(str);
                return dt.toLocaleString() + ' 星期' + new String('日一二三四五六').charAt(dt.getDay());
            },
            getJSONTimeString: function (str, c) {//参数c 连接年月日的连接符
                c = c || '/';
                var f = arguments.callee._format;
                var dt = new Date(str);
                return dt.getUTCFullYear() + c + f((dt.getUTCMonth() + 1)) + c + f(dt.getUTCDate()) + 'T' + f(dt.getUTCHours()) + ':' +
            f(dt.getUTCMinutes()) + ':' + f(dt.getUTCSeconds()) + 'Z';
            },
            getNomalTimeString: function (str, c) {//参数c 连接年月日的连接符
                c = c || '/';
                var dt = new Date(str);
                return dt.getFullYear() + c + (dt.getMonth() + 1) + c + dt.getDate() + ' ' + dt.getHours() + ':' +
            dt.getMinutes() + ':' + dt.getSeconds();
            }

        }
        this.Date.getJSONTimeString._format = function (n) {
            return n < 10 ? '0' + n : n;
        }

        //Class 原型继承--------------------------------------------------------------------------------------------------------------
        this.Class = {
            _empty: function () { },
            inherit: function (Class, base) {//在声明构造函数的prototype后调用.且只继承原型链 动态属性 需要在构造函数中调用this.base.call或apply继承
                if (typeof Class != 'function' || typeof base != 'function') throw new Error(ns + ':Class.inherit 方法参数有错误');
                this._empty.prototype = base.prototype;
                var proto = Class.prototype;
                Class.prototype = new this._empty;
                for (var o in proto) !o.isPrototypeOf(proto) && (Class.prototype[o] = proto[o]); //抄写原始Class.prototype中的属性
                Class.prototype.constructor = Class;
                Class.base = base;
                proto = undefined;
            }
        }
        //Function类扩展--------------------------------------------------------------------------------------------------------------
        this.Function = {
            empty: function () { },
            bind: bindFunction, //函数捆绑
            bindWithParams: bindFunctionWithParams, //带参捆绑
            bindAsEventHandler: bindAsEventHandler, //但参且第一个参数为event
            createDelegate: function (f, aArgs, oThis, isOverlookRepeat) {//模拟c#委托
                return new delegate(f, aArgs, oThis, isOverlookRepeat);
            }
        };


        //Dom类-----------------------------------------------------------------------------------------------------------------------

        this.DOM = {
            isWindowReady: false,
            _isReady: false, //当前页的dom是否加载完毕.
            _readyHandlers: [], //dom加载完毕后的回调方法数组.
            //注册domReady自定义事件...可以重复调用此方法 参数支持 方法 数组 或多个方法 或多个包含方法数组...如果domReady已经发生.继续注册方法则立刻执行.
            ready: domReady, //自定义domReady事件.
            windowReady: windowReady, //window.onload触发事件.如果已经loaded 则直接执行
            isElement: isElement, //判断对象是否为元素节点
            isAttribute: isAttribute, //判断对象是否为属性节点
            isTextNode: isTextNode, //判断对象是否为 文本节点
            isNodeList: isNodeList, //判断是否是 nodeList集合 包括 staticNodeList
            isDocumentFragment: isDocumentFragment, //判断是否为文档片段
            isXMLDoc: isXMLDocument, //判断对象是否为xmldoc对象
            $: $, //选择器方法
            $I: ID, //document.getElementById代替方法 支持多参
            $C: getElementsByClassName,
            $N: getElementsByName,
            $T: getElementsByTagName,
            $A: convertToArray, //对象转数组.专门处理arguments以及 nodeList集合

            getAllElements: getAllElements, //默认获取全部元素集合.支持选择器函数.filter 返回符合条件的 元素结合数组
            getAllParentElements: getAllParentElements, //获取指定节点的祖先element元素集合 支持 filter选择器函数
            getAllChildElements: getAllChildElements, //获取指定节点 全部子孙element元素集合 支持 filter选择器 函数
            getSiblingElements: getSiblingElements, //获取指定节点全部兄弟element契合 支持选择器filter
            getNextElements: getNextElements, //获取指定节点的之后的全部兄弟元素 支持filter选择器 
            getNextElement: getNextElement, //获取指定节点的下一个兄弟元素
            getPreviousElements: getPreviousElements, //获取指定节点之前的全部兄弟节点 支持filter选择器
            getPreviousElement: getPreviousElement, //获取指定节点的前一个兄弟元素
            getFirstChildElement: getFirstChildElement, //获取第一个子节元素 支持filter过滤器则返回第一个满足条件的元素
            getLastChildElement: getLastChildElement, //同上。获取最后一个
            getChildElements: getChildElements, //获取全部子元素。支持过滤器 filter返回符合条件的子元素


            insertBefore: insertBefore, //插入到当前节点前
            insertAfter: insertAfter, //插入到当前节点后
            insertAdjacentHTML: insertAdjacentHTML, //默认实现ie的insertAdjacentHTML 实现其他w3c浏览器的支持.用法同ie的原函数相同.
            appendFirstChild: appendFirstChild, //插入到目标元素的第一个子节点位置
            removeNode: removeNode, //支持多参 或数组
            removeChildren: removeChildren, //删除全部子元素
            replaceNode: replaceNode, //替换节点
            replaceNodeHTML: replaceNodeHTML, //节点替换成指定html
            update: updateInnerHTML, //更新element innerHTML
            watchFocus: {//调用hasFocus之前必须先调用watchFocus.start()方法。一保证safari chrome浏览器 可获得正确的结果
                isWatching: false,
                start: function () {
                    if (!ns.clientBrowser.is_webkit) return;
                    if (document.addEventListener) {
                        this.isWatching = true;
                        document.addEventListener('focus', this._focusHandler, true);
                        document.addEventListener('blur', this._blurHandler, true);
                    }
                },
                _focusHandler: function (e) {
                    if (e && e.target) document.activeElement = e.target;
                },
                _blurHandler: function () {
                    document.activeElement = null;
                },
                cancel: function () {
                    if (!this.isWatching) return;
                    this.isWatching = false;
                    document.removeEventListener('focus', this._focusHandler, true);
                    document.removeEventListener('blur', this._blurHandler, true);
                }
            },
            hasFocus: hasFocus, //调用hasFocus之前必须先调用watchFocus.start()方法。一保证safari chrome浏览器 可获得正确的结果
            isNodeContains: isNodeContains, //判断父节点是否包含子节点
            setNodeTop: setNodeTop, //设置节点在所有层中位置最高
            setNodeStyle: setNodeStyle, //设置节点样式
            setNodeClass: setNodeClass, //设置节点的class
            setNodeAlpha: setNodeAlpha, //设置节点透明度
            getNodeAlpha: getNodeAlpha, //获取节点透明度
            setNodePosition: setNodePosition, //设置节点绝对定位坐标
            setNodeBGPosition: setNodeBGPosition, //设置节点背景图位置.
            setNodeFloat: setNodeFloat, //设置节点浮动
            getNodeFloat: getNodeFloat, //获取节点浮动状态
            getCurrentStyle: getCurrentStyle, //获取节点最终渲染的样式
            getNodeFloatArea: getNodeFloatArea, //获取节点的 border大小以及padding宽高 大小 
            getAbsolutePosition_Size: getAbsolutePosition_Size, //获取绝地位置和宽高
            getOuterHTML: getOuterHTML, //获取节点outerHTML
            setNodeDisplay: setNodeDisplay, //设置节点style.display
            show: showNode, //display:''
            hidden: hiddenNode, //display:'hidden'
            visible: visibleNode, //visibility:'visible'
            invisible: invisibleNode, //visibility:'hidden'
            setNodeCenter: setNodeCenter, //设置节点位置居中
            setBgImageCache: setBgImageCache, //强制ie缓存背景图
            setNodeUnselectable: setNodeUnselectable, //ie专用方法 设置节点为无法选择状态（无法夺取焦点）

            createElement: createElement,
            createImage: createImage,
            createDiv: createDiv,
            createShadow: createShadow, //方法创建阴影层 返回div element
            shadow: shadow, // 类 返回 控制阴影层的控制对象
            createMask: createMask, //创建遮罩层
            mask: mask, //类 返回 控制遮罩层的控制对象
            color: color, //类 返回颜色控制对象.
            regScript: regScript//注册脚本块.
        }
        // 动画控制对象.----------------------------------------------------------------------------------------------------------------

        this.Animation = animation;
        this.Animation.Tween = { //缓动算法..
            linear: function (t, b, c, d) { return c * t / d + b; },
            easeInQuad: function (t, b, c, d) {
                return c * (t /= d) * t + b;
            },

            easeOutQuad: function (t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },

            easeInOutQuad: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            },

            easeInCubic: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },

            easeOutCubic: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },

            easeInOutCubic: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            },

            easeInQuart: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },

            easeOutQuart: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },

            easeInOutQuart: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            },

            easeInQuint: function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },

            easeOutQuint: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },

            easeInOutQuint: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            },

            easeInSine: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },

            easeOutSine: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },

            easeInOutSine: function (t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            },

            easeInExpo: function (t, b, c, d) {
                return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },

            easeOutExpo: function (t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },

            easeInOutExpo: function (t, b, c, d) {
                if (t === 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },

            easeInCirc: function (t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },

            easeOutCirc: function (t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },

            easeInOutCirc: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            },

            easeInElastic: function (t, b, c, d) {
                var s = 1.70158; var p = 0; var a = c;
                if (t === 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * 0.3;
                if (a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },

            easeOutElastic: function (t, b, c, d) {
                var s = 1.70158; var p = 0; var a = c;
                if (t === 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * 0.3;
                if (a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
            },

            easeInOutElastic: function (t, b, c, d) {
                var s = 1.70158; var p = 0; var a = c;
                if (t === 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (0.3 * 1.5);
                if (a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
            },

            easeInBack: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },

            easeOutBack: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },

            easeInOutBack: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            },

            easeInBounce: function (t, b, c, d) {
                return c - animation.Tween.easeOutBounce(d - t, 0, c, d) + b;
            },

            easeOutBounce: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
                }
            },
            easeInOutBounce: function (t, b, c, d) {
                if (t < d / 2) return animation.Tween.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
                return animation.Tween.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
            }
        };
        this.Animation.style = function (target, oStyles, sTween, options) {
            if (!(target = ID(target))) throw new Error(ns + ':Animation.style(target,oStyles,options) target参数有错误');
            options = options || {};
            var s = {}, color = new ns.DOM.color, t, u, c = options.completeHandler;
            options.completeHandler = function () {
                c && c();
                this.dispose();
                target = null;
            }
            for (var o in oStyles) {
                u = ns.String.camelize(o);
                s[u] = [];
                switch (o) {
                    case 'opacity':
                        s[o][0] = getNodeAlpha(target);
                        s[o][1] = oStyles[o];
                        break;
                    case 'padding':
                    case 'margin':
                        t = target.style[o + 'Left'];
                        s[u][0] = getCurrentStyle(target, o + '-left');
                        target.style[o + 'Left'] = oStyles[o];
                        s[u][1] = getCurrentStyle(target, o + '-left');
                        target.style[o + 'Left'] = t;
                        break;
                    case 'border-width':
                        t = target.style.borderLeftWidth;
                        s[u][0] = getCurrentStyle(target, 'border-left-width');
                        target.style.borderLeftWidth = oStyles[o];
                        s[u][1] = getCurrentStyle(target, 'border-left-width');
                        target.style.borderLeftWidth = t;
                        break;
                    default:
                        t = target.style[u];
                        s[u][0] = getCurrentStyle(target, o);
                        target.style[u] = oStyles[o];
                        s[u][1] = getCurrentStyle(target, o);
                        target.style.borderLeftWidth = t;
                        break;
                }
            }
            oStyles = undefined;
            return new this(options).init().addAction(function () {
                for (var o in s) {
                    if (o == 'opacity') setNodeAlpha(target, this.tween(s[o][0], s[o][1], sTween));
                    else if (/[cC]olor$/.test(o)) _color.call(this, o);
                    else target.style[o] = this.tween(s[o][0], s[o][1], sTween) + 'px';
                }
            }).play();
            function _color(o) {
                if (!s[o][0]) {
                    var p;
                    while (p = target.parentNode) if (s[o][0] = getCurrentStyle(p, ns.String.uncamelize(o))) break;
                }
                !s[o][0] && (s[o][0] = '#fff');
                var from = [color.setColor(s[o][0]).getR(), color.getG(), color.getB()];
                var to = [color.setColor(s[o][1]).getR(), color.getG(), color.getB()];
                target.style[o] = color.setR(this.tween(from[0], to[0], sTween)).
                    setG(this.tween(from[1], to[1], sTween)).
                    setB(this.tween(from[2], to[2], sTween)).valueOf();
            }
        }

        //Event对象----------------------------------------------------------------------------------------------------------------------
        this.Event = {
            add: addEvent, //自定义注册事件侦听 attachEvent的代替方法。 修正所有已知的bug
            remove: removeEvent, //自定义删除事件侦听
            getEvent: getEvent, //获取事件对象
            getEventTarget: getEventTarget, //获取事件源对象
            getEventToElement: getEventToElement, //获取mouseout事件的toElement对象
            getEventFromElement: getEventFromElement, //获取mouseover事件的fromElement对象
            stopBubble: stopBubble, //阻止事件冒泡
            stopEventBehavior: stopEventBehavior //阻止浏览器默认行为
        }

        //JSON对象---------------------------------------------------------------------------------------------------------------------
        this.JSON = {
            toJSONString: toJSONString,
            parse: stringToJSON
        }
        //AJAX对象----------------------------------------------------------------------------------------------------------------------
        this.AJAX = AJAX;
        this.AJAX.createRequest = function (options) {
            return new this(options);
        }
        this.AJAX.createQueue = function (oXHR_aQueue) {//ajax队列类
            return new this.queue(oXHR_aQueue);
        }

        //XML对象----------------------------------------------------------------------------------------------------------------------

        this.XML = {
            parseDom: parseDom, //字符串转xml对象
            load: loadXML, //同步读取外部xml文件    
            selectNodes: selectNodes, //同ie的selectNodes方法.支持xpath
            selectSingleNode: selectSingleNode//同ie的selectSingleNodes方法.支持xpath
        }
        //QueryString-------------------------------------------------------------------------------------------------------------------
        this.QueryString = {
            getValue: queryString, //获取查询字符串中指定字段的值.
            objToQueryString: objToQueryString, //对象转查询字符串
            queryStringToObj: queryStringToObj//查询字符串转对象
        }
        //Cookie------------------------------------------------------------------------------------------------------------------------
        this.Cookie = {
            _specialList: ['expires', 'domain', 'path', 'secure', 'httpOnly'],
            setItem: setCookie,
            getItem: getCookie,
            remove: removeCookie,
            clear: clearCookie
        }


        //结束==========================================================================================================================

        //=============================================================================================================================
        //私有方法&类
        //=============================================================================================================================

        //对象操作---------------------------------------------------------------------------------------------------------------------
        function extend(oTo, oFrom, isOverride_fFilter, oThis) {//参数3 如果是boolean 则确定是否覆盖原来的属性.如果是函数则 自定义抄写规则.满足条件return true即可.
            if (isFunction(isOverride_fFilter)) {
                oThis = oThis || oTo; //默认的this引用指向 被扩展的对象oTo
                for (var o in oFrom) isOverride_fFilter.call(oThis, oFrom[o], o, oFrom, oTo) && (oTo[o] = oFrom[o]);
            }
            else if (isOverride_fFilter) {
                for (var o in oFrom) oTo[o] = oFrom[o];
            }
            else {
                for (var o in oFrom) !(o in oTo) && (oTo[o] = oFrom[o]);
            }
            return oTo;
        }

        function compare(obj1, obj2) {
            if (obj1 == null || obj2 == null) return (obj1 === obj2);
            return (obj1 == obj2 && obj1.constructor.toString() == obj2.constructor);
        }
        function clone(obj) {
            if (!isObject(obj)) return obj;
            var oTemp = {};
            if (isArray(obj)) {
                oTemp = [];
                for (var i = 0, len = obj.length; i < len; i++) oTemp.push(arguments.callee(obj[i]));
            }
            else {
                for (var o in obj) oTemp[o] = arguments.callee(obj[o]);
            }
            return oTemp;
        }
        function convertToArray(obj, fFilter, oThis) {
            if (obj == null) return [];
            if (isArray(obj)) return obj;
            if (isString(obj)) return ns.String.toArray(obj);
            if (!isObject(obj) && obj != '[object NodeList]') return [obj]; //safari下typeof nodeList 返回 'function'
            oThis = oThis || window;
            if (obj.hasOwnProperty) {//非ie浏览器的nodeList集合 都具备 hasOwnProperty方法 
                if (isNodeList(obj) || isArguments(obj)) {//ie arguments 可过
                    return fFilter ? arguments.callee._pushAsArray(obj, fFilter, oThis) : Array.prototype.slice.call(obj);
                }
            }
            else if (isNodeList(obj)) return arguments.callee._pushAsArray(obj, fFilter, oThis); //ie nodeList
            return arguments.callee._pushAsObject(obj, fFilter, oThis);
        }
        convertToArray._pushAsArray = function (obj, fFilter, oThis) {
            var aReturn = [];
            if (fFilter) for (var i = 0, len = obj.length; i < len; i++) fFilter.call(oThis, obj[i], i, obj) && aReturn.push(obj[i]);
            else for (var i = 0, len = obj.length; i < len; i++) aReturn.push(obj[i]);
            return aReturn;
        }
        convertToArray._pushAsObject = function (obj, fFilter, oThis) {
            var aReturn = [];
            if (fFilter) for (var o in obj) fFilter.call(oThis, obj[o], o, obj) && aReturn.push(obj[o]);
            else for (var o in obj) aReturn.push(obj[o]);
            return aReturn;
        }

        function isString(obj) {
            return Object.prototype.toString.call(obj) == '[object String]';
        }
        function isArray(obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        }
        function isNumber(obj) {
            return Object.prototype.toString.call(obj) == '[object Number]';
        }
        function isBoolean(obj) {
            return Object.prototype.toString.call(obj) == '[object Boolean]';
        }
        function isDate(obj) {
            return Object.prototype.toString.call(obj) == '[object Date]';
        }
        function isRegExp(obj) {
            return Object.prototype.toString.call(obj) == '[object RegExp]';
        }
        function isFunction(obj) {
            return (typeof obj == 'function');
        }
        function isUndefined(obj) {
            return (typeof obj == 'undefined');
        }
        function isNull(obj) {
            return (obj === null);
        }
        function isArguments(obj) {
            return isObject(obj) && obj.constructor.toString() == Object.toString() && 'length' in obj && 'callee' in obj;
        }
        function isObject(obj) {
            return (!!obj && typeof obj == 'object');
        }
        function isHash(obj) {
            return (!!obj && obj.constructor.toString() == hashTable);
        }
        function isDelegate(obj) {
            return (!!obj && obj.constructor.toString() == delegate);
        }

        function serializer(obj, _s) {//对象序列化方法  此方法不要对 window  document 使用...会导致过度递归...
            if (isNumber(obj) || isBoolean(obj) || isRegExp(obj) || isFunction(obj) || isNull(obj)) return obj;
            if (isString(obj) || isDate(obj)) return arguments.callee._format(obj);
            if (isElement(obj) || isDocumentFragment(obj)) return arguments.callee._format(getOuterHTML(obj).replace(/[\n|"]/g, function (m) {
                return m == '\n' ? '\\n' : '\\"';
            }));
            if (isTextNode(obj) || isAttribute(obj)) return arguments.callee._format(obj.nodeValue);
            var sReturn = '{';
            var end = '}'
            var n = '\n';
            var s = '    ';
            _s = _s ? _s + s : s;
            if (isArray(obj)) {
                sReturn = '[';
                end = ']'
                for (var i = 0, len = obj.length; i < len; i++) {
                    sReturn += n + _s + arguments.callee(obj[i], _s) + ',';
                }
                return ns.String.deleteEnd(sReturn, ',') + n + new String(_s).replace(s, '') + end;
            }
            if (isObject(obj)) {
                for (var o in obj) {
                    sReturn += n + _s + '"' + o + '":' + arguments.callee(obj[o], _s) + ',';
                }
                return ns.String.deleteEnd(sReturn, ',') + n + new String(_s).replace(s, '') + end;
            }
        }
        serializer._format = function (sData) {
            return isString(sData) ? '"' + sData + '"' : 'new Date(' + sData.valueOf() + ')';
        }

        function deSerializer(str) {
            return eval('(' + str + ')');
        }

        function hashTable(obj, isCloneObj) {//HashTable类
            if (isObject(obj)) {//判断是否为非null的对象
                if (!isCloneObj) this._oHashTable = obj;
                else this._oHashTable = clone(obj);
            }
            else this._oHashTable = {};
            this._count = 0;
            for (var o in this._oHashTable) this._count++;
        }
        hashTable.prototype = {
            constructor: hashTable,
            add: function (key, value, override) {//参数override 为ture 则同名的key会覆盖原有引用
                if (!isString(key)) return false;
                isUndefined(value) && (value = key);
                if (!this.contains(key)) this._count++;
                return override ? this._oHashTable[key] = value :
            key in this._oHashTable ? false : this._oHashTable[key] = value;
            },
            getItem: function (key) {//支持keyName 和index
                if (isString(key)) return this._oHashTable[key];
                else if (isNumber(key) && key >= 0 && key < this._count) {
                    var i = 0;
                    for (var o in this._oHashTable) {
                        if (i++ == key) return this._oHashTable[o];
                    }
                }
            },
            getList: function () {//获取key列表数组
                var aList = [];
                for (var o in this._oHashTable) aList.push(o);
                return aList;
            },
            contains: function (key) {//判断HashTable中是否包含该key 注：此方法只允许字符参数。不支持索引
                return key in this._oHashTable;
            },
            remove: function (key) {//根据key 删除引用 并返回该对象 参数可为字符串或 索引
                if (!this.getItem(key)) return false;
                if (isString(key)) {
                    try {
                        return this._oHashTable[key];
                    }
                    finally {
                        this._count--;
                        delete this._oHashTable[key];
                    }
                }
                else if (isNumber(key) && key >= 0 && key < this._count) {
                    var i = 0;
                    for (var o in this._oHashTable) {
                        if (i++ == key) {
                            try {
                                return this._oHashTable[o];
                            }
                            finally {
                                this._count--;
                                delete this._oHashTable[o]
                            }
                        }
                    }
                }
            },
            clear: function () {
                for (var o in this._oHashTable) delete this._oHashTable[o];
                this._count = 0;
            },
            getLength: function () {
                return this._count;
            },
            forEach: function (f, oThis) {//所有对象执行某方法
                if (!f) return;
                oThis = oThis || window;
                for (var key in this._oHashTable) {
                    f.call(oThis, this._oHashTable[key], key, this._oHashTable);
                }
                return this;
            },
            join: function (sJoinChar, sRelation) {
                sJoinChar = sJoinChar || ',';
                sRelation = sRelation || ':';
                var i = 0;
                if (ns.clientBrowser.is_ie6 && this._count > 15) {//ie6且 连接次数大于15 使用arrar.join来拼接
                    var sb = new stringBuffer;
                    for (var o in this._oHashTable) {
                        if (this._count == ++i) sJoinChar = '';
                        sb.add(o + sRelation + this._oHashTable[o] + sJoinChar);
                    }
                    return sb.toString();
                }
                var s = '';
                for (var o in this._oHashTable) {//w3c 直接用 +拼接
                    if (this._count == ++i) sJoinChar = '';
                    s += o + sRelation + this._oHashTable[o] + sJoinChar;
                }
                return s;
            },
            valueOf: function () {
                return this.join();
            },
            toString: function () {
                return this.join();
            }
        }

        //字符串------------------------------------------------------------------------------------------------------------------

        //数组方式 拼接字符串 .高效... 使用前先实例化.
        function stringBuffer(sFirstString) {
            this._aStr = [];
            if (isString(sFirstString)) this._aStr.push(sFirstString);
        }
        stringBuffer.prototype = {
            constructor: stringBuffer,
            add: function (str) {
                this._aStr.push(str);
                return this;
            },
            valueOf: function () {
                return this._aStr.join('');
            },
            toString: function () {
                return this._aStr.join('');
            }
        }
        //Math---------------------------------------------------------------------------------------------------------------------
        //减法运算的函数. 修正了 js的减法运算. 但小数位不得超过6位 否则toFixed 可能会舍去超出部分 除非前6位中至少有1位具备有效数字
        function sub(arg1, arg2) {
            var r1, r2, m, n;
            try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            //动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n));
        }
        //加法
        function add(arg1, arg2) {
            var r1, r2, m;
            try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2))
            return (arg1 * m + arg2 * m) / m
        }
        //乘法
        function mul(arg1, arg2) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try { m += s1.split('.')[1].length } catch (e) { }
            try { m += s2.split('.')[1].length } catch (e) { }
            return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
        }
        //除法
        function div(arg1, arg2) {
            var t1 = 0, t2 = 0, r1, r2;
            try { t1 = arg1.toString().split('.')[1].length } catch (e) { }
            try { t2 = arg2.toString().split('.')[1].length } catch (e) { }
            with (Math) {
                r1 = Number(arg1.toString().replace('.', ''))
                r2 = Number(arg2.toString().replace('.', ''))
                return (r1 / r2) * pow(10, t2 - t1);
            }
        }
        //从指定范围内获取随机整数
        function getRandomFrom(firstBound, LastBound) {
            var content = 1 + LastBound - firstBound;
            return Math.floor(Math.random() * content + firstBound);
        }

        //Function类函数------------------------------------------------------------------------------------------------------------

        //函数捆定...
        function bindFunction(obj, func) {
            if (!(obj = ID(obj))) throw new Error(ns + ':bindFunction 参数一必须为object对象 或有效的dom节点id字符串');
            return function () {
                func.apply(obj, arguments);
            }
        }
        function bindFunctionWithParams(obj, func, args) {
            if (!(obj = ID(obj))) throw new Error(ns + ':bindFunctionWithParams 参数一必须为object对象 或有效的dom节点id字符串');
            var arg = arguments;
            return function (args) {
                func.apply(obj, convertToArray(arg).concat(convertToArray(arguments)).slice(2));
            }
        }
        function bindAsEventHandler(obj, func, args) {
            if (!(obj = ID(obj))) throw new Error(ns + ':bindAsEventHandler 参数一必须为object对象 或有效的dom节点id字符串');
            var arr = convertToArray(arguments).slice(2, arguments.length);
            return function (e) {
                arr.unshift(e || window.event);
                func.apply(obj, arr);
            }
        }
        function delegate(f, aArgs, oThis, isRepeat) {
            this.isRepeat = !!isRepeat; //isRepeat当追加委托方法时。遇到重复方法时是否忽略 默认为忽略
            this._list = [];
            isFunction(f) && this.add(f, aArgs, oThis);
        }
        delegate.prototype = {
            constructor: delegate,
            add: function (f, aArgs, oThis) {
                if (isFunction(f)) {
                    oThis = oThis || window;
                    !isArray(aArgs) && (aArgs = []);
                    if (!this.isRepeat) {
                        if (!ns.Array.some(this._list, function (oHandler) { if (f == oHandler.f) return true })) {
                            this._list.push({ f: f, aArgs: aArgs, oThis: oThis });
                        }
                    }
                    else this._list.push({ f: f, aArgs: aArgs, oThis: oThis });
                }
                else throw new Error(ns + ':delegate.add方法参数 f 有误 应该为函数对象.');
                return this;
            },
            unshift: function (f, aArgs, oThis) {
                this._list.unshift((this.add(f, aArgs, oThis), this._list.pop()));
                return this;
            },
            remove: function (f, isAll) {//isAll 为true 则 删除 所有 于 参数f相同的 委托 否则只删除最后一个与f相同的委托 
                if (!isFunction(f)) throw new Error(ns + ':delegate.remove方法参数有误');
                if (isAll) this._list = ns.Array.filter(this._list, function (oHandler) { if (oHandler.f != f) return true; });
                else {
                    for (var i = this._list.length - 1; i >= 0; i--) {
                        if (this._list[i].f == f) {
                            this._list.splice(i, 1);
                            break;
                        }
                    }
                }
                return this;
            },
            clear: function () {
                this._list.length = 0;
                return this;
            },
            getLength: function () {
                return this._list.length;
            },
            execute: function () {
                if (this._list.length > 0) ns.Array.forEach(this._list, function (oHandler) { oHandler.f.apply(oHandler.oThis, oHandler.aArgs); });
                return this;
            }
        }


        //dom操作-------------------------------------------------------------------------------------------------------------------


        function isElement(node) {
            return isObject(node) && node.nodeType == 1;
        }
        function isAttribute(node) {
            return isObject(node) && node.nodeType == 2;
        }
        function isTextNode(node) {
            return isObject(node) && node.nodeType == 3;
        }
        function isNodeList(obj) {
            return !!obj && (!obj.hasOwnProperty || obj == '[object NodeList]' || obj == '[object StaticNodeList]' || obj == '[object HTMLCollection]') && 'length' in obj;
        }

        function isDocumentFragment(obj) {
            return isObject(obj) && obj.nodeType == 11;
        }
        function isXMLDocument(obj) {
            if (!isObject(obj)) return false;
            if (ns.clientBrowser.is_ie) return obj.nodeType == 9 && !('location' in obj);
            return obj.nodeType == 9 && (obj == '[object XMLDocument]' || obj == '[object Document]');
        }
        function $(sSelector_fFilter, oThis) {//选择器方法 半成品....不建议使用。性能低下。
            if (isString(sSelector_fFilter)) {
                if (document.querySelectorAll) return convertToArray(document.querySelectorAll(sSelector_fFilter));
                else {//类库的cssQuery接口未完成...
                    throw new Error(ns + '类库的cssQuery接口未完成...');
                }
            }
            else return getAllElements(sSelector_fFilter, oThis);
        }
        function ID() {//getElementByID()的代替函数. 并可同时接受多个对象参数.
            var len = arguments.length;
            if (len == 0) throw new Error(ns + ':ID方法至少要有个参数');
            var Elements = [];
            for (var i = 0; i < len; i++) {
                var Element = arguments[i];
                if (isString(Element)) Element = document.getElementById(Element);
                if (len == 1) {
                    try { return Element; }
                    finally { Element = null; }
                }
                Elements.push(Element);
            }
            try { return Elements; }
            finally { Elements = null; }
        }

        //自定义getElementsByClassName方法.参数ClassName-string类型 为要查找的classname,Tag - string类型 指定在某tag头 元素中查找. 全局查找则 为'*'
        // 参数 parent 限制要查找元素 的父元素 可以为string 也可以是Node对象 如果要全局查找 则可以使用document 对象
        function getElementsByClassName(ClassName, sTagName, parent) {
            parent = parent || document;
            if (!(parent = ID(parent))) throw new Error(ns + ':getElementsByClassName方法 参数 parent 对象不存在或传入id参数有错误.');
            sTagName = isString(sTagName) ? sTagName : '*';

            if (parent.getElementsByClassName && sTagName == '*') {//ff3.0+ opera9+ safari3+ chrome
                return convertToArray(parent.getElementsByClassName(ClassName));
            }
            if (parent.querySelectorAll) { //ie8+ safari3+ opear10+ ff3.1+ chrome
                return convertToArray(parent.querySelectorAll(sTagName + '[class*="' + ClassName + '"]'));
            }
            //查找所有匹配的标签
            var elements = (sTagName == '*' && parent.all) ? parent.all : parent.getElementsByTagName(sTagName);
            ClassName = ClassName.replace(/\-/g, '\\-');
            return convertToArray(elements, arguments.callee._filter, new RegExp('(^|\\s)' + ClassName + '(\\s|$)'));
        }
        getElementsByClassName._filter = function (item) {
            return this.test(item.className);
        }


        function getElementsByTagName(sTagName, parent) {
            parent = parent || document;
            if (!(parent = ID(parent))) throw new Error(ns + ':getElementsByTagName方法 参数 parent 对象不存在或传入id参数有错误.');
            sTagName = isString(sTagName) ? sTagName : '*';
            return convertToArray(parent.getElementsByTagName(sTagName));
        }


        function getElementsByName(sName, sTagName, parent) {
            parent = parent || document;
            if (!(parent = ID(parent))) throw new Error(ns + ':getElementsByName方法 参数 parent 对象不存在或传入id参数有错误.');
            sTagName = isString(sTagName) ? sTagName : '*';
            if (parent.querySelectorAll) { //ie8+ safari3+ opear10+ ff3.1+
                return convertToArray(parent.querySelectorAll(sTagName + '[name="' + sName + '"]'));
            }
            else if (!ns.clientBrowser.is_ie) {
                if (parent == '[object HTMLDocument]') {
                    if (sTagName == '*') return convertToArray(parent.getElementsByName(sName));
                    return convertToArray(parent.getElementsByName(sName), arguments.callee._tagFilter, sTagName);
                }
            }
            var elements = (sTagName == '*' && parent.all) ? parent.all : parent.getElementsByTagName(sTagName);
            return convertToArray(elements, arguments.callee._nameFilter, sName);
        }
        getElementsByName._nameFilter = function (item) {
            return item.getAttribute('name') == this;
        }
        getElementsByName._tagFilter = function (item) {
            return new String(item.tagName).toLowerCase() == new String(this).toLowerCase();
        }

        function getAllElements(fFilter, oThis) {//如果不指定fFilter则返回全部elements节点 指定fFilter则返回满足条件的节点
            oThis = oThis || window;
            var aReturn = getElementsByTagName();
            return fFilter ? ns.Array.filter(aReturn, fFilter, oThis) : aReturn;
        }

        function getFirstChildElement(node, fFilter, oThis) {//如果传了filter方法 则会返回第一满足该filter中条件的element节点
            if (!(node = ID(node))) throw new Error(ns + ':getFirstChildElement方法 参数有错误.');
            return _getElement(node, 'nextSibling', fFilter, oThis);
        }

        function getLastChildElement(node, fFilter, oThis) {//如果传了filter方法 则会返回最后一个满足该filter中条件的element节点
            if (!(node = ID(node))) throw new Error(ns + ':getlastChildElement方法 参数有错误.');
            return _getElement(node, 'previousSibling', fFilter, oThis);
        }

        function getChildElements(node, fFilter, oThis) {//如果传了filter方法 则返回符合条件的element子节点集合
            if (!(node = ID(node))) throw new Error(ns + ':getChildElements方法 参数有错误.');
            return _getElements(node, 'nextSibling', fFilter, oThis);
        }

        function getAllParentElements(node, fFilter, oThis) {//如果传了filter方法 则返回符合条件的所有祖先节点集合
            if (!(node = ID(node))) throw new Error(ns + ':getAllParentElements方法 参数有错误.');
            return _getElements(node, 'parentNode', fFilter, oThis);
        }
        function getAllChildElements(node, fFilter, oThis) {//获取全部子孙节点。如果传了filter则返回满足条件的子孙节点集合
            var aReturn = getElementsByTagName('*', node);
            return fFilter ? ns.Array.filter(aReturn, fFilter, oThis) : aReturn;
        }
        function getSiblingElements(node, fFilter, oThis) {//返回所有兄弟element集合.
            if (!(node = ID(node))) throw new Error(ns + ':getSiblingElements方法 参数有错误.');
            return getPreviousElements(node, fFilter, oThis).concat(getNextElements(node, fFilter, oThis));
        }
        function getPreviousElements(node, fFilter, oThis) {//返回本节点前的 所有element兄弟节点 并按离当前节点距离排序的数组.如果没有返回空数组
            if (!(node = ID(node))) throw new Error(ns + ':getPreviousElements方法 参数有错误.');
            return _getElements(node, 'previousSibling', fFilter, oThis);
        }
        function getNextElements(node, fFilter, oThis) {//返回本节点后的全部 elements兄弟节点
            if (!(node = ID(node))) throw new Error(ns + ':getNextElements方法 参数有错误.');
            return _getElements(node, 'nextSibling', fFilter, oThis);
        }

        function getPreviousElement(node) {//返回最临近本节点的前一个element对象 如果指定index则 从前面的兄弟节点中按dom中的顺序和index取节点.没有则返回null
            if (!(node = ID(node))) throw new Error(ns + ':getPreviousElement方法 参数有错误.');
            return _getElement(node, 'previousSibling');
        }
        function getNextElement(node) {
            if (!(node = ID(node))) throw new Error(ns + ':getNextElement方法 参数有错误.');
            return _getElement(node, 'nextSibling');
        }
        function _getElements(node, sPName, fFilter, oThis) {
            var aReturn = [];
            if (arguments.callee.callerr == getChildElements) node = node.firstChild;
            else node = node[sPName];
            oThis = oThis || window;
            while (node) {
                if (isElement(node) && (fFilter ? fFilter.call(oThis, node) : true)) aReturn.push(node);
                node = node[sPName];
            }
            return aReturn;
        }
        function _getElement(node, sPName, fFilter, oThis) {
            oThis = oThis || window;
            var caller = arguments.callee.caller;
            if (caller == getFirstChildElement) node = node.firstChild;
            else if (caller == getLastChildElement) node = node.lastChild;
            else node = node[sPName];
            while (node) {
                if (isElement(node) && (fFilter ? fFilter.call(oThis, node) : true)) {
                    try { return node; }
                    finally { node = null; }
                }
                node = node[sPName];
            }
            return null;
        }

        function insertBefore(newNode, tagetNode) {
            if (!(newNode = ID(newNode)) || !(tagetNode = ID(tagetNode))) throw new Error(ns + ':insertBefore方法 参数有错误.');
            tagetNode.parentNode.insertBefore(newNode, tagetNode);
        }
        function insertAdjacentHTML(node, sWhere, sHtml) {
            if (!(node = ID(node)) || node.nodeType != 1) throw new Error(ns + ':insertAdjacentHTML方法 参数有错误.');
            if ((sWhere = sWhere.tolowerCase()) == 'afterbegin' || sWhere == 'beforeend') {
                var sFilter = ['br', 'hr', 'img', 'input', 'link', 'col', 'meta', 'base', 'area'];
                if (ns.String.isInList(new String(node.tagName).toLowerCase(), sFilter)) return false;
            }
            if (node.insertAdjacentHTML) node.insertAdjacentHTML(sWhere, sHtml);
            else {
                var df, r = node.ownerDocument.createRange();
                switch (new String(sWhere).toLowerCase()) {
                    case "beforebegin":
                        r.setStartBefore(node);
                        df = r.createContextualFragment(sHtml);
                        node.parentNode.insertBefore(df, node);
                        break;
                    case "afterbegin":
                        r.selectNodeContents(node);
                        r.collapse(true);
                        df = r.createContextualFragment(sHtml);
                        node.insertBefore(df, node.firstChild);
                        break;
                    case "beforeend":
                        r.selectNodeContents(node);
                        r.collapse(false);
                        df = r.createContextualFragment(sHtml);
                        node.appendChild(df);
                        break;
                    case "afterend":
                        r.setStartAfter(node);
                        df = r.createContextualFragment(sHtml);
                        node.parentNode.insertBefore(df, node.nextSibling);
                        break;
                }

            }
        }

        // 在目标Node之后加入 新的Node.
        function insertAfter(newNode, targetNode) {
            if (!(newNode = ID(newNode)) || !(targetNode = ID(targetNode))) throw new Error(ns + ':insertAfter方法 参数有错误.');
            if (targetNode.nextSibling) insertBefore(newNode, targetNode.nextSibling);
            else targetNode.parentNode.appendChild(newNode);
        }
        //模拟 ie的 insertAdjacentHTML
        function insertAdjacentHTML(node, sWhere, sHtml) {
            if (!(node = ID(node)) || node.nodeType != 1) throw new Error(ns + ':insertAdjacentHTML方法 参数有错误.');
            if ((sWhere = sWhere.tolowerCase()) == 'afterbegin' || sWhere == 'beforeend') {
                var sFilter = ['br', 'hr', 'img', 'input', 'link', 'col', 'meta', 'base', 'area'];
                if (ns.String.isInList(new String(node.tagName).toLowerCase(), sFilter)) return false;
            }
            if (node.insertAdjacentHTML) node.insertAdjacentHTML(sWhere, sHtml);
            else {
                var df, r = node.ownerDocument.createRange();
                switch (new String(sWhere).toLowerCase()) {
                    case "beforebegin":
                        r.setStartBefore(node);
                        df = r.createContextualFragment(sHtml);
                        node.parentNode.insertBefore(df, node);
                        break;
                    case "afterbegin":
                        r.selectNodeContents(node);
                        r.collapse(true);
                        df = r.createContextualFragment(sHtml);
                        node.insertBefore(df, node.firstChild);
                        break;
                    case "beforeend":
                        r.selectNodeContents(node);
                        r.collapse(false);
                        df = r.createContextualFragment(sHtml);
                        node.appendChild(df);
                        break;
                    case "afterend":
                        r.setStartAfter(node);
                        df = r.createContextualFragment(sHtml);
                        node.parentNode.insertBefore(df, node.nextSibling);
                        break;
                }

            }
        }


        function appendFirstChild(newNode, parent) {
            if (!(newNode = ID(newNode)) || !(parent = ID(parent))) throw new Error(ns + ':appendFirstChild方法 参数有错误.');
            if (parent.firstChild) insertBefore(newNode, parent.firstChild);
            else parent.appendChild(newNode);
        }

        //删除指定节点 可同时指定多个 且可以为对象数组
        function removeNode(nodes) {
            for (var i = 0, len = arguments.length; i < len; i++) {
                if (!(arguments[i] = ID(arguments[i]))) throw new Error(ns + ':removeNode第' + i + '个参数有错误');
                if (isArray(arguments[i])) {
                    for (var j = 0, ln = arguments[i].length; j < ln; j++) {
                        if (!(arguments[i][j] = ID(arguments[i][j]))) throw new Error(ns + ':removeNode第' + i + '个参数数组中第' + j + '元素有错误');
                        arguments[i][j].parentNode.removeChild(arguments[i][j]);
                    }
                }
                else {
                    arguments[i].parentNode.removeChild(arguments[i]);
                }
            }
        }

        //删除指定Node下的 所有子节点
        function removeChildren(parent) {
            if (!(parent = ID(parent))) throw new Error(ns + ':removeChildren方法 参数 对象不存在或传入id参数有错误.');
            if ('innerHTML' in parent) {
                try { parent.innerHTML = ''; }
                catch (e) { arguments.callee._remove(parent); }
            }
            else arguments.callee._remove(parent);
        }
        removeChildren._remove = function (parent) {
            while (parent.firstChild) parent.firstChild.parentNode.removeChild(parent.firstChild);
        }

        //替换指定节点
        function replaceNode(newNode, targetNode) {
            if (!(newNode = ID(newNode)) || !(targetNode = ID(targetNode))) throw new Error(ns + ':replaceNode方法 参数 对象不存在或传入id参数有错误.');
            targetNode.parentNode.replaceChild(newNode, targetNode);
        }

        function replaceNodeHTML(sHTML, targetNode) {
            if (!(targetNode = ID(targetNode))) throw new Error(ns + ': replaceNodeHTML 方法参数有误');
            insertAdjacentHTML(targetNode, 'beforeBegin', sHTML);
            removeNode(targetNode);
        }

        function updateInnerHTML(element, sHTML) {
            if (!(element = ID(element)) || !isElement(element)) throw new Error(ns + 'updateInnerHTML 方法参数错误');
            try {
                element.innerHTML = sHTML;
            }
            catch (e) {
                var d = document.createElement('div');
                div.innerHTML = sHTML;
                var doc = document.createDocumentFragment();
                while (div.firstChild) doc.appendChild(div.firstChild);
                element.appendChild(doc);
                d = doc = undefined;
            }
        }



        //创建HtmlElement对象
        function createElement(sTagName, sID, styleString) {
            var element = document.createElement(sTagName);
            if (sID) element.id = sID;
            if (styleString) setNodeStyle(element, styleString);
            try {
                return element;
            }
            finally {
                element = null;
            }
        }
        //创建图片
        function createImage(src, alt, id, className, styleString) {
            var img = document.createElement('img');
            img.src = src;
            if (alt) img.title = img.alt = alt;
            if (id) img.id = id;
            if (className) img.className = className;
            if (styleString) setNodeStyle(img, styleString);
            try {
                return img;
            }
            finally {
                img = null;
            }
        }
        //创建div
        function createDiv(id, className, styleString) {
            var div = document.createElement('div');
            if (id) div.id = id;
            if (className) div.className = className;
            if (styleString) setNodeStyle(div, styleString);

            try {
                return div;
            }
            finally {
                div = null;
            }
        }

        function shadow(options) { //类 生成 阴影层控制对象
            if (!(this.target = ID(options.target))) throw new Error(ns + 'shaodw(options) options.target 参数有错误');
            this.element = null; //阴影节点
            this.options = options; //shadow 的设置对象
            this.isShow = true;
        }
        shadow.prototype = {
            constructor: shadow,
            show: function () {
                this.element.style.display = 'block';
                this.isShow = true;
                this.options.showHandler && this.options.showHandler.call(this);
                return this;
            },
            hidden: function () {
                this.element.style.display = 'none';
                this.isShow = false;
                this.hiddenHandler && this.options.hiddenHandler.call(this);
                return this;
            },
            follow: function () {//阴影层 按照原始offset 跟随其target的位置
                var pz = getAbsolutePosition_Size(this.target);
                this.element.style.left = pz.left - this.options.offsetLeft + 'px';
                this.element.style.top = pz.top - this.options.offsetTop + 'px';
                return this;
            },
            reset: function () {//从新根据目标节点的大小 修改shadow的尺寸.
                var pz = getAbsolutePosition_Size(this.target);
                this.element.style.width = pz.width + this.options.offsetLeft + this.options.offsetRight + 'px';
                this.element.style.height = pz.height + this.options.offsetTop + this.options.offsetBottom + 'px';
                return this;
            },
            init: function () {
                if (this._init) throw new Error(ns + ':shadow 类实例 的init初始化方法只能调用一次');
                this.element = createShadow(this.options);
                this._init = true;
                this.options.initHandler && this.options.initHandler.call(this);
                return this;
            }
        }
        //创建阴影层
        function createShadow(options) {  // 方法 options:{target, alpha, color, offsetTop, offsetRight, offsetBottom, offsetLeft,style}
            if (!(options.target = ID(options.target))) throw new Error(ns + ':createShadow 方法 参数有误');
            options.offsetTop = options.offsetTop || -2;
            options.offsetRight = options.offsetRight || 2;
            options.offsetBottom = options.offsetBottom || 2;
            options.offsetLeft = options.offsetLeft || -2;
            var pz = getAbsolutePosition_Size(options.target);
            var shadow = createElement('div');
            isString(options.style) && setNodeStyle(shadow, options.style);
            if (options.target.style.display == 'none') shadow.style.display = 'none';
            insertBefore(shadow, options.target);
            shadow.style.position = 'absolute';
            shadow.style.top = pz.top - options.offsetTop + 'px';
            shadow.style.left = pz.left - options.offsetLeft + 'px';
            shadow.style.width = pz.width + options.offsetLeft + options.offsetRight + 'px';
            shadow.style.height = pz.height + options.offsetTop + options.offsetBottom + 'px';
            setNodeAlpha(shadow, options.alpha || 8);
            shadow.style.backgroundColor = options.color || '#000000';
            try {
                return shadow;
            }
            finally {
                shadow = null;
            }
        }

        function mask(options) { //类 生成 遮罩层控制对象
            this.options = options || {};
            this.target = ID(this.options.target);
            this.element = null// 遮罩层 div元素对象
            this.isShow = true;
        }
        mask.prototype = {
            constructor: mask,
            show: function () {
                this.element.style.display = 'block';
                this.isShow = true;
                this.options.showHandler && this.options.showHandler.call(this);
            },
            hidden: function () {
                this.element.style.display = 'none';
                this.isShow = false;
                this.hiddenHandler && this.options.hiddenHandler.call(this);
            },
            follow: function () {// 按照原始offset 跟随其target的位置
                var pz = this.target ? getAbsolutePosition_Size(this.target) : { left: 0, top: 0 };
                this.element.style.left = pz.left + 'px';
                this.element.style.top = pz.top + 'px';
            },
            init: function () {
                if (this._init) throw new Error(ns + ':mask 类实例 的init初始化方法只能调用一次');
                this.element = createMask(this.target, this.options.isHidden, this.options.bgColor, this.options.alpha);
                this.options.isHidden && (this.isShow = false);
                this._init = true;
                this.options.initHandler && this.options.initHandler.call(this);
                return this;
            }
        }

        function createMask(options) {//方法 创建遮罩层.
            options = options || {};
            ns.Object.extend(options, { isShow: false, bgColor: '#000', alpha: 10 });
            var left, top, width, height;
            var display = options.isShow ? 'block' : 'none';
            if (!options.target) {
                width = Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth) + 'px';
                height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight) + 'px';
                top = 0;
                left = 0;
            }
            else {
                if (!(options.target = ID(options.target))) throw new Error(ns + ':createMask 方法 参数有误');
                var pz = getAbsolutePosition_Size(options.target);
                width = pz.width + 'px';
                height = pz.height + 'px';
                top = pz.top + 'px';
                left = pz.left + 'px';
            }
            var styleString = 'background-color:' + options.bgColor + ';display:' + display + ';position:absolute;' +
        'left:' + left + ';top:' + top + ';width:' + width + ';height:' + height + ';';
            var mask = createDiv(null, null, styleString);
            document.body.appendChild(mask);
            setNodeAlpha(mask, options.alpha);
            setNodeUnselectable(mask);
            addEvent(mask, 'mousedown', function (e) { stopBubble(e); stopEventBehavior(e) });
            try { return mask; }
            finally { mask = null; }
        }


        function domReady(handlers) {//注册domReady自定义事件.
            var len = arguments.length;
            for (var i = 0, arg = null; i < len; i++) {
                arg = arguments[i];
                if (isFunction(arg)) ns.DOM._readyHandlers.push(arg);
                else if (isArray(arg)) ns.DOM._readyHandlers = ns.DOM._readyHandlers.concat(arg);
            }
            if (!ns.DOM._isReady) {
                if (arguments.callee._isReadyChecked) return;
                if (document.addEventListener) document.addEventListener("DOMContentLoaded", domReady._callBack, false);
                else {
                    document.attachEvent && document.attachEvent("onreadystatechange", function () {
                        if (document.readyState === "complete") {
                            document.detachEvent("onreadystatechange", arguments.callee);
                            domReady._callBack();
                        }
                    });
                    if (document.documentElement.doScroll && window == window.top) (function () {
                        if (ns.DOM._isReady) return;
                        try { document.documentElement.doScroll("left"); }
                        catch (e) { return setTimeout(arguments.callee, 0); }
                        domReady._callBack();
                    })();
                }
                arguments.callee._isReadyChecked = true;
            }
            else domReady._callBack();
        }
        domReady._callBack = function () {
            ns.DOM._isReady = true;
            ns.Array.deleteRepeater(ns.DOM._readyHandlers);
            ns.Array.forEach(ns.DOM._readyHandlers, function (f) { f(); });
            ns.DOM._readyHandlers.length = 0;
        }

        function windowReady(handler, aArgs, othis) {
            if (ns.DOM.isWindowReady) handler.apply(othis, aArgs);
            else addEvent(window, 'load', handler, aArgs, othis, true);
        }


        function hasFocus(node) {//查看当前节点是否具有焦点
            if (!(node = ID(node))) throw new Error(ns + ':hasFocus方法 参数 对象不存在或传入id参数有错误.');
            return (node == node.ownerDocument.activeElement);
        }

        //查询dom树或某节点中是否包含目标节点
        function isNodeContains(targetNode, parentNode) {
            parentNode = parentNode || document.documentElement;
            if (!(targetNode = ID(targetNode)) || !(parentNode = ID(parentNode))) throw new Error(ns + ': isNodeContains 方法传入参数不是dom节点对象或有效的节点id')
            return parentNode.contains ? parentNode != targetNode && parentNode.contains(targetNode) : !!(parentNode.compareDocumentPosition(targetNode) & 16);
        }

        function setNodeTop(node, parent) {//设置节点的z-index为最高
            if (!(node = ID(node))) throw new Error(ns + ':setNodeTop 参数 有错误.');
            parent = ID(parent) || document.body;
            parent.appendChild(node);
        }
        //设置node对象的 style .styleString 为标准css属性 如background-color 而不是backgroundColor
        function setNodeStyle(node, styleString) {
            if (!(node = ID(node)) || !isString(styleString)) throw new Error(ns + ':setNodeStyle 参数 有错误.');
            if (ns.clientBrowser.is_ie) {//IE方法
                node.style.cssText = styleString;
            }
            else node.setAttribute('style', styleString); //w3c方法
        }
        //设置对象的class
        function setNodeClass(node, sClass) {
            if (!(node = ID(node)) || !isString(sClass)) throw new Error(ns + ':setNodeClass 参数 有错误.\n caller:' + arguments.callee.caller);
            if ('className' in node) return node.className = sClass;
            return (node.setAttribute('class', sClass), sClass);
        }
        function setNodePosition(node, left, top) {
            if (!(node = ID(node))) throw new Error(ns + ':setNodePosition方法 参数有误.');
            if (isNumber(left)) left = left + 'px';
            if (isNumber(top)) top = top + 'px';
            node.style.position = 'absolute';
            node.style.top = top;
            node.style.left = left;
        }

        function setNodeBGPosition(node, x, y) { //设置节点背景图位置
            if (!(node = ID(node))) throw new Error(ns + ':setNodeBGPosition方法 参数有误.');
            x != null && (node.style.backGroundPositionX = x);
            y != null && (node.style.backGroundPositionY = y);
        }
        //设置node对象的 透明度 //此为Xhtml1.0方法
        function setNodeAlpha(node, opacityValue) {//opacityValue 必须是0-100的整数
            if (!(node = ID(node)) || !isNumber(opacityValue)) throw new Error(ns + ':setNodeAlpha方法 参数有误.' + setNodeAlpha.caller);
            opacityValue = parseInt(opacityValue);
            opacityValue = opacityValue > 100 ? 100 : opacityValue < 0 ? 0 : opacityValue;
            if (!ns.clientBrowser.is_ie) node.style.opacity = opacityValue ? opacityValue / 100 : opacityValue == 0 ? 0 : 9 / 10; //支持 css3 浏览器 的方法
            else node.style.filter = 'Alpha(Opacity=' + (opacityValue ? opacityValue : opacityValue == 0 ? 0 : 90) + ')'; //xhtml1.0+ ie方法 //缺点，覆盖掉filter属性
        }
        //获取目标的透明度.
        function getNodeAlpha(node) {
            if (!(node = ID(node))) throw new Error(ns + ':getNodeAlpha方法 参数有误.');
            if (ns.clientBrowser.is_ie) {
                var val
                return (val = /Alpha\(Opacity=(\d*)\)/g.exec(node.style.filter)) ? parseInt(val[1]) : 100;
            }
            if (node.style.opacity) return node.style.opacity * 100;
            return 100;
        }

        //设置node对象的浮动
        function setNodeFloat(node, floatString) {
            if (!(node = ID(node)) || !isString(floatString)) throw new Error(ns + ':setNodeFloat方法 参数有误.');
            if (ns.clientBrowser.is_ie) node.style.styleFloat = floatString;
            else node.style.cssFloat = floatString;
        }
        function getNodeFloat(node) {
            if (!(node = ID(node))) throw new Error(ns + ':setNodeFloat方法 参数有误.');
            return getCurrentStyle(node, 'float');
        }
        //获取对象 currentStyle属性 参数 styleString 为标准css属性 如background-color(不包含';') 而不是backgroundColor
        function getCurrentStyle(node, styleString) {
            if (!(node = ID(node)) || !isString(styleString)) throw new Error(ns + ':getCurrentStyle方法 参数有误.');
            styleString = styleString.toLowerCase();
            var r = '';
            if (document.defaultView) {//w3c方法
                r = new String(node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyValue(styleString));
                if (r.indexOf('rgb(', 0) >= 0) {
                    var color = r;
                    r = '';
                    color.replace(/\d{1,3}/g, function (m) {
                        m = parseInt(m).toString(16);
                        r += m.length == 2 ? m : m = 0 + m;
                    });
                    return '#' + r;
                }
                else if (/^\d+/.test(r)) return parseInt(r);
            }
            else if (node.currentStyle) {//ie方法
                if (styleString == 'float') return ns.String.isInList(node.currentStyle.position, ['absolute', 'relative']) ? 'none' : node.currentStyle.styleFloat;
                var b = false;
                if (/^\d+/.test(r = node.currentStyle[styleString = ns.String.camelize(styleString)])) {
                    if (!(b = /^font/.test(styleString)) || (b && r.match(/\D+$/)[0] != '%')) {
                        var left = node.style.left, rsLeft = node.runtimeStyle.left;
                        node.runtimeStyle.left = node.currentStyle.left;
                        node.style.left = r || 0;
                        r = node.style.pixelLeft;
                        node.style.left = left;
                        node.runtimeStyle.left = rsLeft;
                        return parseInt(r);
                    }
                    else if (node != document.body) return Math.floor(parseInt(r) * (parseInt(getCurrentStyle(document.body, 'font-size')) || 16) / 100);
                    else return Math.floor(parseInt(r) * 16 / 100);
                }
                if (styleString == 'width') return node.clientWidth - getCurrentStyle(node, 'padding-left') - getCurrentStyle(node, 'padding-right');
                if (styleString == 'height') return node.clientHeight - getCurrentStyle(node, 'padding-top') - getCurrentStyle(node, 'padding-bottom');
            }
            if (ns.String.isInList(r, ['transparent', 'auto'])) return '';
            return r;
        }

        function getNodeFloatArea(node, sMode) {
            if (!(node = ID(node))) throw new Error(ns + ':getNodeFloatArea(node,sMode) node参数有错误');
            var floatWidth = getCurrentStyle(node, 'padding-left') +
                        getCurrentStyle(node, 'padding-right') +
                        getCurrentStyle(node, 'border-left-width') +
                        getCurrentStyle(node, 'border-right-width');
            var floatHeight = getCurrentStyle(node, 'padding-top') +
                        getCurrentStyle(node, 'padding-bottom') +
                        getCurrentStyle(node, 'border-top-width') +
                        getCurrentStyle(node, 'border-bottom-width');
            switch (sMode) {
                case 'width':
                    return floatWidth;
                case 'height':
                    return floatHeight;
                case undefined:
                    return { width: floatWidth, height: floatHeight };
                default:
                    throw new Error(ns + ':getNodeFloatArea(node,sMode) sMode参数只能是 "width"或 "height" 或 不传');
            }
        }

        //获取 node对象的 绝对位置 
        function getAbsolutePosition_Size(node, display) {
            if (!(node = ID(node))) throw new Error(ns + ':getAbsOlutePosition_Size方法 参数有误.');
            var isNone = false;
            if (getCurrentStyle(node, 'display') == 'none') {
                node.style.display = display || '';
                var _node = node;
                isNone = true;
            }
            var offsetWidth = node.offsetWidth;
            var offsetHeight = node.offsetHeight;
            var offsetTop, offsetLeft;
            offsetTop = node.offsetTop;
            offsetLeft = node.offsetLeft;
            while (node = node.offsetParent) {
                offsetTop += node.offsetTop;
                offsetLeft += node.offsetLeft;
            }
            if (isNone) _node.style.display = 'none';
            _node = null;
            return { left: offsetLeft, top: offsetTop, width: offsetWidth, height: offsetHeight }
        }

        //获取dom node 的outhtml 模拟ie专有方法 node.outerHTML
        function getOuterHTML(root, _isDocumentFragment) {
            if (!(root = ID(root))) throw new Error(ns + ':getOuterHTML方法 参数有误.');
            var html = "";
            if (root.outerHTML) return root.outerHTML; //ie
            else if (ns.clientBrowser.is_ie && root.nodeType == 11) {
                for (var i = 0; i < root.childNodes.length; i++) {
                    html += root.childNodes[i].nodeType == 1 ? root.childNodes[i].outerHTML : root.childNodes[i].data;
                }
                return html;
            }
            if (window.XMLSerializer) {  //串行化xml dom对象.实现outerHTML
                var xml = new XMLSerializer();
                html = xml.serializeToString(root);
                xml = null;
                return html;
            }

            //不支持outerHTML 又不支持xmlSerializer xml核心方法 则 使用递归+循环遍历+节点类型判断 获取outerHTML
            var moz_check = /_moz/i;
            switch (root.nodeType) {
                case Node.ELEMENT_NODE:
                case Node.DOCUMENT_FRAGMENT_NODE:
                    var closed;
                    if (!_isDocumentFragment) {
                        closed = !root.hasChildNodes();
                        html = '<' + root.tagName.toLowerCase();
                        var attr = root.attributes;
                        for (var i = 0; i < attr.length; ++i) {
                            var a = attr.item(i);
                            if (!a.specified || a.name.match(moz_check) || a.value.match(moz_check)) {
                                continue;
                            }
                            html += " " + a.name.toLowerCase() + '="' + a.value + '"';
                        }
                        html += closed ? " />" : ">";
                    }
                    for (var i = root.firstChild; i; i = i.nextSibling) {
                        html += getOuterHTML(i);
                    }
                    if (!_isDocumentFragment && !closed) {
                        html += "</" + root.tagName.toLowerCase() + ">";
                    }
                    break;

                case Node.TEXT_NODE:
                    html = root.data;
                    break;
            }
            return html;
        }

        //设置Node 对象的css-style- display 属性 如 无参数2。 则每次调用 node 状态会在none block 之间转换.有参数2 则转换到指定状态

        function setNodeDisplay(node, display_value) {
            if (!(node = ID(node))) throw new Error(ns + ':setNodeDisplay方法 参数有误.');
            if (isString(display_value)) return node.style.display = display_value;

            if (node.style.display != 'none') return node.style.display = 'none';
            return node.style.display = 'block';
        }
        function showNode(node) {
            if (!(node = ID(node))) throw new Error(ns + ':showNode方法 参数有误.');
            node.style.display = 'block';
        }
        function hiddenNode(node) {
            if (!(node = ID(node))) throw new Error(ns + ':hiddenNode方法 参数有误.');
            node.style.display = 'none';
        }
        function invisibleNode(node) {
            if (!(node = ID(node))) throw new Error(ns + ':invisibleNode方法 参数有误.');
            node.style.visibility = 'hidden';
        }
        function visibleNode(node) {
            if (!(node = ID(node))) throw new Error(ns + ':visibleNode方法 参数有误.');
            node.style.visibility = 'visible';
        }
        //设置node 的绝对位置- 水平 垂直居中 于parentNode.如无parentNode 则居中于documentElement.clientWidth,clientHeight 
        function setNodeCenter(node, parentNode) {
            if (!(node = ID(node))) throw new Error(ns + ':setNodeCenter方法 参数node有误.');
            parentNode = ID(parentNode) || document.documentElement;
            var top = 0, left = 0, parentOffsetLeft = 0, parentOffsetTop = 0;
            if (parentNode == document.documentElement) {
                top = parentNode.scrollTop;
                left = parentNode.scrollLeft;
            }
            else {
                var pz = getAbsolutePosition_Size(parentNode);
                parentOffsetLeft = pz.left;
                parentOffsetTop = pz.top;
            }
            setNodeTop(node);
            node.style.position = 'absolute';
            node.style.left = parentOffsetLeft + left + (parentNode.clientWidth - node.offsetWidth) / 2 + 'px';
            node.style.top = parentOffsetTop + top + (parentNode.clientHeight - node.offsetHeight) / 2 + 'px';
        }

        //解决ie6背景不缓存. 产生闪烁的bug
        function setBgImageCache() {
            if (ns.clientBrowser.is_ie6 && !arguments.callee._cache) {
                document.execCommand("BackgroundImageCache", false, true);
                arguments.callee._cache = true;
            }
        }
        //阻止对象被选择..针对ie 参数可以是1个或多个对象  也可以是1个或多个数组
        function setNodeUnselectable(nodes) {
            if (!ns.clientBrowser.is_ie) return;
            for (var i = 0, len = arguments.length; i < len; i++) ID(arguments[i]).setAttribute('unselectable', 'on');
        }

        function color(sColor_R, G, B) {//类 颜色控制对象
            this._list = [];
            var len = arguments.length;
            if (len == 1) this.setColor(sColor_R);
            else if (len == 0 || len == 3) this.setColor(sColor_R, G, B);
            else throw new Error(ns + ':DOM.color(sColor_R,G,B) 参数 有错误');
        }
        color._r = function (m) {
            return m + m;
        };
        color.prototype = {
            constructor: color,
            _set: function (v) {
                if (isString(v) && isNaN(v = parseInt(v, 16))) throw new Error(ns + ':DOM.color 对象的 _set方法 参数必须是number或16进制字符串');
                return v > 255 ? 255 : v < 0 ? 0 : v;
            },
            setColor: function (sColor_R, G, B) {
                if (arguments.length == 1) {
                    sColor_R = new String(sColor_R).replace('#', '');
                    sColor_R.length == 3 && (sColor_R = sColor_R.replace(/./g, color._r));
                    sColor_R = parseInt(sColor_R.toString(), 16);
                    this._list[0] = (sColor_R & 0xff0000) >>> 16;
                    this._list[1] = (sColor_R & 0x00ff00) >>> 8;
                    this._list[2] = sColor_R & 0x0000ff;
                }
                else {
                    this.setR(sColor_R || 0);
                    this.setG(G || 0);
                    this.setB(B || 0);
                }
                return this;
            },
            setR: function (sHex_nValue) {
                this._list[0] = this._set(sHex_nValue);
                return this;
            },
            setG: function (sHex_nValue) {
                this._list[1] = this._set(sHex_nValue);
                return this;
            },
            setB: function (sHex_nValue) {
                this._list[2] = this._set(sHex_nValue);
                return this;
            },
            getHexR: function () { var r = this._list[0].toString(16); return r.length == 2 ? r : '0' + r; },
            getHexG: function () { var r = this._list[1].toString(16); return r.length == 2 ? r : '0' + r; },
            getHexB: function () { var r = this._list[2].toString(16); return r.length == 2 ? r : '0' + r; },
            getR: function () { return this._list[0]; },
            getG: function () { return this._list[1]; },
            getB: function () { return this._list[2]; },
            reverse: function () {//颜色反向
                this._list[0] = 255 - this._list[0];
                this._list[1] = 255 - this._list[1];
                this._list[2] = 255 - this._list[2];
                return this.toString();
            },
            valueOf: function () { return '#' + this.getHexR() + this.getHexG() + this.getHexB(); },
            toString: function () { return this.valueOf(); }
        }


        function animation(options) {//动画类 
            //options.action方法 为每桢播放动作  传入后会自动转成 多播委托. 可随时 add remove clear .或在实例化后 this.addAction(function) 来添加至少一个动作
            //options.interval(动画间隔 默认为20ms) options.frames(动画桢数默认为50) options.repeat (重复播放动画次数.默认为0)
            this.options = options || {};
        }
        animation.prototype = {
            constructor: animation,
            _createAction: function (options) {
                this._action = (typeof options.action == 'function' || options.action == null) ? ns.Function.createDelegate(options.action, options.actionArgs, this) :
                    options.action;
                if (this._action.constructor != delegate) throw new Error(ns + ':Animation(options) options.action 必须为函数 委托类型');
            },
            _play: function () {//timeOut回调.
                if (this._aspect == 1) {
                    if (this._currentFrame <= this.frames) {
                        this._action.execute();
                        this.playingHandler && this.playingHandler();
                        this._currentFrame++;
                        this._playing && (this._timer = window.setTimeout(ns.Function.bind(this, this._play), this.interval));

                    }
                    else if (this._repeat++ < this.repeat) {
                        this._currentFrame = 1;
                        this._playing && (this._timer = window.setTimeout(ns.Function.bind(this, this._play), this.interval));
                    }
                    else {
                        this._playing = false;
                        this.completeHandler && this.completeHandler();
                    }
                }
                else {
                    if (this._currentFrame >= 1) {
                        this._action.execute();
                        this.playingHandler && this.playingHandler();
                        this._currentFrame--;
                        this._playing && (this._timer = window.setTimeout(ns.Function.bind(this, this._play), this.interval));
                    }
                    else if (this._repeat++ < this.repeat) {
                        this._currentFrame = this.frames;
                        this._playing && (this._timer = window.setTimeout(ns.Function.bind(this, this._play), this.interval));
                    }
                    else {
                        this._playing = false;
                        this.completeHandler && this.completeHandler();
                    }
                }
            },
            unshiftAction: function (f, aArgs, oThis) {
                this._action.unshift(f, aArgs, oThis || this);
                return this;
            },
            addAction: function (f, aArgs, oThis) {
                this._action.add(f, aArgs, oThis || this);
                return this;
            },
            removeAction: function (f) {
                this._action.remove(f);
                return this;
            },
            clearAction: function () {
                this._action.clear();
                return this;
            },
            dispose: function () {
                for (var o in this) this[o] = undefined;
            },
            reset: function (options) {
                options = options || {};
                this._playing && (this._playing = false) || window.clearTimeout(this._timer);
                (this.repeat = options.repeat || this.repeat || 0) < 0 && (this.repeat = 0); //动画重复播放的次数
                this._repeat = 0;
                this._currentFrame = 1; //私有属性 当前桢
                this.interval = options.interval || this.interval || 20; //桢之间的间隔时间
                (this.frames = options.frames || this.frames || 50) < 2 && (this.frames = 2); //总桢数.
                this._aspect = 1; //动画播放方向 参数 1为向前 -1位倒放.
                this._playing = false; //当前动画是否播放状态.
                this.initHandler = options.initHandler || this.initHandler; //初始化回调
                this.playHandler = options.playHandler || this.playHandler; //播放时回调
                this.stopHandler = options.stopHandler || this.stopHandler; //停止时回调
                this.playingHandler = options.playingHandler || this.playingHandler; //播放中回调
                this.completeHandler = options.completeHandler || this.completeHandler; //播放完毕回调
                (this.resetHandler = options.resetHandler || this.resetHandler) && this.resetHandler(); //重置回调
                return this;
            },
            play: function () { //播放动画
                if (this._playing) return this;
                this._playing = true;
                this._play();
                this.playHandler && this.playHandler();
                return this;
            },
            stop: function () {//停止动画
                this._timer && window.clearTimeout(this._timer);
                this._playing = false;
                this.stopHandler && this.stopHandler();
                return this;
            },
            goToAndPlay: function (frame) {//跳到指定桢 播放动画
                if (!isNumber(frame)) throw new Error(ns + ':animation 对象的 goToAndPlay方法 参数必须为number类型');
                if (frame < 1) frame = 1;
                else if (frame > this.frames) frame = this.frames;
                this._currentFrame = frame;
                this._timer && this._playing && window.clearTimeout(this._timer) || (this._playing = false);
                return this.play();
            },
            goToAndStop: function (frame) {//跳到指定桢 并停止动画
                if (!isNumber(frame)) throw new Error(ns + ':animation 对象的 goToAndStop方法 参数必须为number类型');
                this.stop();
                if (frame < 1) frame = 1;
                else if (frame > this.frames) frame = this.frames;
                this._currentFrame = frame;
                this._action.execute();
                this.playingHandler && this.playingHandler();
                return this;
            },
            concat: function (fHandler_oAni, nFrame) {//动画联接函数,参数1可以是函数或 Animation对象 ,nFrame 即指定第桢 执行连接函数或 联结动画.默认为最后一桢
                if (!fHandler_oAni || fHandler_oAni == this) throw new Error(ns + ':Animation对象的concat(fHandler_oAni, nFrame)方法 fHandler_oAni必须为函数或其他Animation对象');
                nFrame = nFrame || this.frames;
                if (typeof fHandler_oAni == 'function') this.addAction(function () { this.getCurrentFrame() == nFrame && fHandler_oAni.call(this); });
                else if (fHandler_oAni.constructor == animation) {
                    this.addAction(function () {
                        this.getCurrentFrame() == nFrame && (fHandler_oAni._init ? fHandler_oAni.play() : fHandler_oAni.init().play());
                    });
                }
                return this;
            },
            setAspect: function (sAspect_nAspect) {//设置动画的播放的方向 1 -1 或 'forward' 'back'
                if (isString(sAspect_nAspect)) this._aspect = sAspect_nAspect == 'back' ? -1 : 1;
                else if (isNumber(sAspect_nAspect) && (this._aspect == 1 || this._aspect == -1)) this._aspect = sAspect_nAspect;
                else this._aspect = 1;
                return this;
            },
            getAspect: function () {
                return this._aspect;
            },
            getCurrentFrame: function () {
                var f = this._currentFrame;
                return f > this.frames ? this.frames : f < 1 ? 1 : f;
            },
            tween: function (from, to, tweenType, s) {//tweenType 为Tween函数名 from为动画启始点值 to为终点值.s为 当函数名为easeIn[Out][InOut]Back时 的参数
                return this._currentFrame <= 1 ? from : this._currentFrame >= this.frames ? to :
            Math.round((animation.Tween[tweenType] || animation.Tween.linear)(this._currentFrame, form = parseInt(from), parseInt(to) - from, this.frames));
            },
            init: function () {
                if (this._init) throw new Error(ns + ':DOM.animation(options) 对象的init方法只能调用一次');
                this._init = true;
                this._createAction(this.options);
                this.reset(this.options);
                this.options = undefined;
                this.initHandler && this.initHandler();
                return this;
            }
        };

        //脚本块注册方法参数1是url,参数2是脚本加载后要执行的方法. 
        function regScript(options) {
            var _doc = document.getElementsByTagName('head')[0];
            var js = document.createElement('script');
            js.setAttribute('type', 'text/javascript');
            js.setAttribute('src', options.url);
            js.setAttribute('charset', options.charset || 'utf-8');
            _doc.appendChild(js);
            if (isUndefined(js.onreadystatechange)) js.onload = options.loadHandler || null;
            else {//IE
                js.onreadystatechange = function () {
                    /loaded|complete/.test(js.readyState) && options.loadHandler && options.loadHandler();
                }
            }
        }


        //event类---------------------------------------------------------------------------------------------------------------------

        //不使用 attachEvent addEventListener 添加事件侦听 修正所有已知的bug 。允许addEvent前 节点已具备该事件的原始注册方式.
        function addEvent(node, eType, fHandler, aArgs, oThis, isRepeat) {//oThis 默认指向 事件注册对象node,isRepeat 是否忽略重复注册.默认忽略
            if (!(node = ID(node))) throw new Error('addEvent 方法 参数node 有错误');
            !isArray(aArgs) && aArgs != null && (aArgs = []);
            oThis = oThis || node;
            if (node['on' + eType] && node[eType + '_delegate'] == null) {
                node['on' + eType + 'oldHandler'] = node['on' + eType];
                node['on' + eType] = null;
            }
            node[eType + '_delegate'] == null && (node[eType + '_delegate'] = new delegate);
            node[eType + '_delegate'].isRepeat = !!isRepeat;
            node[eType + '_delegate'].add(fHandler, aArgs, oThis);
            if (!node['on' + eType]) node['on' + eType] = function (e) {
                e = getEvent(e);
                e.stopBehavior = addEvent._stopBehavior;
                e.stopBubble = addEvent._stopBubble;
                if (node['on' + eType + 'oldHandler']) {
                    var rv = xuzhiwei.clientBrowser.is_ie ? node['on' + eType + 'oldHandler'].call(node) : node['on' + eType + 'oldHandler'].call(node, e);
                }
                ns.Array.forEach(node[eType + '_delegate']._list, function (item) {//把event作为arguments[0]传进去
                    item.f.apply(item.oThis, [e].concat(item.aArgs));
                });
                if (rv === true || rv === false) return rv;
            }
        }
        addEvent._stopBehavior = function () {
            stopEventBehavior(this);
        }
        addEvent._stopBubble = function () {
            stopBubble(this);
        }

        function removeEvent(node, eType, fHandler, isAll) {
            if (!(node = ID(node))) throw new Error('removeEvent 方法 参数node 有错误');
            if (node['on' + eType + 'oldHandler'] == fHandler) return node['on' + eType + 'oldHandler'] = undefined;
            if (!node[eType + '_delegate']) return;
            node[eType + '_delegate'].remove(fHandler, !!isAll);
            if (node[eType + '_delegate']._list.length == 0) {
                node[eType + '_delegate'] = undefined;
                node['on' + eType] = node['on' + eType + 'oldHandler'] ? node['on' + eType + 'oldHandler'] : null;
            }
        }

        //获取事件对象
        function getEvent(e) {
            return e || window.event;
        }

        //获取事件源.
        function getEventTarget(e) {
            e = getEvent(e);
            var target = e.target || e.srcElement;
            if (target.nodeType == 3) return target.parentNode; //兼容safari浏览器
            try {
                return target;
            }
            finally {
                target = null;
            }
        }
        //获取mouseout的 toElement 
        function getEventToElement(e) {
            e = getEvent(e);
            return e.toElement || e.relatedTarget;
        }
        //获取over 的 fromElement 
        function getEventFromElement(e) {
            e = getEvent(e);
            return e.fromElement || e.relatedTarget;
        }

        //取消事件冒泡
        function stopBubble(e) {
            e = getEvent(e);
            if (e && e.stopPropagation) e.stopPropagation();
            else e.cancelBubble = true;
        }
        //阻止浏览器事件的默认行为 
        function stopEventBehavior(e) {
            e = getEvent(e);
            if (e && e.preventDefault) e.preventDefault();
            else e.returnValue = false;
        }
        // AJAX 类--------------------------------------------------------------------------------------------------------------------------------------
        function AJAX(options) { //AJAX类修改中。 暂时无法使用........................................
            this._random = ''; //randomFieldForNoCache
            this._randomValue = '';
            this._timer = null; //timeout时间戳.
            this._isCanceled = false; //是否已取消异步请求.opera浏览器需在_callback中判断

            this.url = options.url; //请求路径
            this.sender = options.sender || AJAX.sneder;
            this.isASync = isUndefined(options.isAsync) ? true : !!options.isAsync; //是否异步发起请求
            this.noCache = isUndefined(options.noCache) ? true : !!options.noCache; //返回的请求页是否缓存
            this.params = sParams || '', //请求参数
        this.timeOut = options.timeO || 30000; //异步请求超时时间
            this.loadingHandler = this._defaultLoadingHandler; //上面三种状态 统一的回调方法
            this.firstHandler = null; //对象已建立，尚未调用send方法时的 回调方法
            this.secondHandler = null; //send方法已调用，但是当前的状态及http头未知状态的 回调方法
            this.thirdHandler = null; //接收响应收数据 状态的回调方法
            this.completeHandler = this._defaultHandler; //请求完成后的回调方法
            this.errorHandler = this._errorHandler; //xhr.statue!=200时的回调方法
            this.cancelHandler = this._cancelHandler; //取消异步请求后的回调方法
            this.cancelMsg = '异步请求被取消...'; //取消异步请求后的默认提示信息
            this.timeOutHandler = this._timeOutHandler; //异步请求超时的回调方法
            this.timeOutMsg = 'xuzhiwei=异步请求操作超时.请稍候再式'; //超时的默认提示信息
            this.method = sMethod || 'get', //请求方式
        this.loadingMsgBox = msgBox; //显示loading信息的容器节点
            this.completeMsgBox = msgBox; //异步请求完成后.显示请求数据的容器节点
            this.errorMsgBox = msgBox; //显示异步请求异常信息的的容器节点
            this.errorMsg = '应用程序错误,请稍后再试...'; //默认的错误信息提示
            this.loading = '加载中...', //请求过程中显示的信息.
        this.headers = new hashTable(); //头信息 哈西表
            this.level = 0; //异步请求 队列优先级.默认中等.

            //        if (isOption) { //如果sURL_oOptions 是对象则 重新给options赋值
            //            for (var s in sURL_oOptions) {
            //                this.options[s] = sURL_oOptions[s];
            //            }
            //            this.options.loadingMsgBox = ID(this.options.loadingMsgBox);
            //            this.options.completeMsgBox = ID(this.options.completeMsgBox);
            //            this.options.errorMsgBox = ID(this.options.errorMsgBox);
            //            sURL_oOptions = undefined;
            //        }
            this.XHR = this._createXHR();
        }
        AJAX.createXHR = function () {//静态方法 创建XHR对象
            var xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest;
                if (xhr.readyState == null && xhr.addEventListener) {//早期的ff中 xhr对象没有readyState属性
                    xhr.readyState = 0;
                    xhr.addEventListener("load", function () {
                        xhr.readyState = 4;
                        if (typeof xhr.onreadystatechange == "function") {
                            xhr.onreadystatechange();
                        }
                    }, false);
                }
            }
            else if (window.ActiveXObject) {
                var aName = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
                for (var i = 0; i < 6; i++) {
                    try {
                        xhr = new ActiveXObject(aName[i]);
                        break;
                    }
                    catch (e) { }
                }
            }

            return xhr;
        }
        AJAX.sender = 'AJAX_' + ns.toString(); //默认的sender
        AJAX.loadingIMG = '<img src="../images/loading.gif" style="border:0px;">';
        AJAX._handlerList = ['loadingHandler', 'firstHandler', 'secondHandler', 'thirdHandler', 'completeHandler', 'errorHandler', 'cancelHandler', 'timeOutHandler'];
        AJAX.enums = {
            method: { Get: 'get', Post: 'post', Head: 'head', Put: 'put', Delete: 'delete', Options: 'options' },
            handlerList: { 'loadingHandler': 0, 'firstHandler': 1, 'secondHandler': 2, 'thirdHandler': 3, 'completeHandler': 4, 'errorHandler': -1, 'cancelHandler': -2, 'timeOutHandler': -3 },
            postContentType: 'application/x-www-form-urlencoded'
        }
        AJAX._className = 'MXJIA_AJAX_CLASS';
        AJAX.prototype = {
            constructor: AJAX,
            _errorHandler: function (msg, status) {
                this.setErrorMsgBoxHTML(this.options.errorMsg + '错误代码:' + status);
            },
            _defaultLoadingHandler: function () {
                this.setLoadingMsgBoxHTML(this.options.loading);
            },
            _defaultHandler: function (text) {
                if (!this.options.completeMsgBox) return;
                this.setCompleteMsgBoxHTML(text);
            },
            _cancelHandler: function (sOriginalMsgMsg, cancelMsg) {
                this.setErrorMsgBoxHTML(cancelMsg);
            },
            _timeOutHandler: function (sOriginalMsgMsg, sTimeOutMsg) {
                this.setErrorMsgBoxHTML(sTimeOutMsg);
            },
            _createXHR: AJAX.createXHR,
            _callBack: function () {//封装handler
                if (this._isCanceled) return;
                var readyState = this.XHR.readyState;
                if (readyState > 0 && readyState < 4) {
                    if (this.options[AJAX._handlerList[readyState]]) this.options[AJAX._handlerList[readyState]].call(this, readyState);
                    if (this.options.loadingHandler) this.options.loadingHandler.call(this, readyState);
                }
                else if (readyState == 4) {
                    this._removeTimer(); //超时前进入异步请求完成。则清除时间戳.
                    var status = this.XHR.status;
                    if (this.options.method != 'head') {
                        if (status == 200 || status == 304) {
                            if (this.options.completeHandler) {
                                switch (this.getMimeType()) {
                                    case '':
                                    case 'text/plain':
                                    case 'text/html':
                                    case 'text/javascript':
                                    case 'application/javascript':
                                        this.options.completeHandler.call(this, this.XHR.responseText);
                                        if (ns.clientBrowser.is_ie) this.XHR.abort(); //ie7 必须重置xhr对象.否则  同一个xhr对象再次异步请求会异常
                                        break;
                                    case 'text/xml':
                                    case 'application/xml':
                                    case 'application/xhtml+xml':
                                        this.options.completeHandler.call(this, this.XHR.responseText, this.XHR.responseXML);
                                        if (ns.clientBrowser.is_ie) this.XHR.abort(); //ie7 必须重置xhr对象.否则同一个xhr对象再次异步请求会异常
                                        break;
                                }
                            }
                            else this._defaultHandler.call(this, this.XHR.responseText); //维护completeHandler的存在性。如果options.completeHandler设置为null也会执行本方法.
                        }
                        else if (this.options.errorHandler) {//status!=200
                            this.options.errorHandler.call(this, this.options.errorMsg, this.XHR.status);
                            this.abort(true);
                        }
                    }
                    else {
                        if (status == 404) this.setCompleteMsgBoxHTML('文件不存在');
                        else if (status >= 500) this.setCompleteMsgBoxHTML('服务器异常');
                        else if ((status >= 200 && status < 400) || (status > 404 && status < 407)) this.setCompleteMsgBoxHTML('文件存在');
                        else this.setCompleteMsgBoxHTML('文件可能存在,但无get访问权限或请求有异常.异常代码:' + status);
                    }
                }
            },
            setHandlers: function (f, index) {//可按index注册handler方法也可按 handlerList顺序注册
                if (isFunction(f) && isFunction(index)) {
                    for (var i = 0, len = arguments.length; i < len; i++) {
                        this.options[AJAX._handlerList[i]] = arguments[i];
                    }
                }
                else if (isObject(f)) {
                    for (var i = 0, len = AJAX._handlerList.length; i < len; i++) {
                        if (!isUndefined(f[AJAX._handlerList[i]])) {
                            this.options[AJAX._handlerList[i]] = f[AJAX._handlerList[i]];
                        }
                    }
                }
                else {
                    switch (index) {//限定index参数为整数合法索引值
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case -1:
                        case -2:
                        case -3:
                        case undefined:
                            if (index == -1) index = 5;
                            else if (index == -2) index = 6;
                            else if (index == -3) index = 7;
                            else if (index == undefined) index = 4;
                            this.options[AJAX._handlerList[index]] = f;
                            break;
                        default: throw new Error(ns + ':setHandlers:错误的index参数');
                    }
                }
            },
            clearHandlers: function () {//清除全部handlers
                for (var i = 0, len = AJAX._handlerList.length; i < len; i++) {
                    delete this.options[AJAX._handlerList[i]];
                }
            },
            _removeTimer: function () {
                this._timer && window.clearTimeout(this._timer);
            },
            abort: function (isErrorsCall) {
                this._removeTimer();
                var readyState = this.XHR.readyState;
                this._isCanceled = true; //必须放到abort()之前调用。 否则ff会有bug先进入readyState==4状态。阻塞js进程
                this.XHR.abort();
                if (!isErrorsCall) {//如果不是超时回调取消则 清楚超时回调的时间戳.并执行cancel的回调方法.
                    if (this.options.cancelHandler) this.options.cancelHandler.call(this, this.options.originalMsg, this.options.cancelMsg, readyState);
                }
            },
            _open: function () {
                this.XHR.onreadystatechange = bindFunction(this, this._callBack);
                this._isCanceled = false;
                this.options.headers.add('sender', this.sender); //设置header 中的 ajax请求发送者信息.以便前后台验证.
                if (this.options.noCache) {
                    this.options.headers.add('Cache-Control', 'no-cache,no-store'); //no-store 针对ff
                    if (ns.clientBrowser.is_ie) {
                        this._random = 'randomFieldForNoCache=';
                        this._randomValue = Math.random() + new Date;
                    }
                }
                if (isObject(this.options.params)) {//如果params是对象则自动转换成查询字符串格式。并且对值 做encodeURI编码
                    this.options.params = ns.QueryString.objToQueryString(this.options.params, true);
                }
                else if (this.options.params && isString(this.options.params)) {
                    this.options.params = encodeURI(this.options.params);
                }
                switch (this.options.method.toLowerCase()) {
                    case 'post':
                        this.options.headers.add('Content-Type', AJAX.enums.postContentType);
                        this.XHR.open(this.options.method, encodeURI(this.options.url) + '?' + this._random + this._randomValue, this.options.isASync);
                        break;
                    case 'head':
                        this.XHR.open(this.options.method, encodeURI(this.options.url), this.options.isASync);
                        break;
                    default:
                        this.XHR.open(this.options.method, encodeURI(this.options.url) + '?' + this.options.params + this._random + this._randomValue, this.options.isASync);
                        break;
                }
            },
            send: function () {//发送ajax请求
                if (!this.XHR) {
                    return this.setCompleteMsgBoxHTML(ns + ':您的浏览器不支持ajax功能.');
                }
                var readyState = this.XHR.readyState;
                if (readyState > 0 && readyState < 4) this.abort(true); //当前xhr处于1-3状态时 则取消当前请求.重新发起新的请求
                var _this = this;
                this._open();
                this.options.headers.forEach(function (value, key) { this.setRequestHeader(key, value); }, this.XHR);
                if (this.options.method.toLowerCase() == 'post') this.XHR.send(this.options.params);
                else this.XHR.send(null);
                if (this.options.timeOutHandler) {
                    this._timer = window.setTimeout(function () {
                        if (!_this.options.timeOutHandler) return;
                        _this.options.timeOutHandler.call(_this, _this.options.originalMsg, _this.options.timeOutMsg, _this.XHR.readyState);
                        _this.abort(true);
                    }, this.options.timeOut);
                }
            },
            reTry: function () {//重新发起请求.
                var _this = this;
                setTimeout(function () { _this.send(); }, 0);
            },
            getMimeType: function () {//获取response head中的mimeType
                return new String(this.XHR.getResponseHeader('content-type')).split(';')[0];
            },
            setLoadingMsgBoxHTML: function (sHTML) {//设置loadingMsgBox的innerHTML
                if (this.options.loadingMsgBox) return this.options.loadingMsgBox.innerHTML = sHTML;
                throw new Error(ns + ':未指定loadingMsgBox');
            },
            setCompleteMsgBoxHTML: function (sHTML) {//设置completeMsgBox的innerHTML
                if (this.options.completeMsgBox) return this.options.completeMsgBox.innerHTML = sHTML;
                throw new Error(ns + ':未指定completeMsgBox');
            },
            setErrorMsgBoxHTML: function (sHTML) {
                if (this.options.errorMsgBox) return this.options.errorMsgBox.innerHTML = sHTML;
                throw new Error(ns + ':未指定errorMsgBox');
            }
        }
        AJAX.queue = function (oXHR_aRequestQueue) { //AJAX异步请求队列.
            this._queue = [];
            if (oXHR_aRequestQueue) this.add(oXHR_aRequestQueue);
            this._requesting = null; //请求中的对象
            this._lastLevel0 = -1; //ajax对象优先级为0的最后一个元素在队列中的索引.默认-1为不存在
            this._lastLevel1 = -1; //ajax对象优先级为1的最后一个元素在队列中的索引.默认-1为不存在.
            this.errorPolicy = 0; //默认的 请求异常处理策略.为0 则从队列中删除当前请求 1清除全部队列中的请求.2无视优先级别 把当前请求放到队列末尾.
            this.cancelPolicy = 0; //默认的 取消请求处理策略.
            this.timeOutPolicy = 0; //默认的 请求超时处理策略.
            this._tempCompleteHandler = null;
            this._tempErrorHandler = null;
            this._tempCancelHandler = null;
            this._tempTimeoutHandler
            this.retryTimes = 1; //如果异常策略为 2或3或4(retry)则 retry的次数默认为1.
            this._isPaused = false; //是否暂停了队列
            if (this._queue.length > 0) this.sendRequest();
        }
        AJAX.queue.enums = {//queue中的枚举..
            errorPolicy: { 'requestNext': 0, 'clearAll': 1, 'moveLastWithOutLevel': 2, 'moveLastWithLevel': 3, 'retryNowaday': 4 }
        }
        AJAX.queue.prototype = {
            constructor: AJAX.queue,
            sendRequest: function (_oRetryRequest) {
                if (this._requesting || this._isPaused) return;
                var len = this._queue.length;
                if (len > 0) {
                    this._requesting = this._queue.shift();
                    if (this._lastLevel0 > -1) this._lastLevel0--;
                    if (this._lastLevel1 > -1) this._lastLevel1--;
                    this._tempCompleteHandler = this._requesting.options.completeHandler;
                    this._tempErrorHandler = this._requesting.options.errorHandler;
                    this._tempCancelHandler = this._requesting.options.cancelHandler;
                    this._tempTimeOutHandler = this._requesting.options.timeOutlHandler;
                    this._requesting.options.completeHandler = bindFunction(this, this._completeHandler);
                    this._requesting.options.errorHandler = bindFunction(this, this._errorHandler);
                    this._requesting.options.cancelHandler = bindFunction(this, this._cancelHandler);
                    this._requesting.options.timeOutlHandler = bindFunction(this, this._timeOutlHandler);
                    if (_oRetryRequest != this._requesting) this._requesting.send();
                    else _oRetryRequest.reTry();
                }
                else {
                    this._requesting = null;
                    this._resetPosition();
                }
            },
            _resetPosition: function () {
                this._lastLevel0 = -1;
                this._lastLevel1 = -1;
            },
            _resetHandlers: function () {
                if (this._requesting) {
                    this._requesting.options.completeHandler = this._tempCompleteHandler;
                    this._requesting.options.errorHandler = this._tempErrorHandler;
                    this._requesting.options.cancelHandler = this._tempCancelHandler;
                    this._requesting.options.timeOutlHandler = this._tempTimeOutHandler;
                    this._requesting._isCanceled = false;
                }
            },
            _add: function (oAJAXRequest) {
                if (oAJAXRequest && oAJAXRequest.constructor._className == 'MXJIA_AJAX_CLASS') {
                    switch (oAJAXRequest.options.level) {
                        case -1:
                            this._queue.push(oAJAXRequest);
                            break;
                        case 0:
                            if (this._lastLevel0 == -1) {
                                ns.Array.insertAfter(this._queue, oAJAXRequest, this._lastLevel1);
                                this._lastLevel0 = this._lastLevel1 + 1;
                            }
                            else ns.Array.insertAfter(this._queue, oAJAXRequest, this._lastLevel0++);
                            break;
                        case 1:
                            ns.Array.insertAfter(this._queue, oAJAXRequest, this._lastLevel1++);
                            break;
                        default:
                            throw new Error(ns + 'ajax.options.level 优先级只能是 -1,0,1 三个值.');
                    }
                }
                else throw new Error(ns + '.AJAX.queue.prototype.add 参数不是AJAX对象或 数组中包含非AJAX对象');
            },
            add: function (oAJAXRequest) {
                if (oAJAXRequest) {
                    if (isArray(oAJAXRequest)) {
                        for (var i = 0, len = oAJAXRequest.length; i < len; i++) this._add(oAJAXRequest[i]);
                    }
                    else this._add(oAJAXRequest);
                    if (!this._requesting && this._queue.length > 0) this.sendRequest();
                }
            },
            pauseQueue: function () {//暂停队列
                this._isPaused = true;
            },
            continueQueue: function () {//继续队列请求
                if (!this._isPaused) return;
                this._isPaused = false;
                this.sendRequest();
            },
            clear: function () {
                this._queue.length = 0;
                this._resetPosition();
            },
            getLength: function () {
                return this._queue.length;
            },
            _completeHandler: function (responseText, responseXML) {
                if (this._tempCompleteHandler) this._tempCompleteHandler.call(this._requesting, responseText, responseXML);
                if (this._requesting._errorTimes) delete this._requesting._errorTimes;
                if (this._requesting._cancelTimes) delete this._requesting._cancelTimes;
                if (this._requesting._timeOutTimes) delete this._request._timeOutTimes;
                this._resetHandlers();
                this._requesting = null;
                this.sendRequest();
            },
            _errors: function (sType) {
                this._resetHandlers();
                switch (this[sType + 'Policy']) {
                    case 0:
                        this._requesting = null;
                        this.sendRequest();
                        break;
                    case 1:
                        this._requesting = null;
                        this.clear();
                        break;
                    case 2:
                        if (this._requesting['_' + sType + 'Times'] <= this.retryTimes) this._queue.push(this._requesting);
                        var oTempRequesting = this._requesting;
                        this._requesting = null;
                        this.sendRequest(oTempRequesting);
                        break;
                    case 3:
                        if (this._requesting['_' + sType + 'Times'] <= this.retryTimes) this.add(this._requesting);
                        var oTempRequesting = this._requesting;
                        this._requesting = null;
                        this.sendRequest(oTempRequesting);
                        break;
                    case 4:
                        if (this._requesting['_' + sType + 'Times'] <= this.retryTimes) {
                            if (this._lastLevel0 > -1) this._lastLevel0++;
                            if (this._lastLevel1 > -1) this._lastLevel1++;
                            this._queue.unshift(this._requesting);
                        }
                        var oTempRequesting = this._requesting;
                        this._requesting = null;
                        this.sendRequest(oTempRequesting);
                        break;
                    default:
                        throw new Error(ns + ':AJAX.queue.errorPolicy 异常策略只能是 0,1,2,3,4 五个值.');
                        break;
                }
            },
            _errorHandler: function (errorMsg, status) {
                if (this._tempErrorHandler) this._tempErrorHandler.call(this._requesting, errorMsg, status);
                if (!this._requesting._errorTimes) this._requesting._errorTimes = 1;
                else this._requesting._errorTimes++;
                this._errors('error');
            },
            _cancelHandler: function (originalMsg, cancelMsg, readyState) {
                if (this._tempCancelHandler) this._tempCancelHandler.call(this._requesting, originalMsg, cancelMsg, readyState);
                if (!this._requesting._cancelTimes) this._requesting._cancelTimes = 1;
                else this._requesting._cancelTimes++;
                this._errors('cancel');
            },
            _timeOutHandler: function (originalMsg, timeOutMsg, readyState) {
                if (this._tempTimeOutHandler) this._tempTimeOutHandler.call(this._requesting, timeOutMsg, readyState);
                if (!this._requesting._timeOutTimes) this._requesting._timeOutTimes = 1;
                else this._requesting._timeOutTimes++;
                this._errors('timeOut');
            }
        }

        //XML-----------------------------------------------------------------------------------------------------------------------------
        function parseDom(xmlStr) {//xml字符串转 xmldom
            if (window.DOMParser) {
                var oParser = new DOMParser;
                return oParser.parseFromString(xmlStr, 'text/xml');
            }
            else if (window.ActiveXObject) {
                var arrSignatures = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom"];

                for (var i = 0, len = arrSignatures.length; i < len; i++) {
                    try {
                        var oXmlDom = new ActiveXObject(arrSignatures[i]);
                        oXmlDom.loadXML(xmlStr);
                        return oXmlDom;

                    }
                    catch (oError) { }
                }
                alert(ns + ': 您的浏览器不支持创建 xml dom对象 ');
            }
        }
        function loadXML(sURL) {//同步获取外部xml
            var ajax = new AJAX(sURL);
            ajax.options.isASync = false;
            ajax.options.noCache = true;
            ajax.clearHandlers();
            ajax.send();
            if (ajax.XHR.status != 200) return null;
            try { return ajax.XHR.responseXML; }
            finally { ajax = null; }
        }
        function selectNodes(oXML, sXPath) {//XML对象专用方法
            if ('selectNodes' in oXML) return oXML.documentElement.selectNodes(sXPath); //ie有bug 直接if(.selectNodes)会报错。但可直接执行.
            if (window.XPathEvaluator) { //其他w3c浏览器
                var oEvaluator = new XPathEvaluator;
                var oResult = oEvaluator.evaluate(sXPath, oXML.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                var aNodes = [];
                if (oResult != null) {
                    var oElement = oResult.iterateNext();
                    while (oElement) {
                        aNodes.push(oElement);
                        oElement = oResult.iterateNext();
                    }
                }
                return aNodes;
            }
            return false;
        }
        function selectSingleNode(oXML, sXPath) {//XML对象专用方法
            if ('selectSingleNode' in oXML) return oXML.documentElement.selectSingleNode(sXPath); //ie有bug 直接if(.selectNodes)会报错。但可直接执行.
            if (window.XPathEvaluator) { //其他w3c浏览器
                var oEvaluator = new XPathEvaluator;
                var oResult = oEvaluator.evaluate(sXPath, oXML.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return oResult != null ? Result.singleNodeValue : null;
            }
            return false;
        }


        //JSON对象-----------------------------------------------------------------------------------------------------------------------------


        function stringToJSON(sJSON) {
            if (!isString(sJSON)) throw new Error(ns + ':StringToJSON方法 必须传一个字符串实参');
            if (window.JSON && window.JSON.parse) return window.JSON.parse(sJSON);
            if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(sJSON)) return eval('(' + sJSON + ')');
            throw new Error('JSON.parse');
        }
        function toJSONString(obj) {
            if (obj != null && isFunction(obj.toJSON)) return obj.toJSON();
            if ((isNumber(obj) && !isNaN(obj)) || isBoolean(obj) || isNull(obj)) return obj;
            if (isString(obj) || isDate(obj) || isRegExp(obj) || isFunction(obj) || (isNumber(obj) && isNaN(obj)) || isUndefined(obj)) {
                return arguments.callee._format(obj);
            }
            if (isElement(obj) || isDocumentFragment(obj)) return arguments.callee._format(getOuterHTML(obj).replace(/[\n|"]/g, function (m) {
                return m == '\n' ? '\\n' : '\\"';
            }));
            if (isTextNode(obj) || isAttribute(obj)) return arguments.callee._format(obj.nodeValue);
            var sReturn = '{';
            var end = '}'
            if (isArray(obj)) {
                sReturn = '[';
                end = ']'
                for (var i = 0, len = obj.length; i < len; i++) {
                    sReturn += arguments.callee(obj[i]) + ',';
                }
                return ns.String.deleteEnd(sReturn, ',') + end;
            }
            if (isObject(obj)) {
                for (var o in obj) {
                    sReturn += '"' + o + '":' + arguments.callee(obj[o]) + ',';
                }
                return ns.String.deleteEnd(sReturn, ',') + end;
            }
            return null;
        }
        toJSONString._format = function (sData) {
            if (isDate(sData)) sData = ns.Date.getJSONTimeString(sData, '-');
            return '"' + sData + '"';
        }

        //QueryString对象----------------------------------------------------------------------------------------------------------------------
        function queryString(sFieldName, isAutoDecode) {//获取查询字符串中的指定字段的值.
            var r, r = (r = window.location.search.substr(1).match(new RegExp("(^|&)" + sFieldName + "=([^&]*)(&|$)"))) ? r[2] : null;
            return r != null ? isAutoDecode ? decodeURI(r) : r : null;
        }
        function objToQueryString(obj, isAutoEncode) {//对象转查询字符串
            if (!isObject(obj)) throw new Error(ns + ':objToQueryString方法 参数有误');
            var sQueryString = new hashTable(obj).join('&', '=');
            return isAutoEncode ? encodeURI(sQueryString) : sQueryString;
        }
        function queryStringToObj(sQueryString, isAutoDecode) {
            if (!isString(sQueryString)) throw new Error(ns + ':queryStringToObj 参数有误');
            sQueryString = isAutoDecode ? decodeURI(sQueryString) : sQueryString
            var arr = sQueryString.split('&');
            var obj = {};
            var ta = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                ta = arr[i].split('=');
                obj[ta[0]] = ta[1];
            }
            return obj;
        }


        //Cookie对象----------------------------------------------------------------------------------------------------------------------------


        function setCookie(skey_oJSON, sValue, nTimeOutHours, sDomain, sPath) {
            if (isString(skey_oJSON)) {
                nTimeOutHours = arguments.callee._setExpires(nTimeOutHours);
                sDomain = !isString(sDomain) ? '' : ';domain=' + sDomain;
                sPath = !isString(sPath) ? '' : ':path=' + sPath;
                return document.cookie = skey_oJSON + "=" + encodeURIComponent(sValue) + nTimeOutHours + sDomain + sPath;
            }
            else if (isObject(skey_oJSON)) {
                if (nTimeOutHours = arguments.callee._setExpires(skey_oJSON.expires)) delete skey_oJSON.expires;
                if (sDomain = !('domain' in skey_oJSON) ? '' : ';domain=' + skey_oJSON.domain) delete skey_oJSON.domain;
                if (sPath = !('path' in skey_oJSON) ? '' : ';path=' + skey_oJSON.path) delete skey_oJSON.path;
                for (var o in skey_oJSON) document.cookie = o + "=" + encodeURIComponent(skey_oJSON[o]) + nTimeOutHours + sDomain + sPath;
            }
        }
        setCookie._setExpires = function (expires) {
            var date = new Date();
            if (isNumber(expires)) return ';expires=' + new Date(date.setHours(date.getHours() + expires)).toUTCString();
            return '';
        }
        function getCookie(sKey) {
            var r;
            return decodeURIComponent((r = new RegExp('(?:; )?' + sKey + '=([^;]*);?', 'g').exec(document.cookie)) ? r[1] : '');
        }
        function removeCookie(sKey_aKeys) {
            ns.Array.forEach(convertToArray(sKey_aKeys), arguments.callee._each);
        }
        removeCookie._each = function (sKey) {
            if (new RegExp('(?:; )?' + sKey + '=([^;]*);?', 'g').test(document.cookie)) {
                setCookie(sKey, '', -1);
            }
        }
        function clearCookie() {
            var sCookie = document.cookie;
            sCookie.replace(/[;]?(\w*)=/g, arguments.callee._each);
        }
        clearCookie._each = function (m, i) {
            removeCookie(i);
        }
        domReady();
        addEvent(window, 'load', function () { ns.DOM.isWindowReady = true; removeEvent(window, 'load', arguments.callee); }); //确定window是否已经加载完毕
        this.init = true; //初始化完毕
        ('kws_checkVirus' in window) && kws_checkVirus.toString() == undefined && (kws_checkVirus = ns.Function.empty); //kws反病毒 劫持alert 修正 (可选)
    }).call(xuzhiwei);
}