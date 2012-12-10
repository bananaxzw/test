/********************************************************************************************
* 文件名称:	Common.js
* 设计人员:	许志伟
* 设计时间:	
* 功能描述:	住房保障JS公用类
*		
*		
* 注意事项:	
*
* 版权所有:	Copyright (c) 2011, Fujian SIRC
*
* 修改记录: 	修改时间		人员		修改备注
*				----------		------		-------------------------------------------------
*
********************************************************************************************/
if (!window.ZFBZCommon || !ZFBZCommon.init) {
    window.ZFBZCommon = {};
    ZFBZCommon.toString = function() { return "住房保障JS通用类"; };
    (function() {

        //浏览器判断
        var sUserAgent = navigator.userAgent;
        var isOpera = sUserAgent.indexOf("Opera") > -1;
        var isMinOpera4 = isMinOpera5 = isMinOpera6 = isMinOpera7 = isMinOpera7_5 = false;
        var isIE = sUserAgent.indexOf("compatible") > -1 && sUserAgent.indexOf("MSIE") > -1 && !isOpera;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");


        this.windowHelper = {
            MyModalDialog: function(strurl, height, width) {
                ///<summary>
                /// 模态对话框
                ///</summary>
                window.showModalDialog(strurl, window, "dialogWidth: " + width + "px;dialogHeight: " + height + "px;resizable: yes; status: no;location:yes;");
            },
            getQueryArgs: function() {
                ///<summary>
                /// 获取查询字符串
                ///</summary>
                //定义一个数组，用于存放取出来的字符串参数。
                var argsArr = new Object();
                //获取URL中的查询字符串参数
                var query = window.location.search;
                //name=myname&password=1234&sex=male&address=nanjing
                query = query.substring(1);

                //这里的pairs是一个字符串数组 
                var pairs = query.split("&");

                for (var i = 0; i < pairs.length; i++) {
                    var sign = pairs[i].indexOf("=");
                    //如果没有找到=号，那么就跳过，跳到下一个字符串（下一个循环）。
                    if (sign == -1) {
                        continue;
                    }

                    var aKey = pairs[i].substring(0, sign);
                    var aValue = pairs[i].substring(sign + 1);

                    argsArr[aKey] = aValue;
                }

                return argsArr;
            },
            getQueryArgByName: function(name) {
                ///<summary>
                ///根据 获取查询字符串
                ///</summary>
                var arrArgs = this.getQueryArgs();
                return arrArgs[name];

            },
            isNullLocation: function(location) {
                if (location.href == "about:blank") {
                    return true;
                }
                return false;
            }
        };
        //浏览器对象帮助
        this.UserBroswerHelper = {
            IsIE: function() {
                ///<summary>
                /// 判断浏览器是不是IE
                ///</summary>
                if (isIE) {
                    return true;
                }
                else {
                    return false;
                }

            },
            IsIE6: function() {
                var sUserAgent = navigator.userAgent;
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(sUserAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                isIE6 = (fIEVersion == 6.0);
                return isIE6;
            }

        };
        this.eventHepler = {
            getEvent: function() {
                ///<summary>
                /// 格式化IE浏览器下的事件对象 使之符合DOM事件
                ///</summary>
                if (window.event) {
                    return formatEvent(window.event);
                } else {
                    return ZFBZCommon.eventHepler.getEvent.caller.arguments[0];
                }

            },
            addEventHandler: function(oTarget, sEventType, fnHandler) {
                if (oTarget.addEventListener) {
                    oTarget.addEventListener(sEventType, fnHandler, false);
                } else if (oTarget.attachEvent) {
                    oTarget.attachEvent("on" + sEventType, fnHandler);
                } else {
                    oTarget["on" + sEventType] = fnHandler;
                }
            },

            removeEventHandler: function(oTarget, sEventType, fnHandler) {
                if (oTarget.removeEventListener) {
                    oTarget.removeEventListener(sEventType, fnHandler, false);
                } else if (oTarget.detachEvent) {
                    oTarget.detachEvent("on" + sEventType, fnHandler);
                } else {
                    oTarget["on" + sEventType] = null;
                }
            }
        };
        this.String = {
            //stringBuffer
            createBuffer: function(sFirstString) {
                return new stringBuffer(sFirstString);
            }
        }
        //数组方式 拼接字符串 .高效... 使用前先实例化.
        function stringBuffer(sFirstString) {
            this._aStr = [];
            if (isString(sFirstString)) this._aStr.push(sFirstString);
        };
        stringBuffer.prototype = {
            constructor: stringBuffer,
            add: function(str) {
                this._aStr.push(str);
                return this;
            },
            valueOf: function() {
                return this._aStr.join('');
            },
            toString: function() {
                return this._aStr.join('');
            }
        };
        this.XmlDocHelper = {
            loadXMLDoc: function(XmlStr) {
                ///<summary>
                /// 加载XML文档 多浏览器支持
                ///</summary>
                var xmlDoc;
                try {
                    // IE
                    if (window.ActiveXObject) {
                        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    }
                    // Mozilla, Firefox, Opera, etc.
                    else if (document.implementation && document.implementation.createDocument) {
                        xmlDoc = document.implementation.createDocument("", "", null);
                    }
                    else {
                        alert('浏览器不支持XML文档加载');
                    }
                    xmlDoc.async = false;
                    //xmlDoc.load(XmlStr);
                    xmlDoc.loadXML(XmlStr);
                    return (xmlDoc);
                }
                catch (ex) {
                    //Firefox, Mozilla, Opera, etc.
                    try {
                        var parser = new DOMParser();
                        xmlDoc = parser.parseFromString(XmlStr, "text/xml");
                        XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function(xpath) {
                            var x = this.selectNodes(xpath)
                            if (!x || x.length < 1) return null;
                            return x[0];
                        }
                        XMLDocument.prototype.selectNodes = Element.prototype.selectNodes = function(xpath) {
                            var xpe = new XPathEvaluator();
                            var nsResolver = xpe.createNSResolver(this.ownerDocument == null ? this.documentElement : this.ownerDocument.documentElement);
                            var result = xpe.evaluate(xpath, this, nsResolver, 0, null);
                            var found = [];
                            var res;
                            while (res = result.iterateNext())
                                found.push(res);
                            return found;
                        }
                        return xmlDoc;
                    }
                    catch (e) {
                        alert(e.message)
                    }
                }

            }

        };
        this.classHepler = {
            registerNameSpace: function(fullNS) {
                // 将命名空间切成N部分, 比如Grandsoft、GEA等
                var nsArray = fullNS.split('.');
                var sEval = "";
                var sNS = "";
                for (var i = 0; i < nsArray.length; i++) {
                    if (i != 0) {
                        sNS += ".";
                    }
                    sNS += nsArray[i];

                    // 依次创建构造命名空间对象（假如不存在的话）的语句
                    sEval += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = new Object();"
                }
                if (sEval != "") eval(sEval);
            }
        }



        function formatEvent(oEvent) {
            ///<summary>
            /// 格式化IE浏览器下的事件对象 使之符合DOM事件
            ///</summary>
            if (isIE && isWin) {
                oEvent.charCode = (oEvent.type == "keypress") ? oEvent.keyCode : 0;
                oEvent.eventPhase = 2;
                oEvent.isChar = (oEvent.charCode > 0);
                oEvent.pageX = oEvent.clientX + document.body.scrollLeft;
                oEvent.pageY = oEvent.clientY + document.body.scrollTop;
                oEvent.preventDefault = function() {
                    this.returnValue = false;
                };

                if (oEvent.type == "mouseout") {
                    oEvent.relatedTarget = oEvent.toElement;
                } else if (oEvent.type == "mouseover") {
                    oEvent.relatedTarget = oEvent.fromElement;
                }

                oEvent.stopPropagation = function() {
                    this.cancelBubble = true;
                };

                oEvent.target = oEvent.srcElement;
                oEvent.time = (new Date).getTime();
            }
            return oEvent;
        };
        function isString(obj) {
            return Object.prototype.toString.call(obj) == '[object String]';
        };


        this.init = true; //初始化完毕

    }).call(ZFBZCommon);
}