﻿/**    
* SL (Javascript Extension Tools) 
*
* @version    1.0
* @author    bananaxzw(许志伟)(许志伟)(<a href="mailto:bananaxzw@qq.com">Paladin-xu</a>)
* 
*/
/**    
* @description  SL框架基类 主要核心
* 感谢jquery protype jet框架的作者们 感谢franky
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*/


(function () {

    var version = "1.0", topNamespace = this;
    var SL = topNamespace.SL, VERSIONS = {}, Instances = {};

    if (SL == undefined) {
        if (SL) {
            SL.VERSIONS = VERSIONS;
            SL.Instances = Instances;
        }
        /**
        * SL对象原型
        * @class
        * @namespace
        * @name SL
        * @global
        * @since version 1.0
        */
        SL = function (ver, isNewInstance) {
            var _SL = this;
            if (isNewInstance) {
                // 如果是第一次执行则初始化对象
                this._init();
            } else {
                if (ver) {
                    ver = String(ver);
                    try {
                        if (SL.Instances[ver]) {
                            _SL = SL.Instances[ver];
                        } else {
                            _SL = SL.Instances[SL.DEFAULT_VERSION];
                            throw new Error("没有找到 SL version " + ver + ", 所以返回默认版本 SL version " + SL.DEFAULT_VERSION + "!");
                        }
                    } catch (e) {

                        //输出("A.错误：[" + e.name + "] " + e.message + ", " + e.fileName + ", 行号:" + e.lineNumber + "; stack:" + typeof e.stack, 2);
                    }
                } else {
                    _SL = SL.Instances[SL.DEFAULT_VERSION];
                }
            }
            return _SL;
        };
        SL.prototype = {
            _init: function () {
                this.constructor = SL;
            },

            /**
            * @description 可以一次性连续创建命名空间
            * @param {String} name 命名空间名称
            * @returns {Object} 返回对最末命名空间的引用
            * 
            * @example
            *在全局环境中创建top.sub名字空间, _registerNamespace完成的操作相当于在全局环境中执行如下语句：
            * var top = {};
            * top.sub = {};
            *
            * var _s=new SL();
            * _s._registerNamespace("top.sub");
            *或者
            * SL().registerNamespace("top.sub");
            */
            registerNamespace: function (namespacePath) {
                var rootObject = topNamespace;
                var namespaceParts = namespacePath.split('.');

                for (var i = 0, l = namespaceParts.length; i < l; i++) {
                    var currentPart = namespaceParts[i];
                    var ns = rootObject[currentPart];
                    var nsType = typeof (ns);
                    if (!ns) {
                        ns = rootObject[currentPart] = {};
                    }
                    /* 暂时去掉限制else {
                   
                    if (i == l - 1) {
                    // alert("你所注册的名称空间已经被占用;");
                    throw new Error("namespace is AlreadyExist!");
                    }
                    if (!SL().InstanceOf.PlainObject(ns)) {
                    throw new Error("exist namespace is not PlainObject");
                    }
                    }*/

                    if (!ns.__namespace && SL().InstanceOf.PlainObject({})) {

                        ns.__namespace = true;
                        ns.__typeName = namespaceParts.slice(0, i + 1).join('.');
                        ns.getName = function ns$() { return this.__typeName; }
                    }
                    rootObject = ns;
                }
                return rootObject;
            },
            /**
            * @description  创建一个 Javascript 代码包
            * @param {String} name 要创建的包的命名空间
            * @param {Function} func 要创建的包的包体
            * @returns {Mixed} 返回任何自定义的变量
            * 
            * @example
            * SL().create(function(SL){
            * 	//这时上下文对象this指向全局window对象
            * 	alert(this);
            * };
            * 
            * SL().create("top.sub", function(SL){
            * 	//这时上下文对象this指向window对象下的top.sub对象
            * 	alert(this);
            * };
            * 
            *
            *  SL().create("topNameSpace.sub", function () {
            *    this.say = function () {
            *        alert("hello word!");
            *        }
            *      });
            *   topNameSpace.sub.say();
            *
            *    SL().create("topNameSpace.sub.subsub", function () {
            *        this.say = function () {
            *            alert("hello word Sub!");
            *        }
            *    });
            *    topNameSpace.sub.subsub.say();
            *
            *
            *   SL().create("myNameSpace", function (SL) {
            *        this.say = function () {
            *            alert("hello word myNameSpace!");
            *        }
            *        SL.U = this;
            *   });
            *    alert(myNameSpace.say == SL().U.say);
            *    alert(myNameSpace.say == (new SL()).U.say);
            *     
            */
            create: function () {
                var name = arguments[0],
						func = arguments[arguments.length - 1],
						ns = topNamespace,
						returnValue;
                if (typeof func === "function") {
                    if (typeof name === "string") {
                        ns = this.registerNamespace(name);
                        if (SL.Instances[name]) {
                            //throw new Error("Package name [" + name + "] is exist!");
                        } else {
                            SL.Instances[name] = {
                                isLoaded: true,
                                returnValue: returnValue
                            };
                        }
                    } else if (typeof name === "object") {
                        ns = name;
                    }
                    ns.instanceName = name;
                    returnValue = func.call(ns, this);
                } else {
                    throw new Error("Function required");
                }

            },
            /**
            * @private 比较大小
            */
            compare: function (obj1, obj2) {
                if (obj1 == null || obj2 == null) return (obj1 === obj2);
                return (obj1 === obj2);
            },
            /**
            *@ignore
            */
            /*数据缓存*/
            expando: "SL" + (new Date()).getTime(),
            /**
            *@ignore
            */
            /*事件句柄唯一键*/
            guid: 1,
            /**
            *@ignore
            */
            uuid: 0,
            /**
            *@ignore
            */
            cache: {},

            /**
            * @description  创建对象
            * @param {Object} option = {base: superClass} 在option对象的base属性中指定要继承的对象，可以不写，不写就不继承任何类
            * @param {Object}  object={.....} 要创建的类的属性和方法
            * @returns {Object} newclass返回新创建的对象
            * 
            * @example
            * var Person = SL().Class({
            *    init: function (name, sex, age) {
            *        this.name = name;
            *        this.age = age;
            *        this.sex = sex;
            *    },
            *    getAge: function () {
            *        alert(this.age);
            *    }
            *
            * });
            * var Employee = SL().Class({ base: Person }, {
            *     init: function (name, sex, age, id) {
            *         this.base.init(name, sex, age);
            *         this.EmployeeId = id;
            *     },
            *     getEmployeeID: function () {
            *         alert(this.EmployeeId);
            *     },
            *     getName: function () {
            *        alert(this.name);
            *     }
            *});
            * var p = new Person('xuzhiwei',"男",18);
            * p.getAge();
            * var employee = new Employee("xuzhiwei-older", "nan", 18, 1);
            * employee.getAge();
            */
            Class: function () {
                var length = arguments.length, members = arguments[length - 1];

                if (length == 2) {
                    var superClass = arguments[0].base;
                    var subClass = function () {
                        //构造base 可以不用关注
                        this.base = this.base || {};
                        var _this = this;
                        for (var name in superClass.prototype) {
                            if (typeof superClass.prototype[name] == "function") {
                                this.base[name] = (function _helper(x, scope) {
                                    return function () {
                                        superClass.prototype[x].apply(scope, arguments);
                                    };
                                })(name, _this);
                            }
                        }
                        this.init.apply(this, arguments);
                    }
                    // 指定原型
                    sl.extend( subClass.prototype,new superClass());
                    // 重新指定构造函数
                    subClass.prototype.constructor = subClass;
                    //扩展子类
                    this.extend(subClass.prototype, members);
                    return subClass;

                }
                else {
                    members.init = members.init || function () { };
                    var newClass = function () {
                        this.init.apply(this, arguments);
                    }
                    sl.extend(newClass.prototype, members);
                    return newClass;
                }

            }
        };
        SL.VERSIONS = VERSIONS;
        SL.Instances = Instances;

        SL.Instances[version] = new SL(version, true);

        SL.DEFAULT_VERSION = version;
        topNamespace.SL = SL;
        topNamespace.sl = SL.Instances[version];
    }

})();


SL().create(function (SL) {
    /**
    * 类型判断
    * @class
    * @name InstanceOf
    * @example 
    * return SL().InstanceOf.String(obj)
    *或者 
    *var sl=new SL();
    *sl.InstanceOf.String(obj)
    */
    var InstanceOf = function () {
        /// <summary>
        /// 类型判断相关
        /// </summary>
    };
    InstanceOf.prototype = {
        /**
        *判断是否字符串
        */
        String: function (obj) {
            return Object.prototype.toString.call(obj) == '[object String]';
        },
        /**
        *判断是否数组
        */
        Array: function (obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        },
        /**
        *判断是否数字
        */
        Number: function (obj) {
            return Object.prototype.toString.call(obj) == '[object Number]';
        },
        /**
        *判断是否布尔
        */
        Boolean: function (obj) {
            return Object.prototype.toString.call(obj) == '[object Boolean]';
        },
        /**
        *判断是否时间
        */
        Date: function (obj) {
            return Object.prototype.toString.call(obj) == '[object Date]';
        },
        /**
        *判断是否正则
        */
        RegExp: function (obj) {
            return Object.prototype.toString.call(obj) == '[object RegExp]';
        },
        /**
        *判断是否方法
        */
        Function: function (obj) {
            return (typeof obj == 'function');
        },
        Undefined: function (obj) {
            return (typeof obj == 'undefined');
        },
        Null: function (obj) {
            return (obj === null);
        },
        Arguments: function (obj) {
            return this.Object(obj) && obj.constructor.toString() == Object.toString() && 'length' in obj && 'callee' in obj;
        },
        Window: function (obj) {
            return obj != null && obj === window;
        },
        BodyOrHtmlOrWindow: function (obj) {
            var isWindow = obj == window || obj == document
			|| !obj.tagName || (/^(?:body|html)$/i).test(obj.tagName);
            return isWindow;
        },
        /**
        *判断是否普通对象 由{}构建或者object
        */
        PlainObject: function (obj) {
            if (!obj || Object.prototype.toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {
                return false;
            }


            if (obj.constructor
			&& !Object.prototype.hasOwnProperty.call(obj, "constructor")
			&& !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
            var key;
            for (key in obj) { }

            return key === undefined || Object.prototype.hasOwnProperty.call(obj, key);
        },
        Object: function (obj) {
            return (!!obj && typeof obj == 'object');
        },
        EmptyObject: function (obj) {
            /// <summary>
            /// 遍历元素的属性，只有要属性就返回假，否则返回真
            /// </summary>
            /// <param name="obj"></param>
            /// <returns type=""></returns>
            for (var name in obj) {
                return false;
            }
            return true;

        },
        DOMNode: function (node) {
            return this.Object(node) && node.nodeType;
        },
        /**
        *判断是否dom元素
        */
        DOMElement: function (node) {
            return this.Object(node) && node.nodeType == 1;
        },
        /**
        *判断是否dom属性
        */
        DOMAttribute: function (node) {
            return this.Object(node) && node.nodeType == 2;
        },
        /**
        *判断是否dom元素
        */
        DOMTextNode: function (node) {
            return this.Object(node) && node.nodeType == 3;
        },
        DOMNodeList: function (obj) {
            return !!obj && (!obj.hasOwnProperty || obj == '[object NodeList]' || obj == '[object StaticNodeList]' || obj == '[object HTMLCollection]' || ('length' in obj && this.DOMNode(obj[0])));
        },
        /**
        *判断是否dom片段文档
        */
        DocumentFragment: function (obj) {
            return this.Object(obj) && obj.nodeType == 11;
        }
    }
    SL.InstanceOf = SL.InstanceOf || {};
    SL.InstanceOf = new InstanceOf();
});
//类型转换
SL().create(function (SL) {
    var SLConvert = function () {
        this.convertToArray = convertToArray;
    };
    function convertToArray(obj, fFilter, oThis) {
        if (obj == null) return [];
        if (SL.InstanceOf.Array(obj)) return obj;
        if (!SL.InstanceOf.Object(obj) && obj != '[object NodeList]') return [obj]; //safari下typeof nodeList 返回 'function'
        if (sl.InstanceOf.DOMNode(obj)) return [obj];
        oThis = oThis || window;
        if (obj.hasOwnProperty) {//非ie浏览器的nodeList集合 都具备 hasOwnProperty方法 
            if (SL.InstanceOf.DOMNodeList(obj) || SL.InstanceOf.Arguments(obj)) {//ie arguments 可过
                return fFilter ? arguments.callee._pushAsArray(obj, fFilter, oThis) : Array.prototype.slice.call(obj);
            }
        }
        else if (SL.InstanceOf.DOMNodeList(obj)) return arguments.callee._pushAsArray(obj, fFilter, oThis); //ie nodeList
        return arguments.callee._pushAsObject(obj, fFilter, oThis);
    };
    convertToArray._pushAsArray = function (obj, fFilter, oThis) {
        var aReturn = [];
        if (fFilter) for (var i = 0, len = obj.length; i < len; i++) fFilter.call(oThis, obj[i], i, obj) && aReturn.push(obj[i]);
        else for (var i = 0, len = obj.length; i < len; i++) aReturn.push(obj[i]);
        return aReturn;
    };
    convertToArray._pushAsObject = function (obj, fFilter, oThis) {
        var aReturn = [];
        if (fFilter) for (var o in obj) fFilter.call(oThis, obj[o], o, obj) && aReturn.push(obj[o]);
        else for (var o in obj) aReturn.push(obj[o]);
        return aReturn;
    };
    SL.Convert = new SLConvert();

});
/**
*@memberOf SL
*对象扩展
*/
SL().create(function (SL) {

    /**
    *@memberOf SL
    *对象扩展
    *@example
    * var object1 = {
    *        apple: 0,
    *        banana: { weight: 52, price: 100 },
    *        cherry: 97
    *    };
    *    var object2 = {
    *        banana: { price: 200 },
    *        durian: 100
    *    };
    *
    *    console.dir(SL().extend(true, object1, object2));
    *  {"apple":0,"banana":{"weight":52,"price":200},"cherry":97,"durian":100}
    *    console.dir(SL().extend(object1, object2));
    *    {"apple":0,"banana":{"price":200},"cherry":97,"durian":100}
    */
    function extend() {
        var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && (target)) {
            target = {};
        }
        // extend SL itself if only one argument is passed
        if (length === i) {
            target = SL;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }
                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (SL.InstanceOf.PlainObject(copy) || (copyIsArray = SL.InstanceOf.Array(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && SL.InstanceOf.Array(src) ? src : [];

                        } else {
                            clone = src && SL.InstanceOf.PlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = arguments.callee(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    }
    SL.extend = extend;
});
SL().create(function (SL) {
    //var uu = new SL();
    (function () {
        this.each = function (object, callback, args) {
            var name, i = 0, length = object.length;
            if (args) {
                if (length === undefined) {
                    for (name in object)
                        if (callback.apply(object[name], args) === false)
                            break;
                } else
                    for (; i < length; )
                        if (callback.apply(object[i++], args) === false)
                            break;
            } else {
                if (length === undefined) {
                    for (name in object)
                        if (callback.call(object[name], name, object[name]) === false)
                            break;
                } else {
                    for (; i < length; ) {
                        if (callback.call(object[i], i, object[i++]) === false) {
                            break;
                        }
                    }

                }
            }
        };
        /**
        *proxy( obj, "test" )
        *proxy(fn,context)
        */
        this.proxy = function () {
            var fn, proxy, context;
            if (2 === arguments.length) {
                //proxy(context,"property")
                if (typeof arguments[1] == "string") {
                    var obj = arguments[0], propertyName = arguments[1];
                    context = obj;
                    fn = obj[propertyName];
                }
                //proxy(fn,context) 
                else if (arguments[1] && !SL.InstanceOf.Function(arguments[1])) {
                    context = arguments[1];
                    fn = arguments[0];
                }
            }
            else {
                fn = arguments[0];
            }
            context = context || SL;
            if (fn) {
                proxy = function () {
                    return fn.apply(context, arguments);
                }
            }
            //事件中有用到
            if (fn.guid) { proxy.guid = fn.guid; }
            return proxy;
        };
        //把json转换成querying形式 比如{width:100,height:100}=>width=100&height=100
        this.param = function (object) {
            var s = [];
            function add(key, value) {
                value = SL.InstanceOf.Function(value) ? value() : value;
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }
            SL.each(object, function build(prefix, o) {
                if (typeof o == "object") {
                    SL.each(o, function (i, v) {
                        build(prefix + "[" + i + "]", v);
                    });
                } else {
                    add(prefix, o);
                }
            });

            return s.join("&").replace(/%20/g, "+");
        };
        //统一get set属性访问器
        this.access = function (elems, key, value, getter, setter, bind, setReturn) {
            var length = elems.length;
            setter = typeof setter === "function" ? setter : getter;
            if (typeof key === "object") {
                for (var k in key) {            //为所有元素设置N个属性
                    for (var i = 0; i < length; i++) {
                        setter.call(bind || elems[i], elems[i], k, key[k]);
                    }
                }
                return setReturn || elems;
            }
            if (value !== void 0) {
                for (i = 0; i < length; i++) {
                    setter.call(bind || elems[i], elems[i], key, value);
                }
                return setReturn || elems;
            } //取得第一个元素的属性, getter的参数总是很小的
            return length ? getter.call(bind || elems[0], elems[0], key) : void 0;
        };
        this.merge = function (first, second) {
            var i = first.length, j = 0;

            if (typeof second.length === "number") {
                for (var l = second.length; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }

            first.length = i;

            return first;
        };
        this.grep = function (elems, callback, inv) {
            var ret = [];
            for (var i = 0, length = elems.length; i < length; i++) {
                if (!inv !== !callback(elems[i], i)) {
                    ret.push(elems[i]);
                }
            }

            return ret;
        };
        this.map = function (elems, callback, arg) {
            var ret = [], value;
            for (var i = 0, length = elems.length; i < length; i++) {
                value = callback(elems[i], i, arg);

                if (value != null) {
                    ret[ret.length] = value;
                }
            }

            return ret.concat.apply([], ret);
        };
    }).call(SL);

});
//判断页面加载
SL().create(function (SL) {
    //事件队列
    var contentLoadedEventList = [],
    //是否已经加载完
    isLoaded = false,
    //是否已经绑定 防止多次绑定事件
    isBinded = false,
    //事件
    DOMContentLoaded;
    if (document.addEventListener) {
        DOMContentLoaded = function () {
            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            fireLoadedEvents();
        };

    } else if (document.attachEvent) {
        DOMContentLoaded = function () {
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", DOMContentLoaded);
                fireLoadedEvents();
            }
        };
    }

    function ready(fn) {
        BindContentLoadedEvent();
        if (isLoaded) {
            fn.call(document);
        } else if (contentLoadedEventList) {
            contentLoadedEventList.push(fn);
        }
    }
    function BindContentLoadedEvent() {
        if (isBinded) {
            return;
        }
        isBinded = true;
        if (document.readyState === "complete") {
            return fireLoadedEvents();
        }
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
            window.addEventListener("load", fireLoadedEvents, false);
        } else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", DOMContentLoaded);
            window.attachEvent("onload", fireLoadedEvents);
            var toplevel = false;
            try {
                toplevel = window.frameElement == null;
            } catch (e) { }
            if (document.documentElement.doScroll && toplevel) {
                doScrollCheck();
            }
        }
    }
    function fireLoadedEvents() {
        if (!isLoaded) {
            if (!document.body) {
                return setTimeout(fireLoadedEvents, 13);
            }

            isLoaded = true;
            if (contentLoadedEventList) {
                var fn, i = 0;
                while ((fn = contentLoadedEventList[i++])) {
                    fn.call(document);
                }
                contentLoadedEventList = null;
            }
        }
    }
    function doScrollCheck() {
        if (isLoaded) {
            return;
        }
        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
        } catch (error) {
            setTimeout(doScrollCheck, 1);
            return;
        }
        fireLoadedEvents();
    }
    SL.ready = ready;
});



//support
SL().create(function (SL) {
    var support,
    		all,
    		a,
    		select,
    		opt,
    		input,
    		fragment,
    		eventName,
    		i,
    		isSupported,
    		div = document.createElement("div");

    div.setAttribute("className", "t");
    div.innerHTML = "  <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.5;'>a</a><input type='checkbox'/>";

    all = div.getElementsByTagName("*");
    a = div.getElementsByTagName("a")[0];

    //        if (!all || !all.length || !a) {
    //            return;
    //       }

    select = document.createElement("select");
    opt = select.appendChild(document.createElement("option"));
    input = div.getElementsByTagName("input")[0];
    support = {
        leadingWhitespace: (div.firstChild.nodeType === 3),
        tbody: !div.getElementsByTagName("tbody").length
    }
    sl.ready(function () {
        var div = document.createElement("div");
        div.style.width = "1px";
        div.style.paddingLeft = "1px";

        document.body.appendChild(div);
        support.boxModel = div.offsetWidth === 2;
        document.body.removeChild(div);
    });

    SL.Support = support;
});
//json2
SL().create(function (SL) {

    /*
    http://www.JSON.org/json2.js
    2009-08-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html
    */
    var JSON = window['JSON'] || {};
    (function () {

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function (key) {

                return isFinite(this.valueOf()) ?
                   this.getUTCFullYear() + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate()) + 'T' +
                 f(this.getUTCHours()) + ':' +
                 f(this.getUTCMinutes()) + ':' +
                 f(this.getUTCSeconds()) + 'Z' : null;
            };

            String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
        }

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


        function quote(string) {

            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.

            escapable.lastIndex = 0;
            return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
        }


        function str(key, holder) {

            // Produce a string from holder[key].

            var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.

            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.

            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':

                    // JSON numbers must be finite. Encode non-finite numbers as null.

                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':

                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.

                case 'object':

                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.

                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.

                    gap += indent;
                    partial = [];

                    // Is the value an array?

                    if (Object.prototype.toString.apply(value) === '[object Array]') {

                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.

                        v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // If the replacer is an array, use it to select the members to be stringified.

                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            k = rep[i];
                            if (typeof k === 'string') {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {

                        // Otherwise, iterate through all of the keys in the object.

                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.

                    v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

        // If the JSON object does not yet have a stringify method, give it one.

        if (typeof JSON.stringify !== 'function') {
            JSON.stringify = function (value, replacer, space) {

                // The stringify method takes a value and an optional replacer, and an optional
                // space parameter, and returns a JSON text. The replacer can be a function
                // that can replace values, or an array of strings that will select the keys.
                // A default replacer method can be provided. Use of the space parameter can
                // produce text that is more easily readable.

                var i;
                gap = '';
                indent = '';

                // If the space parameter is a number, make an indent string containing that
                // many spaces.

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

                    // If the space parameter is a string, it will be used as the indent string.

                } else if (typeof space === 'string') {
                    indent = space;
                }

                // If there is a replacer, it must be a function or an array.
                // Otherwise, throw an error.

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.

                return str('', { '': value });
            };
        }


        // If the JSON object does not yet have a parse method, give it one.

        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {

                // The parse method takes a text and an optional reviver function, and returns
                // a JavaScript value if the text is a valid JSON text.

                var j;

                function walk(holder, key) {

                    // The walk method is used to recursively walk the resulting structure so
                    // that modifications can be made.

                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


                // Parsing happens in four stages. In the first stage, we replace certain
                // Unicode characters with escape sequences. JavaScript handles many characters
                // incorrectly, either silently deleting them, or treating them as line endings.

                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

                // In the second stage, we run the text against regular expressions that look
                // for non-JSON patterns. We are especially concerned with '()' and 'new'
                // because they can cause invocation, and '=' because it can cause mutation.
                // But just to be safe, we want to reject all unexpected forms.

                // We split the second stage into 4 regexp operations in order to work around
                // crippling inefficiencies in IE's and Safari's regexp engines. First we
                // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                // replace all simple value tokens with ']' characters. Third, we delete all
                // open brackets that follow a colon or comma or that begin the text. Finally,
                // we look to see that the remaining characters are only whitespace or ']' or
                // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                    j = eval('(' + text + ')');

                    return typeof reviver === 'function' ?
                    walk({ '': j }, '') : j;
                }
                throw new SyntaxError('JSON.parse');
            };
        }
    } ());
    SL.Josn = JSON;
});
//cookie
SL().create(function (SL) {
    /**
    * @class
    * @name Cookie
    * @example
    * SL().Cookie.set("name1", "xuzhiwei", ".testxuzhiwei11.com", "/", 1);
    * console.log(SL().Cookie.get("name1"));
    * SL().Cookie.remove("name1");
    * console.log(SL().Cookie.get("name1"));
    */
    var Cookie = function () { };
    Cookie.prototype = {
        /**
        * 获取指定名称的cookie值
        * 
        * @param {String} name cookie名称
        * @return {String} 获取到的cookie值
        */
        get: function (name) {
            /// <summary>
            /// 获取cookie
            /// </summary>
            /// <param name="name"></param>
            /// <returns type=""></returns>
            var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
            var m = window.document.cookie.match(r);
            return (!m ? "" : m[1]);
        },
        /**
        * 设置一个cookie
        * @param {String} name cookie名称
        * @param {String} value cookie值
        * @param {String} domain 所在域名
        * @param {String} path 所在路径
        * @param {Number} hour 存活时间，单位:小时
        * @param {Boolean} secure 是否采用安全传输
        * @return {Boolean} 是否成功
        */
        set: function (name, value, domain, path, hour, secure) {
            /// <summary>
            /// 设置cookie
            /// </summary>
            /// <param name="name"></param>
            /// <param name="value"></param>
            /// <param name="domain"></param>
            /// <param name="path"></param>
            /// <param name="hour"></param>
            /// <returns type=""></returns>
            if (hour) {
                var today = new Date();
                var expire = new Date();
                expire.setTime(today.getTime() + 3600000 * hour);
            }

            var string = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + window.location.host + ";")) + (secure ? " secure" : "");
            window.document.cookie = string;
            return true;
        },
        /**
        * 删除指定cookie,复写为过期
        * 
        * @param {String} name cookie名称
        * @param {String} domain 所在域
        * @param {String} path 所在路径
        */
        remove: function (name, domain, path) {
            /// <summary>
            /// 移除cookie
            /// </summary>
            /// <param name="name"></param>
            /// <param name="domain"></param>
            /// <param name="path"></param>
            window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + window.location.host + ";"));
        }
    };

    SL.Cookie = SL.Cookie || {};
    SL.Cookie = new Cookie();
});
//array
SL().create(function (SL) {
    /**
    * array扩展
    * @class
    * @name array
    */
    var array = function () { };
    array.prototype = {

        /**
        *把数据拷贝到新的数组中
        *@example
        * var initalArray = [1, 2, 3, 4, 6, 6, 7];
        *    var copyArray = slArray.copy(initalArray);
        *    console.log(copyArray);
        */
        copy: function (arr) {
            /// <summary>
            /// 拷贝数组
            /// </summary>
            /// <param name="arr"></param>
            /// <returns type=""></returns>
            return arr.concat();
        },
        /**
        *清空数据
        */
        clear: function (arr) {
            /// <summary>
            ///清空当前数组
            /// </summary>
            /// <param name="arr"></param>
            arr.length = 0;
        },
        /**
        *查找元素在数组中的位置，如果不存在则返回-1
        *@param {Array} arr 要查找的数据
        *@param {Object} obj 要查找的元素
        *@return 返回元素的第一匹配位置 如果不存在则返回-1
        */
        indexOf: function (arr, obj) {
            /// <summary>
            /// 返回值在数组中的位置，如果不存在则返回-1
            /// </summary>
            /// <param name="arr">数组</param>
            /// <param name="obj">值</param>
            /// <returns type="int">位置</returns>
            for (var i = 0, len = arr.length; i < len; i++) {
                if (SL.compare(arr[i], obj)) return i;
            }
            return -1;
        },

        /**
        *查找元素在数组中的位置，如果不存在则返回-1
        *@param {Array} arr 要查找的数据
        *@param {Object} obj 要查找的元素
        *@return 返回元素的最后匹配位置 如果不存在则返回-1
        */
        lastIndexOf: function (arr, obj) {
            /// <summary>
            /// 返回值在数组中最后出现的位置，如果不存在则返回-1
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="obj"></param>
            /// <returns type=""></returns>
            for (var i = arr.length - 1; i >= 0; i--) {
                if (SL.compare(arr[i], obj)) return i;
            }
            return -1;
        },
        /**
        *数组时候存在某元素
        *@param {Array} arr 要查找的数据
        *@param {Object} obj 要查找的元素
        *@return 存在返回true 不存在返回false
        */
        contains: function (arr, obj) {
            /// <summary>
            ///  array元素中 是否包含某个元素
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="obj"></param>
            /// <returns type=""></returns>
            return this.indexOf(arr, obj) > -1;
        },
        /**
        *在指定位置前插入元素
        *@param {Array} arr  数组
        *@param {Object} obj 新元素
        *@param {Number} Index 位置
        *@param {Boolean} isReturnNew 是否返回新的数组
        *@return 如果 isReturnNew为true则返回新的数组 否则返回插入的元素
        */
        insertBefore: function (arr, obj, index, isReturnNew) {
            /// <summary>
            /// 在指定位置前插入元素.
            /// </summary>
            /// <param name="arr">数组</param>
            /// <param name="obj">元素</param>
            /// <param name="index">位置</param>
            /// <param name="isReturnNew">是否返回新插入的值，否则返回新的数组</param>
            /// <returns type=""></returns>
            var o = arr.splice(index, 0, obj);
            if (!isReturnNew) return o;
            return obj;
        },

        /**
        *批量添加元素
        *@param {Array} arr 要查找的数据
        *@param {Array} items 插入的元素数据
        *@example
        *   var slArray = SL().Array;
        *    var initalArray = [1, 2, 3, 4, 6, 6, 7];
        *   slArray.addRange(initalArray, [1, 3, 4]);
        */
        addRange: function (arr, items) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="items"></param>
            arr.push.apply(arr, items);

        },
        /**
        *在指定位置后插入元素
        *@param {Array} arr  数组
        *@param {Object} obj 新元素
        *@param {Number} index 位置
        *@param {Boolean} isReturnNew 是否返回新的数组
        *@return 如果 isReturnNew为true则返回新的数组 否则返回插入的元素
        */
        insertAfter: function (arr, obj, index, isReturnNew) {
            /// <summary>
            /// 在指定位置后插入元素
            /// </summary>
            /// <param name="arr">数组</param>
            /// <param name="obj">元素</param>
            /// <param name="index">位置</param>
            /// <param name="isReturnNew">是否返回新插入的值，否则返回新的数组</param>
            /// <returns type=""></returns>
            var o = arr.splice(index + 1, 0, obj);
            if (!isReturnNew) return o;
            return obj;
        },
        /**
        *替换指定位置处的元素
        *@param {Array} arr  数组
        *@param {Object} obj 新元素
        *@param {Number} Index 位置
        *@param {Boolean} isReturnNew 是否返回新的数组
        *@return 如果 isReturnNew为true则返回新的数组 否则返回插入的元素
        */
        replace: function (arr, obj, index, isReturnNew) {
            /// <summary>
            /// 根据索引 替换当前元素
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="obj"></param>
            /// <param name="index"></param>
            /// <param name="isReturnNew"></param>
            /// <returns type=""></returns>
            var o = arr.splice(index, 1, obj);
            if (!isReturnNew) return o;
            return obj;
        },
        /**
        *移除指定位置处的元素
        *@param {Array} arr  数组
        *@param {Number} Index 位置
        */
        removeAt: function (arr, index) {
            /// <summary>
            /// 移除指定位置的元素
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="index">位置</param>
            /// <returns type=""></returns>
            return arr.splice(index, 1);
        },
        /**
        *移除指定元素
        *@param {Array} arr  数组
        *@param {Object} item 元素
        */
        remove: function (arr, item) {
            /// <summary>
            /// 移除指定元素
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="item"></param>
            /// <returns type="">删除成功返回true</returns>
            var index = -1;
            index = this.indexOf(arr, item)
            while (index >= 0) {
                if (index >= 0) {
                    arr.splice(index, 1);
                }
                index = this.indexOf(arr, item);
            }
            return (index >= 0);

        },
        /**
        *移除重复
        *@param {Array} arr  数组
        *@example
        * var slArray = SL().Array;
        * var initalArray = [1, 2, 3, 4, 6, 6, 7];
        * slArray.deleteRepeater(initalArray);
        */
        deleteRepeater: function (arr) {
            /// <summary>
            /// 删除当前数组中重复的项
            /// </summary>
            /// <param name="arr"></param>
            /// <returns type=""></returns>
            if (arr.length < 2) return arr;
            var aT = arr.concat();
            arr.length = 0;
            for (var i = 0; i < aT.length; i++) {
                arr.push(aT.splice(i--, 1)[0]);
                for (var j = 0; j < aT.length; j++) {
                    if (SL.compare(aT[j], arr[arr.length - 1])) aT.splice(j--, 1);
                }
            }
            return arr;
        },
        /**
        *循环遍历数据 并指定函数动作
        *@param {Array} arr  数组
        *@param {Function} f 要执行的函数 第一个参数为数据元素 第二个参数为索引
        *@param {Object} oThis 为空时候默认为window对象、
        *@example
        * var slArray = SL().Array;
        * var initalArray = [1, 2, 3, 4, 6, 6, 7];
        *slArray.forEach(initalArray, function (data, index) {
        *        console.log(index + "|" + data);
        *    });
        */
        forEach: function (arr, f, oThis) {
            /// <summary>
            /// 模拟C#Foreach
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="f"></param>
            /// <param name="oThis"></param>
            /// <returns type=""></returns>
            oThis = oThis || window;
            if (Array.prototype.forEach) arr.forEach(f, oThis);
            else {
                for (var i = 0, len = arr.length; i < len; i++) {
                    f.call(oThis, arr[i], i);
                }
            }
            return arr;
        },
        /**
        *按照指定规则过滤数据 并返回新数据
        *@param {Array} arr  数组
        *@param {Function} f 要过滤规则的函数 第一个参数为数据元素 第二个参数为索引
        *@param {Object} oThis 为空时候默认为window对象、
        *@example
        * var slArray = SL().Array;
        * var initalArray = [1, 2, 3, 4, 6, 6, 7];
        *  var filterArray = slArray.filter(initalArray, function ( data,index) {
        *     if (index == 1 || data == 7) return true;
        * });
        */
        filter: function (arr, f, oThis) {
            /// <summary>
            /// 按自定义规则过滤数租
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="f"></param>
            /// <param name="oThis"></param>
            /// <returns type=""></returns>
            oThis = oThis || window;
            if (Array.prototype.filter) return arr.filter(f, oThis);
            var a = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (f.call(oThis, arr[i], i)) a.push(arr[i]);
            }
            return a;
        },
        /**
        *按照指定规则把数组映射到新的数组中
        *@param {Array} arr  数组
        *@param {Function} f 要执行映射的函数 第一个参数为数据元素 第二个参数为索引 第三个参数为原始数组
        *@param {Object} oThis 为空时候默认为window对象、
        *@example
        * var slArray = SL().Array;
        * var initalArray = [1, 2, 3, 4, 6, 6, 7];
        *    console.log(slArray.map(initalArray, function (data, index) {
        *       return data + index;
        *    }));
        */
        map: function (arr, f, oThis) {
            /// <summary>
            /// 将数组重新按自己规则映射到新的数组当中
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="f"></param>
            /// <param name="oThis"></param>
            /// <returns type=""></returns>将一个
            oThis = oThis || window;
            if (Array.prototype.map) return arr.map(f, oThis);
            var a = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                a.push(f.call(oThis, arr[i], i, arr));
            }
            return a;
        },

        /**
        * 验证所有元素是不是符合你的规则
        *@param {Array} arr  数组
        *@param {Function} f 要执行验证的函数 第一个参数为数据元素 第二个参数为索引 第三个参数为原始数组
        *@param {Object} oThis 为空时候默认为window对象、
        */
        every: function (arr, f, oThis) {
            /// <summary>
            /// 验证所有元素是不是符合你的规则
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="f"></param>
            /// <param name="oThis"></param>
            /// <returns type=""></returns>
            oThis = oThis || window;
            if (Array.prototype.every) return arr.every(f, oThis);
            for (var i = 0, len = arr.length; i < len; i++) {
                if (!f.call(oThis, arr[i], i, arr)) return false;
            }
            return true;
        },

        /**
        * 验证有存在符合你的规则的元素
        *@param {Array} arr  数组
        *@param {Function} f 要执行验证的函数 第一个参数为数据元素 第二个参数为索引 第三个参数为原始数组
        *@param {Object} oThis 为空时候默认为window对象、
        */
        some: function (arr, f, oThis) {
            /// <summary>
            /// 验证数组中存在符合你的规则的元素
            /// </summary>
            /// <param name="arr"></param>
            /// <param name="f"></param>
            /// <param name="oThis"></param>
            /// <returns type=""></returns>
            oThis = oThis || window;
            if (Array.prototype.some) return arr.some(f, oThis);
            for (var i = 0, len = arr.length; i < len; i++) {
                if (f.call(oThis, arr[i], id, arr)) return true;
            }
            return false;
        }

    };
    SL.Array = SL.Array || {};
    SL.Array = new array();
});
//broswer
SL().create(function (SL) {
    /**
    *浏览器信息 目前只提供版本判断
    *@class
    *@name Browser
    *@example 
    * alert(SL().Browser.chrome)
    * alert(SL().Browser.ie);
    */
    function Browser() {


        var _this = this;
        var pf = navigator.platform.toLowerCase(),
        ua = navigator.userAgent.toLowerCase(), s;

        function fixedVersion(ver, floatLength) {
            ver = ("" + ver).replace(/_/g, ".");
            floatLength = floatLength || 1;
            ver = String(ver).split(".");
            ver = ver[0] + "." + (ver[1] || "0");
            ver = Number(ver).toFixed(floatLength);
            return ver;

        }
        function set(name, version) {
            _this.name = name;
            _this.version = version;
            _this[name] = version;

        }

        (s = ua.match(/msie ([\d.]+)/)) ? set("ie", fixedVersion(s[1])) :
    (s = ua.match(/firefox\/([\d.]+)/)) ? set("firefox", fixedVersion(s[1])) :
    (s = ua.match(/chrome\/([\d.]+)/)) ? set("chrome", fixedVersion(s[1])) :
    (s = ua.match(/opera.([\d.]+)/)) ? set("opera", fixedVersion(s[1])) :
    (s = ua.match(/adobeair\/([\d.]+)/)) ? set("adobeAir", fixedVersion(s[1])) :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? set("safari", fixedVersion(s[1])) : 0;
    };

    Browser.prototype = {
        /** 
        * ie版本判断 如果是ie返回2位IE版本号 如果不是ie则返回0
        * @default 0 
        * @type number 
        * @example 
        */
        ie: 0,
        /** 
        *firefox: 0,
        * firefox版本判断 如果是返回firefox版本号 如果不是firefox则返回0
        * @default 0 
        * @type number 
        * @example 
        */
        firefox: 0,
        /** 
        * chrome版本判断 如果是chrome返回版本号 如果不是chrome则返回0
        * @default 0 
        * @type number 
        * @example 
        */
        chrome: 0,
        /** 
        * opera版本判断 如果是opera返回版本号 如果不是opera则返回0
        * @default 0 
        * @type number 
        * @example 
        */
        opera: 0,
        /** 
        * adobeAir版本判断 如果是adobeAir版本号 如果不是adobeAir则返回0
        * @default 0 
        * @type number 
        * @example 
        */
        adobeAir: 0,
        /** 
        * safari版本判断 如果是safari返回版本号 如果不是safari则返回0
        * @default 0 
        * @type number 
        * @example 
        */
        safari: 0
    }

    SL.Browser = SL.Browser || {};
    SL.Browser = new Browser();
});
//date
SL().create(function (SL) {

    /**
    * date扩展
    * @class
    * @name date
    */
    var date = function () {
        this.LeftPaddingZero = function (source, length) {
            var pre = "",
        negative = (source < 0),
        string = String(Math.abs(source));

            if (string.length < length) {
                pre = (new Array(length - string.length + 1)).join('0');
            }

            return (negative ? "-" : "") + pre + string;
        }

        this.monthNames = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
        this.monthAbbreviations = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
        this.dayNames = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
        this.dayAbbreviations = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
    };

    date.prototype = {
        /**
        *格式化时间
        *@param {Date} date时间
        *@param {String} format格式 日期格式 yyyy：4位数的年 yy:年的后2位  M：正常表示月份 MM：不足10左边补0 MMM:英文表示 NNN英文缩写 d:天数 dd:不足10补充0  EE：英文星期 E英文星期缩写  h:12小时制 H 小时制 m:分钟 mm不足2位补0 s:秒钟 ss不足2位补0
        */
        format: function (source, pattern) {
            if ('string' != typeof pattern) {
                return source.toString();
            }

            function replacer(patternPart, result) {
                pattern = pattern.replace(patternPart, result);
            }

            var pad = this.LeftPaddingZero;
            year = source.getFullYear(),
        month = source.getMonth() + 1,
        date2 = source.getDate(),
        hours = source.getHours(),
        minutes = source.getMinutes(),
        seconds = source.getSeconds();

            replacer(/yyyy/g, pad(year, 4));
            replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
            replacer(/MM/g, pad(month, 2));
            replacer(/M/g, month);
            replacer(/dd/g, pad(date2, 2));
            replacer(/d/g, date2);

            replacer(/HH/g, pad(hours, 2));
            replacer(/H/g, hours);
            replacer(/hh/g, pad(hours % 12, 2));
            replacer(/h/g, hours % 12);
            replacer(/mm/g, pad(minutes, 2));
            replacer(/m/g, minutes);
            replacer(/ss/g, pad(seconds, 2));
            replacer(/s/g, seconds);

            return pattern;
        },
        parseString: function (source) {
            var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
            if ('string' == typeof source) {
                if (reg.test(source) || isNaN(Date.parse(source))) {
                    var d = source.split(/ |T/),
                d1 = d.length > 1
                        ? d[1].split(/[^\d]/)
                        : [0, 0, 0],
                d0 = d[0].split(/[^\d]/);
                    return new Date(d0[0] - 0,
                            d0[1] - 1,
                            d0[2] - 0,
                            d1[0] - 0,
                            d1[1] - 0,
                            d1[2] - 0);
                } else {
                    return new Date(source);
                }
            }

            return new Date();

        },
        isBefore: function (date1, date2) {
            /// <summary>
            /// 判断
            /// </summary>
            /// <param name="date1"></param>
            /// <param name="date2"></param>
            /// <returns type=""></returns>
            if (date1 === null || date2 === null) return false;
            return (date1.getTime() < date2.getTime());
        },
        /**
        *将指定的数目（月数，天数，年数等等）加到当前时间上
        *@param {Date} date时间
        *@param {String} part 数目的类型（y:年 M月 d天 h小时 m分 s秒）
        */
        add: function (date, part, number) {

            /// <summary>
            /// 将指定的数目（月数，天数，年数等等）加到当前时间上
            /// </summary>
            /// <param name="date">日期</param>
            /// <param name="part">数目的类型（y:年 M月 d天 h小时 m分 s秒）</param>
            /// <param name="number"></param>
            /// <returns type=""></returns>
            if (typeof (part) == "undefined" || part == null || typeof (number) == "undefined" || number == null) {
                return date;
            }
            number = +number;
            if (part == 'y') { // year
                date.setFullYear(date.getFullYear() + number);
            }
            else if (part == 'M') { // Month
                date.setMonth(date.getMonth() + number);
            }
            else if (part == 'd') { // Day
                date.setDate(date.getDate() + number);
            }
            else if (part == 'w') { // Weekday工作日 //没测试
                var step = (number > 0) ? 1 : -1;
                while (number != 0) {
                    date.add('d', step);
                    while (date.getDay() == 0 || date.getDay() == 6) {
                        arguments.callee('d', step);
                    }
                    number -= step;
                }
            }
            else if (part == 'h') { // Hour
                date.setHours(date.getHours() + number);
            }
            else if (part == 'm') { // Minute
                date.setMinutes(date.getMinutes() + number);
            }
            else if (part == 's') { // Second
                date.setSeconds(date.getSeconds() + number);
            }
            return date;

        }
    };

    SL.Date = SL.Date || {};
    SL.Date = new date();
});
//string
SL().create(function (SL) {
    /*
    数组方式 拼接字符串 .高效... 使用前先实例化.
    */
    function StringBuilder(sFirstString) {
        this._aStr = [];
        if (Object.prototype.toString.call(sFirstString) == '[object String]') this._aStr.push(sFirstString);
    };
    StringBuilder.prototype = {
        constructor: StringBuilder,
        append: function (str) {
            this._aStr.push(str);
            return this;
        },
        valueOf: function () {
            return this._aStr.join('');
        },
        toString: function () {
            return this._aStr.join('');
        }
    };

    /**
    *string操作扩展
    *@class
    *@name string
    */
    var string = function () { };
    string.prototype = {
        empty: '',
        repeat: function (sChar, nCount) {
            /// <summary>
            /// 返回nCount重复的字符串
            /// </summary>
            /// <param name="sChar"></param>
            /// <param name="nCount"></param>
            /// <returns type=""></returns>
            return new Array(nCount + 1).join(sChar);
        },
        /**
        *返回对象 .Char str中出现次数最多的字符 .length 出现的次数
        */
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
        /**
        *模拟 c#上中的Format()方法
        *@example 
        *format("{0}",1)
        */
        format: function (str) {
            /// <summary>
            /// 模拟 c#上中的Format()方法
            /// </summary>
            /// <param name="str"></param>
            /// <returns type=""></returns>
            var args = arguments;
            return new String(str).replace(/\{(\d+)\}/g,
        function (m, i) {
            i = parseInt(i);
            return args[i + 1];
        }).toString();
        },
        /**
        *替换全部匹配字符..a替换为b
        */
        replaceAll: function (str, a, b) {
            /// <summary>
            /// 替换全部匹配字符..a替换为b
            /// </summary>
            /// <param name="str"></param>
            /// <param name="a"></param>
            /// <param name="b"></param>
            /// <returns type=""></returns>
            return new String(str).replace(new RegExp(this.isInList(a, ['\\', '^', '$', '*', '+', '.', '|']) ? '\\' + a : a, 'g'), b).toString();
        },
        /**
        *字符串转化成字符数组
        */
        toArray: function (str) {
            return new String(str).split('');
        },
        /**
        *验证字符串是否在所给参数列表中 参数可以是数组 也可以是多个字符串或多个数组
        */
        isInList: function (str, args) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="str"></param>
            /// <param name="args"></param>
            /// <returns type=""></returns>
            var length = arguments.length;
            for (var i = 1; i < length; i++) {
                if (SL.compare(str, arguments[i])) {
                    return true;
                }
                //数组
                else if (Object.prototype.toString.call(arguments[i]) == '[object Array]') {
                    for (var j = 0, _length = arguments[i].length; j < _length; j++) {
                        if (SL.compare(str, arguments[i][j])) return true;
                    }
                }
            }
            return false;
        },
        /**
        *验证字符串str 是否 包含参数containedStr
        */
        isContains: function (str, containedStr) {
            /// <summary>
            /// 验证字符串str 是否 包含参数containedStr
            /// </summary>
            /// <param name="str"></param>
            /// <param name="containedStr"></param>
            /// <returns type=""></returns>
            return new String(str).indexOf(containedStr) > -1;
        },
        isContained: function (str, containsStr) {
            /// <summary>
            /// 验证字符串str是否 被参数containsStr包含
            /// </summary>
            /// <param name="str"></param>
            /// <param name="containsStr"></param>
            /// <returns type=""></returns>
            return new String(containsStr).indexOf(str) > -1;
        },
        isStartWith: function (str, startStr) {
            /// <summary>
            /// 判断字符串str 是否以 startStr开始
            /// </summary>
            /// <param name="str"></param>
            /// <param name="startStr"></param>
            /// <returns type=""></returns>
            return (new String(str).indexOf(startStr) == 0);
        },
        insert: function (str, nPosition, sInsertStr) {
            /// <summary>
            /// 在字符串指定位置后面插入指定字符串 如 "abc" 位置0 插入"d" 则 为dabc
            /// </summary>
            /// <param name="str"></param>
            /// <param name="nPosition"></param>
            /// <param name="sInsertStr"></param>
            /// <returns type=""></returns>
            str = new String(str);
            sInsertStr = sInsertStr || '';
            if (nPosition <= 0) return sInsertStr + str;
            if (nPosition >= str.length) return str + sInsertStr;
            return str.substr(0, nPosition) + sInsertStr + str.substr(nPosition);
        },
        /**
        *模拟 c# string.padLeft 即 str.length<nLen 时  str左边补充 nLen-length 个 paddingChar字符
        */
        padLeft: function (str, nLen, sPaddingChar) {
            /// <summary>
            /// 模拟 c# string.padLeft 即 str.length<nLen 时  str左边补充 nLen-length 个 paddingChar字符
            /// </summary>
            /// <param name="str"></param>
            /// <param name="nLen"></param>
            /// <param name="sPaddingChar"></param>
            /// <returns type=""></returns>
            str = new String(str);
            var len = str.length;
            if (len >= nLen) return str.toString();
            return this.repeat(sPaddingChar || ' ', (nLen - len) || 0) + str;
        },
        padRight: function (str, nLen, sPaddingChar) {
            /// <summary>
            /// 模拟 c# string.padRight 即 str.length<nLen 时  str右边补充 nLen-length 个 paddingChar字符
            /// </summary>
            /// <param name="str"></param>
            /// <param name="nLen"></param>
            /// <param name="sPaddingChar"></param>
            /// <returns type=""></returns>
            str = new String(str);
            var len = str.length;
            if (len >= nLen) return str.toString();
            return str + this.repeat(sPaddingChar || ' ', (nLen - len) || 0);
        },
        isEndWith: function (str, endStr) {
            /// <summary>
            /// 判断字符串str 是否以 endStr 结束
            /// </summary>
            /// <param name="str"></param>
            /// <param name="endStr"></param>
            /// <returns type=""></returns>
            var tLen = new String(str).length;
            var len = new String(endStr).length;
            if (len > tLen) return false;
            return (len == 0 || new String(str).substr(tLen - len) == endStr);
        },
        /**
        *去全部空格
        */
        trimAll: function (str) {
            /// <summary>
            /// 去全部空格
            /// </summary>
            /// <param name="str"></param>
            /// <returns type=""></returns>
            return new String(str).replace(/\s/g, '').toString();
        },
        /**
        *去前后空格
        */
        trim: function (str) {
            /// <summary>
            /// 去前后空格
            /// </summary>
            /// <param name="str"></param>
            /// <returns type=""></returns>
            return new String(str).replace(/(^\s*)|(\s*$)/g, '').toString();
        },
        /**
        *去前空格
        */
        lTrim: function (str) {
            /// <summary>
            /// 去前空格
            /// </summary>
            /// <param name="str"></param>
            /// <returns type=""></returns>
            return new String(str).replace(/^\s*/g, '').toString();
        },
        rTrim: function (str) {
            /// <summary>
            /// 去后空格
            /// </summary>
            /// <param name="str"></param>
            /// <returns type=""></returns>
            return new String(str).replace(/\s*$/g, '').toString();
        },
        createBuffer: function (sFirstString) {
            return new StringBuilder(sFirstString);
        }
    };
    SL.String = SL.String || {};
    SL.String = new string();



});
//number
SL().create(function (SL) {
    /**
    * number扩展
    * @class
    * @name number
    * @example 
    */
    var number = function () { };
    number.prototype = {
        /**
        *去除非数字字符   比如3df12335.52saa return 312335.52  保留-  .
        */
        stripNonNumeric: function (str) {
            /// <summary>
            /// 去除非数字字符   比如3df12335.52saa return 312335.52  保留-  .
            /// </summary>
            /// <param name="str"></param>
            /// <returns type=""></returns>
            str += '';
            var rgx = /^\d|\.|-$/;
            var out = '';
            for (var i = 0; i < str.length; i++) {
                if (rgx.test(str.charAt(i))) {
                    if (!((str.charAt(i) == '.' && out.indexOf('.') != -1) ||
             (str.charAt(i) == '-' && out.length != 0))) {
                        out += str.charAt(i);
                    }
                }
            }
            return out;

        },
        /** 
        *格式化数字
        *@param {number} num
        *@param {string} format 格式       
        *@example 
        *‘0' - (123456) 表示没有不保留小数位
        * ‘0.00′ - (123456.78) 保留2位小数位
        *‘0.0000′ - (123456.7890) 保留4位小数位 不够的右端补充0
        *‘0,000.00′ - (123,456.78) 保留2位小数位 并且有冒号隔开
        */
        format: function (num, format) {
            /// <summary>
            /// 格式化数字
            /// ‘0' - (123456) 表示没有不保留小数位
            ///‘0.00′ - (123456.78) 保留2位小数位
            ///‘0.0000′ - (123456.7890) 保留4位小数位 不够的右端补充0
            ///‘0,000.00′ - (123,456.78) 保留2位小数位 并且有冒号隔开
            /// </summary>
            /// <param name="num"></param>
            /// <param name="format"></param>
            /// <returns type=""></returns>

            // .replace(/(\d{1,2})(?=(\d{3})+\b)/g,"$1,")

            var hasComma = -1 < format.indexOf(','),
    psplit = this.stripNonNumeric(format).split('.'),
    that = Number(this.stripNonNumeric(num));

            if (1 < psplit.length) {
                that = that.toFixed(psplit[1].length);
            }
            else if (2 < psplit.length) {
                throw Error('无效的格式符:' + format);
            }
            else {
                that = that.toFixed(0);
            }

            var fnum = that.toString();

            if (hasComma) {
                psplit = fnum.split('.');

                var cnum = psplit[0],
      parr = [],
      j = cnum.length,
      m = Math.floor(j / 3),
      n = cnum.length % 3 || 3;
                for (var i = 0; i < j; i += n) {
                    if (i != 0) { n = 3; }
                    parr[parr.length] = cnum.substr(i, n);
                    m -= 1;
                }
                fnum = parr.join(',');
                if (psplit[1]) { fnum += "." + psplit[1]; }
            }

            return format.replace(/[\d,?\.?]+/, fnum);


        }
    }
    SL.Number = SL.Number || {};
    SL.Number = new number();

});
//ajax
SL().create(function (SL) {
    // var uu = new SL();
    function now() {
        return (new Date).getTime();
    }
    var jsc = now(),
    rscript = /<script(.|\s)*?\/script>/gi,
    rselectTextarea = /select|textarea/i,
    rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,
    //jsonp临时结尾
    jsre = /=\?(&|$)/,
    //querying
    rquery = /\?/,
    //时间戳
    rts = /(\?|&)_=.*?(&|$)/,
    //URL
    rurl = /^(\w+:)?\/\/([^\/?#]+)/,
    r20 = /%20/g,
    lastModified = {},
	etag = {};
    if (!window.XMLHttpRequest) {
        window.XMLHttpRequest = function () {
            var actives = ["Microsoft.XMLHTTP", "Msxml2.XMLHTTP"];
            for (var i = 0; i < actives.length; i++) {
                try {
                    var xmlhttprequest = new ActiveXObject(actives[i]);
                    return xmlhttprequest;
                } catch (oError) {
                }
            }

        }
    };

    /**
    *@ignore  事件处理
    */
    var oHandleEvent = {
        success: function (options, data, xhr) {
            options.onSuccess.call(options.callbackContext, data, xhr);
        },
        error: function (options, status, xhr) {
            options.onError.call(options.callbackContext, status, xhr);
        },
        timeout: function (options, status, xhr) {
            options.onTimeout.call(options.callbackContext, status, xhr);
        }
    }
    /**
    *@ignore 一些版主 比如判断请求是否成功等等
    */
    var oAjaxHelper = {
        getData: function (xhr, type) {

            var ct = xhr.getResponseHeader("content-type"),
			xml = type === "xml" || !type && ct && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === "parsererror") {
                throw "parsererror";
            }

            if (typeof data === "string") {
                //用户自定义返回json
                if (type === "json") {
                    if (typeof SL.Josn === "object" && SL.Josn.parse) {
                        data = SL.Josn.parse(data);
                    } else {
                        data = (new Function("return " + data))();
                    }
                }
            }
            return data;

        },
        isRequestSuccess: function (xhr) {
            try {
                return (!xhr.status && location.protocol == "file:")
                    || (xhr.status >= 200 && xhr.status < 300)
                    || (xhr.status == 304)
                    || (navigator.userAgent.indexOf("Safari") > -1 && typeof xhr.status == "undefined");
            } catch (e) {

            }
            return false;

        },
        httpNotModified: function (xhr, url) {
            var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

            if (lastModified) {
                lastModified[url] = lastModified;
            }

            if (etag) {
                etag[url] = etag;
            }

            // Opera returns 0 when status is 304
            return xhr.status === 304 || xhr.status === 0;
        }
    }
    var defaultSetting = {
        type: "POST",
        data: null,
        dataType: "text",
        contentType: "application/x-www-form-urlencoded",
        onSuccess: function () { },
        onError: function () { },
        onComplete: function () { },
        onTimeout: function () { },
        isAsync: true,
        timeout: 30000,
        url: "",
        cache: false,
        callbackContext: null
    }
    function ajax(options) {
        options = SL.extend(defaultSetting, options);
        var isComplete = false, status,
        xhr = new window.XMLHttpRequest(), jsonp, callbackContext = options.callbackContext || options;
        //传进来的data没经过处理
        if (options.data && typeof options.data != "string") {
            options.data = SL.param(options.data);
        }
        // 处理jsonp
        if (options.dataType === "jsonp") {
            if (type === "GET") {
                if (!jsre.test(options.url)) {
                    //把url 加上callback=?
                    options.url += (rquery.test(options.url) ? "&" : "?") + (options.jsonp || "callback") + "=?";
                }
            } else if (!options.data || !jsre.test(options.data)) {
                options.data = (options.data ? options.data + "&" : "") + (options.jsonp || "callback") + "=?";
            }
            options.dataType = "json";
        }
        //json类型 并且包含callback=?可能要执行跨域操作
        if (options.dataType === "json" && (options.data && jsre.test(options.data) || jsre.test(options.url))) {
            jsonp = options.jsonpCallback || ("jsonp" + jsc++);
            // 把callback=?替换成callback=jsonp
            if (options.data) {
                options.data = (options.data + "").replace(jsre, "=" + jsonp + "$1");
            }
            options.url = options.url.replace(jsre, "=" + jsonp + "$1");
            //当做sript处理
            options.dataType = "script";
            // jsonp回调函数
            window[jsonp] = window[jsonp] || function (tmp) {
                data = tmp;
                options.onSuccess(data, xhr);
                window[jsonp] = undefined;
                try {
                    delete window[jsonp];
                } catch (e) { }

                if (head) {
                    head.removeChild(script);
                }
            };
        }
        if (options.dataType === "script" && options.cache === null) {
            options.cache = false;
        }
        //是否缓存 GET会有缓存危险 POST不会有 
        if (options.cache === false && options.type === "GET") {
            var ts = now();
            //如果已经有时间戳了 替换
            var ret = options.url.replace(rts, "$1_=" + ts + "$2");
            //判断是否有时间戳了 没有的话加上时间戳
            options.url = ret + ((ret === options.url) ? (rquery.test(options.url) ? "&" : "?") + "_=" + ts : "");
        }
        //GET附加data到url 
        if (options.data && options.type === "GET") {
            options.url += (rquery.test(options.url) ? "&" : "?") + options.data;
        }
        //判断是否跨域
        var parts = rurl.exec(options.url),
			remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);
        // jsonp操作 或者从异域加载js
        if (options.dataType === "script" && type === "GET" && remote) {
            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            var script = document.createElement("script");
            script.src = options.url;
            if (options.scriptCharset) {
                script.charset = options.scriptCharset;
            }
            if (!jsonp) {
                var done = false;
                // 脚本下载完毕 执行
                script.onload = script.onreadystatechange = function () {
                    if (!done && (!this.readyState ||
							this.readyState === "loaded" || this.readyState === "complete")) {
                        done = true;
                        oHandleEvent.success(options, "", xhr);

                        // 防止内存泄露
                        script.onload = script.onreadystatechange = null;
                        if (head && script.parentNode) {
                            head.removeChild(script);
                        }
                    }
                };
            }
            //用insertBefore防止在ie6下head存在base节点时候的bug
            head.insertBefore(script, head.firstChild);
            return undefined;
        }
        xhr.open(options.type, options.url, options.isAsync);

        try {
            if (options.data && options.contentType) {
                xhr.setRequestHeader("Content-Type", options.contentType);
            }
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            if (options.ifModified) {
                if (lastModified[s.url]) {
                    xhr.setRequestHeader("If-Modified-Since", lastModified[options.url]);
                }

                if (etag[options.url]) {
                    xhr.setRequestHeader("If-None-Match", etag[options.url]);
                }
            }

        } catch (e) { }

        var onreadystatechange = xhr.onreadystatechange = function (isTimeout) {
            if (xhr.readyState == 0) {
                if (intervalState) {
                    clearInterval(intervalState);
                    intervalState = null;
                }
            }
            else if (!isComplete && xhr && (xhr.readyState == 4 || isTimeout == "timeout")) {
                isComplete = true;
                if (intervalState) {
                    clearInterval(intervalState);
                    intervalState = null;
                }

                status = isTimeout == "timeout" ? "timeout" :
                !oAjaxHelper.isRequestSuccess(xhr) ? "error" :
                options.ifModified && oAjaxHelper.httpNotModified(xhr, options.url) ? "notmodified" :
                "success";
                if (status == "success" || status === "notmodified") {
                    try {
                        data = oAjaxHelper.getData(xhr, options.dataType);
                    } catch (e) {
                        status = "parsererror";
                    }
                }
                if (status == "success") {
                    oHandleEvent.success(options, data, xhr);

                } else if (status == "timeout") {
                    oHandleEvent.timeout(options, status, xhr);
                } else {
                    oHandleEvent.error(options, status, xhr);
                }

                // 防止内存泄露
                if (options.async)
                    xhr = null;
            }

        };
        //异步操作 超时判断
        if (options.isAsync) {
            var intervalState = setInterval(onreadystatechange, 10);
            //超时判断
            if (options.timeout > 0) {
                setTimeout(function () {
                    if (xhr) {
                        if (!isComplete) {
                            onreadystatechange("timeout");
                        }
                        xhr.abort();
                    }

                }, options.timeout);
            }
        }

        try {
            xhr.send(options.type === "POST" ? options.data : null);
        } catch (e) {

        }
        return xhr;
    };
    SL.Ajax = function (options) {
        ajax(options);
    }

});
//support
SL().create(function (SL) {
    var support,
    		all,
    		a,
    		select,
    		opt,
    		input,
    		fragment,
    		eventName,
    		i,
    		isSupported,
    		div = document.createElement("div");

    div.setAttribute("className", "t");
    div.innerHTML = "  <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.5;'>a</a><input type='checkbox'/>";

    all = div.getElementsByTagName("*");
    a = div.getElementsByTagName("a")[0];

    //        if (!all || !all.length || !a) {
    //            return;
    //       }

    select = document.createElement("select");
    opt = select.appendChild(document.createElement("option"));
    input = div.getElementsByTagName("input")[0];
    support = {
        leadingWhitespace: (div.firstChild.nodeType === 3),
        tbody: !div.getElementsByTagName("tbody").length
    }
    sl.ready(function () {
        var div = document.createElement("div");
        div.style.width = "1px";
        div.style.paddingLeft = "1px";

        document.body.appendChild(div);
        support.boxModel = div.offsetWidth === 2;
        document.body.removeChild(div);
    });

    SL.Support = support;
});
//offset
sl.create(function () {
    function offset() {
        this.init = function () {
            if (this.Initialed) return;
            var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat(sl.css(body, "marginTop")) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

            sl.extend(container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" });

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
        };
        this.Initialed = false;
    }

    offset.prototype = {
        bodyOffset: function (body) {
            var top = body.offsetTop, left = body.offsetLeft;

            this.init();

            if (this.doesNotIncludeMarginInBodyOffset) {
                top += parseFloat(sl.css(body, "marginTop")) || 0;
                left += parseFloat(sl.css(body, "marginLeft")) || 0;
            }

            return { top: top, left: left };
        },
        getOffset: function (node) {
            if ("getBoundingClientRect" in document.documentElement) {

                if (!node || !node.ownerDocument) {
                    return null;
                }

                if (node === node.ownerDocument.body) {
                    return this.bodyOffset(node);
                }
                var box = node.getBoundingClientRect();
                if (!box || node.ownerDocument.documentElement == node) {
                    return box ? { top: box.top, left: box.left} : { top: 0, left: 0 };
                }



                var doc = node.ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top = box.top + (self.pageYOffset || sl.Support.boxModel && docElem.scrollTop || body.scrollTop) - clientTop,
			left = box.left + (self.pageXOffset || sl.Support.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;

                return { top: top, left: left };

            }
        },
        setOffset: function (node, options) {

            var computedStyle = document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(node, null) : node.currentStyle;
            if (/static/.test(css(node, "position"))) {
                css(node, "position", "relative");
            }
            var curOffset = this.getOffset(node);
            curTop = parseFloats(computedStyle.left) || 0,
		curLeft = parseInt(computedStyle.left) || 0;


            var props = {
                top: (options.top - curOffset.top) + curTop + "px",
                left: (options.left - curOffset.left) + curLeft + "px"
            };
            sl.css(node, props);
        },

        position: function (elem) {

            var offsetParent = this.offsetParent(elem), offset = this.getOffset(elem);
            parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? { top: 0, left: 0} : this.getOffset(offsetParent);

            offset.top -= parseFloat(sl.css(elem, "marginTop")) || 0;
            offset.left -= parseFloat(sl.css(elem, "marginLeft")) || 0;

            parentOffset.top += parseFloat(sl.css(offsetParent, "borderTopWidth")) || 0;
            parentOffset.left += parseFloat(sl.css(offsetParent, "borderLeftWidth")) || 0;

            // (top-parentTop-parentBodrder-maigin)
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },

        offsetParent: function (elem) {

            var offsetParent = elem.offsetParent || document.body;
            while (offsetParent && (!/^(?:body|html)$/i.test(offsetParent.nodeName) && sl.css(offsetParent, "position") === "static")) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent;
        }

    }

    var _offset = new offset();
    sl.offset = function (nodes, value) {
        nodes = sl.Convert.convertToArray(nodes, null, sl);
        return sl.access(nodes, "offset", value, _offset.getOffset, _offset.setOffset, _offset, null);
    }
    sl.position = function (elem) {
        return _offset.position(elem);
    };
    var scrollFun = {};
    sl.each(["scrollLeft", "scrollTop"], function (index, name) {
        scrollFun[name] = function (elem, nouse, value) {

            var win = ("scrollTo" in elem && elem.document) ? elem : (elem.nodeType == 9) ? (elem.defaultView || elem.parentWindow) : false;
            if (!elem) {
                return null;
            }

            if (value !== undefined) {
                if (win) {
                    win.scrollTo(
						!index ? value : sl.scrollLef(win),
						 index ? value : sl.scrollTop(win)
					);
                }
                else {
                    elem[name] = value;
                }
            }
            else {
                return win ? ("pageXOffset" in win) ? win[index ? "pageYOffset" : "pageXOffset"] :
	(win.document.documentElement[name] ||
					win.document.body[name]) :
				elem[name];


            }
        };
        sl[name] = function (nodes, value) {
            nodes = sl.Convert.convertToArray(nodes, null, sl);
            return sl.access(nodes, name, value, scrollFun[name], scrollFun[name], null, null);
        };

    });
});
//css
SL().create(function () {

    var colorNameMap = {
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
    };

    var curCSS, isQuirk = (document.documentMode) ? (document.documentMode == 5) ? true : false : ((document.compatMode == "CSS1Compat") ? false : true),
	ralpha = /alpha\([^)]*\)/,
	ropacity = /opacity=([^)]*)/,
    rnumpx = /^-?\d+(?:px)?$/i,
	rupper = /([A-Z])/g,
	rnum = /^-?\d/,
    rrgb = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
    isComputed = !!(document.defaultView && document.defaultView.getComputedStyle),
    cssProps = { "float": isComputed ? "cssFloat" : "styleFloat" },
    cssNormalTransform = {
        letterSpacing: 0,
        fontWeight: 400,
        lineHeight: 1
    },
    // 计算元素宽高时需要用到的辅助参数
	sizeParams = {
	    'Width': ['Left', 'Right'],
	    'Height': ['Top', 'Bottom']
	},
    //哪些属性不要自动添加单位
    cssNumber = {
        "fillOpacity": true,
        "fontWeight": true,
        "lineHeight": true,
        "opacity": true,
        "orphans": true,
        "widows": true,
        "zIndex": true,
        "zoom": true
    },
    cssHooks = {};


    var cssHelper = {
        //快速切换属性 一般获取某个样式的值 目前主要用在display:none的时候 获取height width
        //把display快速切换到block然后切换回来
        swap: function (elem, options, callback, args) {
            var old = {};
            for (var name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }
            callback.apply(elem, args);
            for (var name in options) {
                elem.style[name] = old[name];
            }
        },
        //把样式格式化成驼峰式 backgroundColor
        camelize: function (attr) {
            return attr.replace(/\-(\w)/g, function (all, letter) {
                return letter.toUpperCase();
            });
        },
        //把样式格式化成横线连接试 background-color
        hyphenize: function (attr) {
            return attr.replace(/([A-Z])/g, "-$1").toLowerCase();
        },
        //把样式统一转换成16进制形式
        parseColor: function (elem, name, value) {
            function rgb2hex(rgb) {
                rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                return "#" + tohex(rgb[1]) + tohex(rgb[2]) + tohex(rgb[3])
            }
            function tohex(x) {
                var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
                return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
            }

            if (!!colorNameMap[value]) {
                value = colorNameMap[value]
            }

            if (value == "inherit") {
                return getStyle(elem, name);
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
    if (document.defaultView && document.defaultView.getComputedStyle) {
        curCSS = function (elem, name) {
            var doc = elem.ownerDocument,
			defaultView = doc.defaultView,
			val;

            if (defaultView) {
                val = defaultView.getComputedStyle(elem, null)[name];
            }
            if (val === '') {
                val = elem.style[name];
            }
            return val;
        };
    } else if (document.documentElement.currentStyle) {
        curCSS = function (elem, name) {
            var val = elem.currentStyle && elem.currentStyle[name],
			style = elem.style,
			left, rsLeft;

            // 取不到计算样式就取其内联样式
            if (val === null) {
                val = style[name];
            }

            // 换换成px采用DE大神的杰作
            if (!rnumpx.test(val) && rnum.test(val)) {
                left = style.left;
                rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;
                if (rsLeft) {
                    elem.runtimeStyle.left = elem.currentStyle.left;
                }
                /*
                注意到em这个单位用在例如left、margin、width等属性上的含义： 
                即相对于元素自身的字体大小来定位，这里不同于fontSize，仅fontSize是相对于父级元素的字体大小。 
                例如width:5em相当于宽度为5个自身元素的字体大小。 
                为了得到以像素为单位的CSS值，用Dean提起的sstyle.left与pixLeft结合的方法去得到px为单位的值，
                当在currentStyle得到的值为5em时，
                如果设置style.left为5em，这样得来的left值为字体大小的5倍，是实际上要的结果的5倍。 
                */
                style.left = name === 'fontSize' ? '1em' : (val || 0);
                val = style.pixelLeft + 'px';
                style.left = left;
                if (rsLeft) {
                    elem.runtimeStyle.left = rsLeft;
                }
            }
            // IE6-8中borderWidth如果为0px返回的是medium，需进行修复
            if (val === 'medium' && /^border(\w)+Width$/.test(name)) {
                return '0px';
            }

            return val === "" ? "auto" : val;
        };
    }

    function getWH(elem, style) {
        var val = style === "width" ? elem.offsetWidth : elem.offsetHeight;
        if (val > 0) {
            var values = (style == 'width') ? ['left', 'right'] : ['top', 'bottom'];
            if (isQuirk) {
                return elem[cssHelper.camelize("offset-" + style)];
            } else {
                var client = parseFloat(elem[cssHelper.camelize("client-" + style)]),
                                paddingA = parseFloat(getStyle(elem, "padding-" + values[0])),
                                paddingB = parseFloat(getStyle(elem, "padding-" + values[1]));
                return client - paddingA - paddingB;
            }
        }
        else {
            return val;
        }

    }
    sl.each({ Width: 'width', Height: 'height' }, function (i, d) {
        cssHooks[d] = {
            get: function (elem) {
                if (sl.InstanceOf.Window(elem)) {
                    return elem.document.documentElement["client" + i] || document.body["client" + i];
                }
                if (elem.nodeType && elem.nodeType == 9) {
                    if (elem.nodeType === 9) {

                        var doc = elem.documentElement;
                        // support:IE6
                        if (doc["client" + i] >= doc["scroll" + i]) {
                            return doc["client" + i];
                        }

                        return Math.max(
					elem.body["scroll" + i], doc["scroll" + i],
					elem.body["offset" + i], doc["offset" + i]
				);
                    }

                }
                if (elem.offsetWidth !== 0 || getStyle(elem, "display") !== "none") {
                    return getWH(elem, d);
                } else {
                    cssHelper.swap(elem, { position: "absolute", visibility: "hidden", display: "block" }, getWH, [elem, style]);
                }
            }
        }
        //inner要加padding
        //outer要加padding  boarder
        sl.each({ Inner: "inner", Outer: "outer" }, function (m, n) {
            cssHooks[n + i] = {
                get: function (elem) {
                    var fixAtrrs = sizeParams[i], val = parseFloat(getStyle(elem, d)), isOuter = (n == "outer");
                    if (!sl.InstanceOf.Window(elem)) {
                        sl.each(fixAtrrs, function (f, g) {
                            val += parseFloat(getStyle(elem, "padding" + g));
                            if (isOuter) {
                                val += parseFloat(getStyle(elem, "border" + g + "Width"));
                            }
                        });
                    };
                    return val;
                }
            }
        });
    });

    cssHooks["opacity"] = {
        //0-100
        get: function (elem) {
            var val
            if (elem.currentStyle) {
                return (val = ropacity.exec(elem.currentStyle.filter)) ? parseInt(val[1]) : 100;
            }
            return (val = elem.ownerDocument.defaultView.getComputedStyle(elem, null).opacity) ? val * 100 : 100;

        },
        set: function (elem, opacityValue) {
            opacityValue = parseInt(opacityValue, 10);
            opacityValue = opacityValue > 100 ? 100 : opacityValue < 0 ? 0 : opacityValue;
            if (!elem.currentStyle) {
                elem.style.opacity = opacityValue / 100;
            } else {
                var style = elem.style, filter = style.filter;
                style.zoom = 1;
                var opacityString = opacityValue + "" === "NaN" ? "" : "alpha(opacity=" + opacityValue + ")";
                style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacityString) : opacityString;
            }
            return opacityValue;

        }
    };

    sl.each({ padding: 'paddingTop paddingRight paddingBottom paddingLeft',
        margin: 'marginTop marginRight marginBottom marginLeft',
        borderWidth: 'borderTopWidth borderRightWidth borderBottomWidth borderLeftWidth',
        borderColor: 'borderTopColor borderRightColor borderBottomColor borderLeftColor',
        borderRadius: 'borderTopLeftRadius borderTopRightRadius borderBottomRightRadius borderBottomLeftRadius'
    }, function (name, vals) {
        vals = vals.split(' ');
        cssHooks[name] = {
            get: function (elem) {
                return getStyle(elem, vals[0]) + ' ' +
				getStyle(elem, vals[1]) + ' ' +
				getStyle(elem, vals[2]) + ' ' +
				getStyle(elem, vals[3]);
            }
        };
    });
    //暂时不处理 调用offset的position
    //    sl.each(["left", "top"], function (i, d) {
    //        cssHooks[d] = {
    //            get: function (elem) {
    //                var value = getStyle(elem, d);
    //                if (/(top|left)/.test(d) && value == "auto") {
    //                
    //                }
    //            }
    //        };
    //    });

    var getStyle = function (elem, name) {
        var val, num, hooks,
			origName = cssHelper.camelize(name), name = cssProps[origName] || origName, hooks = cssHooks[name];

        if (hooks && "get" in hooks) {
            val = hooks.get(elem);
        }
        if (val === undefined) {
            val = curCSS(elem, name);
        }
        if (val === "normal" && name in cssNormalTransform) {
            val = cssNormalTransform[name];
        }

        // 统一输出RGB的颜色值以便计算
        if (/color/i.test(name)) {
            return cssHelper.parseColor(elem, name, val);
        }
        return val;
    };
    var setStyle = function (elem, name, value) {
        if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
        }

        var ret, type, hooks, origName = cssHelper.camelize(name);
        style = elem.style;
        name = cssProps[origName] || origName; //处理特殊属性
        if (typeof value === "number" && !cssNumber[name]) {
            value += "px";
        }
        hooks = cssHooks[name];
        if (hooks && hooks.set) {
            hooks.set(elem, value);
        }
        else {
            try {
                style[name] = value;
            } catch (e) { }
        }
    };
    sl.css = window.css = function (nodes, style, value) {
        nodes = sl.Convert.convertToArray(nodes, null, sl);
        return sl.access(nodes, style, value, getStyle, setStyle);
    }
    function toggle(elem) {
        if ("hidden" === elem.type ||
	getStyle(elem, "display") === "none" ||
	getStyle(elem, "visibility") === "hidden") {
            setStyle(elem, "display", "");
        }
        else {
            setStyle(elem, "display", "none");
        }
    }
    sl.toggle = toggle;


});
//data
SL().create(function (SL) {

    /**
    *@class
    *@name data
    */
    var data = function () { }
    data.prototype = {
        /**
        *设置或者获取本地存储
        *@param {DOMElement} ele dom元素
        *@param {String} name 键名
        *@param {Object} data 键值
        *@example 
        * var d = document.getElementById("safsa");
        * SL().data(d, "text", { "sfsa": 1, "asffs": 2 });
        * var d1 = document.getElementById("Div1");
        * SL().data(d1, "text", { "sfsa": 1, "asffs": 2 });
        * console.dir(SL().data(d, "text"));
        * console.dir(SL().data(d1, "text"));
        */
        AddData: function (elem, name, data) {
            var id = elem && elem[SL.expando], cache = SL.cache, thisCache;

            // 没有 id 的情况下，无法取值
            if (!id && typeof name === "string" && data === undefined) {
                return null;
            }

            // 为元素计算一个唯一的键值
            if (!id) {
                id = ++SL.uuid;
            }
            // 如果没有保存过
            if (!cache[id]) {
                elem[SL.expando] = id;     // 在元素上保存键值
                cache[id] = {};         // 在 cache 上创建一个对象保存元素对应的值
            }

            // 取得此元素的数据对象
            thisCache = cache[id];

            // 保存值
            if (data !== undefined) {
                thisCache[name] = data;
            }

            // 返回对应的值
            return typeof name === "string" ? thisCache[name] : thisCache;

        },
        /**
        *移除键值
        *@param {DOMElement} ele dom元素
        *@param {String} name 键名 注释：如果不提供键名则移除元素的缓存缓存
        *@example 
        *var d = document.getElementById("safsa");
        *SL().removeData(d,"text");
        *SL().removeData(d);
        */
        removeData: function (elem, name) {

            var id = elem[SL.expando], cache = SL.cache, thisCache = cache[id];

            // 如果没有指定name就移除全部
            if (name) {
                if (thisCache) {
                    // 根据name移除缓存数据
                    delete thisCache[name];

                    //如果对象为空 就移除所有缓存
                    if (SL.InstanceOf.EmptyObject(thisCache)) {
                        arguments.callee(elem);
                    }
                }
                // 如果不存在name就移除全部数据
            } else {
                try {
                    delete elem[SL.expando]
                } catch (e) {
                    //IE不能delete移除属性 必须removeAttribute
                    if (elem.removeAttribute)
                        elem.removeAttribute(SL.expando);
                }
                // 移除全部缓存数据
                delete cache[id];
            }
        }

    }
    var data = new data();

    SL.extend({ data: data.AddData, removeData: data.removeData });

});
//event
sl.create(function () {

    EventOperator = {
        triggered: false,
        addEvent: function (elem, type, handler, data) {
            if (elem.nodeType == 3 || elem.nodeType == 8) {
                return;
            }
            if (!handler.guid) {
                handler.guid = sl.guid++;
            }
            if (data !== undefined) {
                var fn = handler;
                // 创建一个代理的handler 来保存data 保障data的唯一性
                handler = sl.proxy(fn);
                handler.extendData = data;
            }
            var events = sl.data(elem, "events") || sl.data(elem, "events", {}),
			handle = sl.data(elem, "handle"), eventHandle;
            if (!handle) {
                eventHandle = function () {
                    return !EventOperator.triggered ?
                    EventOperator.handle.apply(eventHandle.elem, arguments) : undefined;
                };
                handle = sl.data(elem, "handle", eventHandle);
            }
            handle.elem = elem;
            var handlers = events[type];
            //防止重复绑定事件
            if (!handlers) {
                handlers = events[type] = {};
                // Bind the global event handler to the element
                if (elem.addEventListener) {
                    elem.addEventListener(type, handle, false);
                } else if (elem.attachEvent) {
                    elem.attachEvent("on" + type, handle);
                }

            }
            handlers[handler.guid] = handler;

        },
        removeEvent: function (elem, type, handler) {
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }
            var events = sl.data(elem, "events"), ret, type, fn;
            if (events) {
                if (!type) {
                    for (var _type in events) {
                        EventOperator.removeEvent(elem, _type, handler);
                    }
                }
                if (events[type]) {
                    if (handler) {
                        fn = events[type][handler.guid];
                        delete events[type][handler.guid];
                    } else {
                        for (var handle in events[type]) {
                            delete events[type][handle];

                        }
                    }
                    // remove generic event handler if no more handlers exist
                    for (ret in events[type]) {
                        break;
                    }
                    if (!ret) {
                        if (elem.removeEventListener) {
                            elem.removeEventListener(type, sl.data(elem, "handle"), false);
                        } else if (elem.detachEvent) {
                            elem.detachEvent("on" + type, sl.data(elem, "handle"));
                        }

                        ret = null;
                        delete events[type];
                    }
                }
                // event没任何东西
                for (ret in events) {
                    break;
                }
                if (!ret) {
                    var handle = sl.data(elem, "handle");
                    if (handle) {
                        handle.elem = null;
                    }
                    sl.removeData(elem, "events");
                    sl.removeData(elem, "handle");
                }
            }
        },
        triggerEvent: function (event, data, elem, bubbling) {
            var type = event.type || event;

            if (!bubbling) {
                event = typeof event === "object" ?
				event[sl.expando] ? event :
				sl.extend(SL.Event(type), event) :
                //(string)
				SL.Event(type);

                if (!elem || elem.nodeType === 3 || elem.nodeType === 8) {
                    return undefined;
                }

                event.result = undefined;
                event.target = elem;
                data = sl.Convert.convertToArray(data);
                data.unshift(event);
            }

            event.currentTarget = elem;
            var handle = sl.data(elem, "handle");
            if (handle) {
                handle.apply(elem, data);
            }

            var parent = elem.parentNode || elem.ownerDocument;
            //处理通过onType属性添加的事件处理器（如：elem.onClick = function(){...};）
            try {
                if (!(elem && elem.nodeName)) {
                    if (elem["on" + type] && elem["on" + type].apply(elem, data) === false) {
                        event.result = false;
                    }
                }
            } catch (e) { }

            if (!event.isPropagationStopped && parent) {
                //冒泡动作
                EventOperator.triggerEvent(event, data, parent, true);

            } else if (!event.isDefaultPrevented) {
                //触发默认动作···
                var target = event.target, old,
				isClick = target.nodeName == "A" && type === "click";

                if (!isClick && !(target && target.nodeName)) {
                    try {
                        if (target[type]) {
                            /* 假设type为click
                            因为下面想通过click()来触发默认操作，
                            但是又不想执行对应的事件处理器（re-trigger），
                            所以需要做两方面工作：
                            首先将elem.onclick = null；
                            然后将jQuery.event.triggered = 'click'; 
                            将在入口handle（第62行）不再dispatch了
                            之后再将它们还原*/
                            old = target["on" + type];

                            if (old) {
                                target["on" + type] = null;
                            }

                            this.triggered = true;
                            target[type]();
                        }

                        // prevent IE from throwing an error for some elements with some event types, see #3533
                    } catch (e) { }

                    if (old) {
                        target["on" + type] = old;
                    }

                    this.triggered = false;
                }
            }



        },
        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
        //处理实际的event 忽略其差异性 实际的trigger中的event切勿fix
        fixEvent: function (event) {

            if (event[sl.expando]) {
                return event;
            }
            var originalEvent = event;
            event = SL.Event(originalEvent);
            for (var i = EventOperator.props.length, prop; i; ) {
                prop = EventOperator.props[--i];
                event[prop] = originalEvent[prop];
            }
            if (!event.target) {
                event.target = event.srcElement || document;
            }

            //(safari)
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }
            if (!event.relatedTarget && event.fromElement) {
                event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
            }

            if (event.pageX == null && event.clientX != null) {
                var doc = document.documentElement, body = document.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }
            // Netscape/Firefox/Opera
            if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode)) {
                event.which = event.charCode || event.keyCode;
            }

            // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
            if (!event.metaKey && event.ctrlKey) {
                event.metaKey = event.ctrlKey;
            }

            // 为 click 事件添加 which 属性，左1 中2 右3
            // IE button的含义：
            // 0：没有键被按下 
            // 1：按下左键 
            // 2：按下右键 
            // 3：左键与右键同时被按下 
            // 4：按下中键 
            // 5：左键与中键同时被按下 
            // 6：中键与右键同时被按下 
            // 7：三个键同时被按下
            if (!event.which && event.button !== undefined) {
                event.which = [0, 1, 3, 0, 2, 0, 0, 0][event.button];
            }
            event.charCode = (event.type == "keypress") ? oEvent.keyCode : 0;
            event.eventPhase = 2;
            event.isChar = (event.charCode > 0);
            return event;
        },
        handle: function (event) {
            // returned undefined or false
            var handlers;
            event = arguments[0] = EventOperator.fixEvent(event || window.event);
            event.currentTarget = this;
            handlers = (sl.data(this, "events") || {})[event.type];

            for (var j in handlers) {
                var handler = handlers[j];
                event.handler = handler;
                event.extendData = handler.extendData;

                var ret = handler.apply(this, arguments);

                if (ret !== undefined) {
                    event.result = ret;
                    if (ret === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
                if (event.isImmediatePropagationStopped) {
                    break;
                }
            }

            return event.result;
        },
        hover: function (element, enterfn, leavefn) {
            EventOperator.addEvent(element, "mouseover", enterfn);
            EventOperator.addEvent(element, "mouseout", leavefn);
        }
    }

    SL.Event = function (src) {
        //是否已经经过初始化的event
        if (!this.preventDefault) {
            return new SL.Event(src);
        }
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
        } else {
            this.type = src;
        }
        this.timeStamp = new Date();

        //用来标注已经初始化
        this[sl.expando] = true;
    };
    SL.Event.prototype = {
        preventDefault: function () {
            // DOM LV3
            this.isDefaultPrevented = true;
            var e = this.originalEvent;

            if (!e) {
                return;
            }

            // DOM LV2
            if (e.preventDefault) {
                e.preventDefault();
            }
            // IE6-8
            else {
                e.returnValue = false;
            }
        },
        stopPropagation: function () {
            // DOM LV3
            this.isPropagationStopped = true;
            var e = this.originalEvent;

            if (!e) {
                return;
            }

            // DOM LV2
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            else {
                // IE6-8
                e.cancelBubble = true;
            }
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = true;
            this.stopPropagation();
        },
        isDefaultPrevented: false,
        isPropagationStopped: false,
        isImmediatePropagationStopped: false
    };

    sl.Event = EventOperator;
});
//attr
SL().create(function () {
    function attribute() { }
    attribute.prototype = {
        getAttr: function (ele, name) {
            if (/href|src|width|height|colSpan|rowSpan/.test(name)) {
                /**IE的getAttribute支持第二个参数，可以为 0,1,2,4
                0 是默认；1 区分属性的大小写；2取出源代码中的原字符串值(注，IE67对动态创建的节点没效)。
                IE 在取 href 的时候默认拿出来的是绝对路径，加参数2得到我们所需要的相对路径。*/
                return ele.getAttribute(name, 2);
            } else if ("style" === name) {
                return ele.style.cssText;
            } else if (name == "tabIndex") {
                var attributeNode = ele.getAttributeNode("tabIndex");
                return attributeNode && attributeNode.specified
						? attributeNode.value
						: ele.nodeName.match(/^(a|area|button|input|object|select|textarea)$/i)
							? 0
							: undefined;
            } else {
                return ele.getAttribute(name);
            }
        },
        setAttr: function (ele, name, value) {
            //设置属性
            if (value == null) {
                ele.removeAttribute(name);
            } else {
                if ("style" === name) {
                    ele.style.cssText ? ele.style.cssText = value : ele.setAttribute("style", value);
                } else {
                    ele.setAttribute(name, value);
                }
            }

        },
        removeAttr: function (ele, name) {
            this.setAttr(ele, name, "");
            if (ele.nodeType === 1) {
                if (ele.removeAttribute) {
                    ele.removeAttribute(name);
                }
                else if (ele.attributes && ele.attributes.removeNamedItem) {
                    ele.attributes.removeNamedItem(name);
                }
            }

        },
        addClass: function (ele, value) {
            if (value && typeof value === "string") {
                //分割
                var classNames = (value || "").split(/\s+/);
                if (ele.nodeType === 1) {
                    if (!ele.className && classNames.length === 1) {
                        ele.className = value;

                    } else {
                        var className = " " + ele.className + " ";
                        for (var c = 0, cl = classNames.length; c < cl; c++) {
                            if (className.indexOf(" " + classNames[c] + " ") < 0) {
                                ele.className += " " + classNames[c];
                            }
                        }
                    }
                }
            }

        },
        hasClass: function (ele, value) {
            var re = new RegExp('(\\s|^)' + value + '(\\s|$)');
            return re.test(ele.className.replace(/[\n\t]/, " "));

        },
        removeClass: function (ele, value) {
            if ((value && typeof value === "string") || value === undefined) {
                var classNames = (value || "").split(/\s+/);

                if (ele.nodeType === 1 && ele.className) {
                    if (value) {
                        var className = (" " + ele.className + " ").replace(/[\n\t]/g, " ");
                        for (var c = 0, cl = classNames.length; c < cl; c++) {
                            className = className.replace(" " + classNames[c] + " ", " ");
                        }
                        ele.className = className.substring(1, className.length - 1);

                    } else {
                        ele.className = "";
                    }
                }
            }
        },
        toggleClass: function (ele, value) {
            if (this.hasClass(ele, value)) {
                this.removeClass(ele, value);
            } else {
                this.addClass(ele, value);
            }
        },
        //select-multiple 还未考虑
        getValue: function (ele) {
            if (sl.InstanceOf.DOMElement(ele) && "value" in ele) {
                return ele.value;
            }
            return "";
        },
        setValue: function (ele, value) {
            if (sl.InstanceOf.DOMElement(ele) && "value" in ele) {
                ele.value = value;
            }
        }
    }
    sl.attr = new attribute();
});
//DOM
SL().create(function (SL) {
    //var xuzhiweiSL = new SL();
    /**
    *@class
    *@name Dom
    */
    var Dom = function () { };
    Dom.prototype = {
        toString: "SL框架DOM模块",
        boxModel: document.compatMode === "CSS1Compat",
        getDocumentElement: function () {

            return document.documentElement || document.body;
        },


        prevSibling: function (elem) {
            do {
                elem = elem.previousSibling;
            } while (elem && elem.nodeType != 1);
            return elem;
        },
        nextSibling: function (elem) {
            do {
                elem = elem.nextSibling;
            } while (elem && elem.nodeType != 1);
            return elem;
        },
        siblings: function (elem) {
            if (!elem.nodeType) return [];
            if (elem === document) return [];
            var n = elem.parentNode.firstChild;
            var r = [];

            for (; n; n = n.nextSibling) {
                if (n.nodeType == 1 && n != elem)
                    r.push(n);
            }

            return r;
        },
        /**
        *按照某个规则 逐级展开 不包括本身
        *@param {Element} elem
        *@param {String} dir 条件比如nextSibling
        */
        dir: function (elem, dir) {
            var matched = [], cur = elem[dir];
            while (cur && cur != document) {
                if (cur.nodeType == 1)
                    matched.push(cur);
                cur = cur[dir];
            }
            return matched;
        },
        /**
        *按照某个规则 逐级展开 取某一级 包括本身
        *@param {Element} elem
        *@param {String} dir 条件比如nextSibling
        */
        nthLevel: function (cur, result, dir, elem) {
            result = result || 1;
            var num = 0;

            for (; cur; cur = cur[dir])
                if (cur.nodeType == 1 && ++num == result)
                    break;

            return cur;
        },
        contents: function (elem) {
            return /iframe/i.test(elem.nodeName) ? (elem.contentDocument || elem.contentWindow.document) : SL.Convert.convertToArray(elem.childNodes);

        },
        firstChild: function (elem, exceptTextNode) {
            elem = elem.firstChild;
            return elem && exceptTextNode && elem.nodeType != 1 ?
        this.nextSibling(elem, exceptTextNode) : elem;
        },
        lastChild: function (elem) {
            elem = elem.lastChild;
            return elem && elem.nodeType != 1 ?
        this.prevSibling(elem) : elem;
        },
        parentNode: function (elem, level) {
            level = level || 1;
            for (var i = 0; i < level; i++)
                if (elem != null) elem = elem.parentNode;
            return elem;
        },
        appendFirstChild: function (newNode, parentNode) {
            this.insertNode(parentNode, "afterBegin", newNode);

        },
        append: function (newNode, parentNode) {
            this.insertNode(parentNode, "beforeEnd", newNode);
        },
        insertBefore: function (newNode, targetNode) {
            this.insertNode(targetNode, "beforeBegin", newNode);
        },
        // 在目标Node之后加入 新的Node.
        insertAfter: function (newNode, targetNode) {
            this.insertNode(targetNode, "afterEnd", newNode);
        },

        insertNode: function (el, where, parsedNode) {
            switch (where) {
                case "beforeBegin":
                    el.parentNode.insertBefore(parsedNode, el);
                    break;
                case "afterBegin":
                    if (el.firstChild) {
                        el.insertBefore(parsedNode, el.firstChild);
                    } else {
                        el.appendChild(parsedNode);
                    }
                    break;
                case "beforeEnd":
                    el.appendChild(parsedNode);
                    break;
                case "afterEnd":
                    if (el.nextSibling) {
                        el.parentNode.insertBefore(parsedNode, el.nextSibling);
                    } else {
                        el.parentNode.appendChild(parsedNode);
                    }
                    break;
            }
        },
        insertAdjacentHTML: function (node, sWhere, sHtml) {
            if (node.nodeType != 1) throw new Error(ns + ':insertAdjacentHTML方法 参数有错误.');
            if ((sWhere = sWhere.tolowerCase()) == 'afterbegin' || sWhere == 'beforeend') {
                if (/hr|br|img|input|link|col|meta|base|area/i.test(node.tagName))
                    return false;
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
        },
        map: function (elems, callback) {
            var ret = [];
            for (var i = 0, length = elems.length; i < length; i++) {
                var value = callback(elems[i], i);

                if (value != null)
                    ret[ret.length] = value;
            }

            return ret.concat.apply([], ret);
        },
        transactionDom: function (elems, doc, fragment, scripts) {
            /*处理tr opotion table这种直接div下设置innerhtml无效*/
            var wrapMap = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                legend: [1, "<fieldset>", "</fieldset>"],
                thead: [1, "<table>", "</table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                area: [1, "<map>", "</map>"],
                _default: [0, "", ""]
            };
            wrapMap.optgroup = wrapMap.option,
            wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead,
            wrapMap.th = wrapMap.td;
            doc = doc || document;
            if (typeof doc.createElement === "undefined") {
                doc = doc.ownerDocument || doc[0] && doc[0].ownerDocument || document;
            }
            //返回节点集
            var ret = [];
            SL.each(elems, function (i, elem) {
                if (typeof elem === "number") {
                    elem += "";
                }

                if (!elem) {
                    return;
                }
                //直接文本
                if (typeof elem === "string" && !/<|&\w+;/.test(elem)) {
                    elem = doc.createTextNode(elem);
                } else if (typeof elem === "string") {
                    // Fix "XHTML"-style tags in all browsers
                    elem = elem.replace(/(<([\w:]+)[^>]*?)\/>/g, fcloseTag = function (all, front, tag) {
                        return /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i.test(tag) ? all : front + "></" + tag + ">";
                    });
                    // 获取 tag名 小写
                    var tag = (/<([\w:]+)/.exec(elem) || ["", ""])[1].toLowerCase(),
                    //处理tr opotion table这种直接div下设置innerhtml无效
					wrap = wrapMap[tag] || wrapMap._default,
					depth = wrap[0],
					div = doc.createElement("div");
                    // 处理tr opotion table这种直接div下设置innerhtml无效 包裹
                    div.innerHTML = wrap[1] + elem + wrap[2];
                    // Move to the right depth
                    while (depth--) {
                        div = div.lastChild;
                    }
                    // ie6 ie7会在table下自动添加  <tbody>  需要移除不然<thead></thead>会返回<thead></thead><tbody></tbody>
                    if (!SL.Support.tbody) {
                        // 如果string是table可能自动产生tbody
                        var hasBody = /<tbody/i.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :
                        // String=<thead> or <tfoot> 可能自动产生tbody
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];
                        for (var j = tbody.length - 1; j >= 0; --j) {
                            if (/tbody/i.test(tbody[j].nodeName) && !tbody[j].childNodes.length) {
                                tbody[j].parentNode.removeChild(tbody[j]);
                            }
                        }

                    }

                    //  IE6-ie8 innerHTML会自动删除开头空格 补充上
                    if (!SL.Support.leadingWhitespace && /^\s+/.test(elem)) {
                        div.insertBefore(doc.createTextNode(/^\s+/.exec(elem)[0]), div.firstChild);
                    }
                    elem = SL.Convert.convertToArray(div.childNodes);
                }
                if (elem.nodeType) {
                    ret.push(elem);
                } else {
                    ret = SL.merge(ret, elem);
                }
            });
            /*附加到fragment并分离出srcipt*/
            if (fragment) {
                for (var i = 0; ret[i]; i++) {
                    if (scripts && /script/i.test(ret[i].nodeName) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript")) {
                        scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);
                    } else {
                        if (ret[i].nodeType === 1) {
                            ret.splice.apply(ret, [i + 1, 0].concat(SL.Convert.convertToArray(ret[i].getElementsByTagName("script"))));
                        }
                        fragment.appendChild(ret[i]);
                    }
                }
            }

            return ret;
        },
        parseHtml: function (htmlstr, doc) {

            doc = doc || document;
            var fragment = doc.createDocumentFragment();
            this.transactionDom([htmlstr], doc, fragment, []);
            return fragment;

        },
        //ie6 ie7附加tr必须在tbody
        _getDomRoot: function (parentNode, childNode) {
            return /table/i.test(parentNode.nodeName) && /tr/i.test(childNode.nodeName) ?
				(parentNode.getElementsByTagName("tbody")[0] ||
				parentNode.appendChild(parentNode.ownerDocument.createElement("tbody"))) :
				parentNode;
        },
        clone: function (node) {
            //html5
            if (document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>") {
                return node.cloneNode(true);
            } else {
                var fragment = document.createDocumentFragment(),
			doc = fragment.createElement ? fragment : document;
                doc.createElement(node.tagName);
                var div = doc.createElement('div');
                fragment.appendChild(div);
                div.innerHTML = node.outerHTML; //
                return div.firstChild;
            }
        },
        setNodeStyle: function (node, styleString) {
            if (!(node = this.$id(node)) || !SL.InstanceOf.String(styleString)) throw new Error(ns + ':setNodeStyle 参数 有错误.');
            if (ns.clientBrowser.is_ie) {//IE方法
                node.style.cssText = styleString;
            }
            else node.setAttribute('style', styleString); //w3c方法
        },
        empty: function (elem) {
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }

        },
        text: function (elem, text) {
            var i, node, nodeType = elem.nodeType, ret = "";
            if (nodeType) {
                if (text !== undefined) {
                    return this.empty().append((elem && elem.ownerDocument || document).createTextNode(text));
                }
                else {
                    if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                        if (typeof elem.textContent === "string") {
                            return elem.textContent;
                        } else {
                            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                                ret += getText(elem);
                            }
                        }
                    } else if (nodeType === 3 || nodeType === 4) {
                        return elem.nodeValue;
                    }
                }
            }

        },

        html: function (node, html) {
            if (html !== undefined) {
                if (node != null && 'innerHTML' in node) {
                    node.innerHTML = html;
                }
            } else {
                return node.innerHTML;
            }
        }
    };

    SL.Dom = SL.Dom || {};
    SL.Dom = new Dom();
});
//sizzle
SL().create(function (SL) {
    (function () {
        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, expando = "sizcache" + (Math.random() + '').replace('.', ''), done = 0, toString = Object.prototype.toString, hasDuplicate = false, baseHasDuplicate = true, rBackslash = /\\/g, rNonWord = /\W/;

        // Here we check if the JavaScript engine is using some sort of
        // optimization where it does not always call our comparision
        // function. If that is the case, discard the hasDuplicate value.
        //   Thus far that includes Google Chrome.
        [0, 0].sort(function () {
            baseHasDuplicate = false;
            return 0;
        });
        var Sizzle = function (selector, context, results, seed) {
            results = results || [];
            context = context || document;

            var origContext = context;

            if (context.nodeType !== 1 && context.nodeType !== 9) {
                return [];
            }

            if (!selector || typeof selector !== "string") {
                return results;
            }

            var m, set, checkSet, extra, ret, cur, pop, i, prune = true, contextXML = Sizzle.isXML(context), parts = [], soFar = selector;

            // Reset the position of the chunker regexp (start from head)
            do {
                chunker.exec("");
                m = chunker.exec(soFar);

                if (m) {
                    soFar = m[3];

                    parts.push(m[1]);

                    if (m[2]) {
                        extra = m[3];
                        break;
                    }
                }
            } while (m);

            if (parts.length > 1 && origPOS.exec(selector)) {

                if (parts.length === 2 && Expr.relative[parts[0]]) {
                    set = posProcess(parts[0] + parts[1], context, seed);

                } else {
                    set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);

                    while (parts.length) {
                        selector = parts.shift();

                        if (Expr.relative[selector]) {
                            selector += parts.shift();
                        }
                        set = posProcess(selector, set, seed);
                    }
                }

            } else {
                // Take a shortcut and set the context if the root selector is an ID
                // (but not if it'll be faster if the inner selector is an ID)
                if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
                    ret = Sizzle.find(parts.shift(), context, contextXML);
                    context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
                }

                if (context) {
                    ret = seed ? {
                        expr: parts.pop(),
                        set: makeArray(seed)
                    } : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
                    set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;

                    if (parts.length > 0) {
                        checkSet = makeArray(set);

                    } else {
                        prune = false;
                    }

                    while (parts.length) {
                        cur = parts.pop();
                        pop = cur;

                        if (!Expr.relative[cur]) {
                            cur = "";
                        } else {
                            pop = parts.pop();
                        }

                        if (pop == null) {
                            pop = context;
                        }

                        Expr.relative[cur](checkSet, pop, contextXML);
                    }

                } else {
                    checkSet = parts = [];
                }
            }

            if (!checkSet) {
                checkSet = set;
            }

            if (!checkSet) {
                Sizzle.error(cur || selector);
            }

            if (toString.call(checkSet) === "[object Array]") {
                if (!prune) {
                    results.push.apply(results, checkSet);

                } else if (context && context.nodeType === 1) {
                    for (i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
                            results.push(set[i]);
                        }
                    }

                } else {
                    for (i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && checkSet[i].nodeType === 1) {
                            results.push(set[i]);
                        }
                    }
                }

            } else {
                makeArray(checkSet, results);
            }

            if (extra) {
                Sizzle(extra, origContext, results, seed);
                Sizzle.uniqueSort(results);
            }

            return results;
        };

        Sizzle.uniqueSort = function (results) {
            if (sortOrder) {
                hasDuplicate = baseHasDuplicate;
                results.sort(sortOrder);

                if (hasDuplicate) {
                    for (var i = 1; i < results.length; i++) {
                        if (results[i] === results[i - 1]) {
                            results.splice(i--, 1);
                        }
                    }
                }
            }

            return results;
        };

        Sizzle.matches = function (expr, set) {
            return Sizzle(expr, null, null, set);
        };

        Sizzle.matchesSelector = function (node, expr) {
            return Sizzle(expr, null, null, [node]).length > 0;
        };

        Sizzle.find = function (expr, context, isXML) {
            var set, i, len, match, type, left;

            if (!expr) {
                return [];
            }

            for (i = 0, len = Expr.order.length; i < len; i++) {
                type = Expr.order[i];

                if ((match = Expr.leftMatch[type].exec(expr))) {
                    left = match[1];
                    match.splice(1, 1);

                    if (left.substr(left.length - 1) !== "\\") {
                        match[1] = (match[1] || "").replace(rBackslash, "");
                        set = Expr.find[type](match, context, isXML);

                        if (set != null) {
                            expr = expr.replace(Expr.match[type], "");
                            break;
                        }
                    }
                }
            }

            if (!set) {
                set = typeof context.getElementsByTagName !== "undefined" ? context.getElementsByTagName("*") : [];
            }

            return {
                set: set,
                expr: expr
            };
        };

        Sizzle.filter = function (expr, set, inplace, not) {
            var match, anyFound, type, found, item, filter, left, i, pass, old = expr, result = [], curLoop = set, isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

            while (expr && set.length) {
                for (type in Expr.filter) {
                    if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
                        filter = Expr.filter[type];
                        left = match[1];
                        anyFound = false;

                        match.splice(1, 1);

                        if (left.substr(left.length - 1) === "\\") {
                            continue;
                        }

                        if (curLoop === result) {
                            result = [];
                        }

                        if (Expr.preFilter[type]) {
                            match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);

                            if (!match) {
                                anyFound = found = true;

                            } else if (match === true) {
                                continue;
                            }
                        }

                        if (match) {
                            for (i = 0; (item = curLoop[i]) != null; i++) {
                                if (item) {
                                    found = filter(item, match, i, curLoop);
                                    pass = not ^ found;

                                    if (inplace && found != null) {
                                        if (pass) {
                                            anyFound = true;

                                        } else {
                                            curLoop[i] = false;
                                        }

                                    } else if (pass) {
                                        result.push(item);
                                        anyFound = true;
                                    }
                                }
                            }
                        }

                        if (found !== undefined) {
                            if (!inplace) {
                                curLoop = result;
                            }
                            expr = expr.replace(Expr.match[type], "");

                            if (!anyFound) {
                                return [];
                            }

                            break;
                        }
                    }
                }

                // Improper expression
                if (expr === old) {
                    if (anyFound == null) {
                        Sizzle.error(expr);

                    } else {
                        break;
                    }
                }
                old = expr;
            }

            return curLoop;
        };

        Sizzle.error = function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        };
        /**
        * Utility function for retreiving the text value of an array of DOM nodes
        * @param {Array|Element} elem
        */
        var getText = Sizzle.getText = function (elem) {
            var i, node, nodeType = elem.nodeType, ret = "";

            if (nodeType) {
                if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                    // Use textContent for elements
                    // innerText usage removed for consistency of new lines (see #11153)
                    if (typeof elem.textContent === "string") {
                        return elem.textContent;
                    } else {
                        // Traverse it's children
                        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                            ret += getText(elem);
                        }
                    }
                } else if (nodeType === 3 || nodeType === 4) {
                    return elem.nodeValue;
                }
            } else {

                // If no nodeType, this is expected to be an array
                for (i = 0; (node = elem[i]); i++) {
                    // Do not traverse comment nodes
                    if (node.nodeType !== 8) {
                        ret += getText(node);
                    }
                }
            }
            return ret;
        };
        var Expr = Sizzle.selectors = {
            order: ["ID", "NAME", "TAG"],

            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },

            leftMatch: {},

            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },

            attrHandle: {
                href: function (elem) {
                    return elem.getAttribute("href");
                },
                type: function (elem) {
                    return elem.getAttribute("type");
                }
            },

            relative: {
                "+": function (checkSet, part) {
                    var isPartStr = typeof part === "string", isTag = isPartStr && !rNonWord.test(part), isPartStrNotTag = isPartStr && !isTag;

                    if (isTag) {
                        part = part.toLowerCase();
                    }

                    for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                        if ((elem = checkSet[i])) {
                            while ((elem = elem.previousSibling) && elem.nodeType !== 1) {
                            }

                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part;
                        }
                    }

                    if (isPartStrNotTag) {
                        Sizzle.filter(part, checkSet, true);
                    }
                },
                ">": function (checkSet, part) {
                    var elem, isPartStr = typeof part === "string", i = 0, l = checkSet.length;

                    if (isPartStr && !rNonWord.test(part)) {
                        part = part.toLowerCase();

                        for (; i < l; i++) {
                            elem = checkSet[i];

                            if (elem) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                            }
                        }

                    } else {
                        for (; i < l; i++) {
                            elem = checkSet[i];

                            if (elem) {
                                checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
                            }
                        }

                        if (isPartStr) {
                            Sizzle.filter(part, checkSet, true);
                        }
                    }
                },
                "": function (checkSet, part, isXML) {
                    var nodeCheck, doneName = done++, checkFn = dirCheck;

                    if (typeof part === "string" && !rNonWord.test(part)) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
                },
                "~": function (checkSet, part, isXML) {
                    var nodeCheck, doneName = done++, checkFn = dirCheck;

                    if (typeof part === "string" && !rNonWord.test(part)) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
                }
            },

            find: {
                ID: function (match, context, isXML) {
                    if (typeof context.getElementById !== "undefined" && !isXML) {
                        var m = context.getElementById(match[1]);
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                },
                NAME: function (match, context) {
                    if (typeof context.getElementsByName !== "undefined") {
                        var ret = [], results = context.getElementsByName(match[1]);

                        for (var i = 0, l = results.length; i < l; i++) {
                            if (results[i].getAttribute("name") === match[1]) {
                                ret.push(results[i]);
                            }
                        }

                        return ret.length === 0 ? null : ret;
                    }
                },
                TAG: function (match, context) {
                    if (typeof context.getElementsByTagName !== "undefined") {
                        return context.getElementsByTagName(match[1]);
                    }
                }
            },
            preFilter: {
                CLASS: function (match, curLoop, inplace, result, not, isXML) {
                    match = " " + match[1].replace(rBackslash, "") + " ";

                    if (isXML) {
                        return match;
                    }

                    for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
                        if (elem) {
                            if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0)) {
                                if (!inplace) {
                                    result.push(elem);
                                }

                            } else if (inplace) {
                                curLoop[i] = false;
                            }
                        }
                    }

                    return false;
                },
                ID: function (match) {
                    return match[1].replace(rBackslash, "");
                },
                TAG: function (match, curLoop) {
                    return match[1].replace(rBackslash, "").toLowerCase();
                },
                CHILD: function (match) {
                    if (match[1] === "nth") {
                        if (!match[2]) {
                            Sizzle.error(match[0]);
                        }

                        match[2] = match[2].replace(/^\+|\s*/g, '');

                        // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                        var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);

                        // calculate the numbers (first)n+(last) including if they are negative
                        match[2] = (test[1] + (test[2] || 1)) - 0;
                        match[3] = test[3] - 0;
                    } else if (match[2]) {
                        Sizzle.error(match[0]);
                    }

                    // TODO: Move to normal caching system
                    match[0] = done++;

                    return match;
                },
                ATTR: function (match, curLoop, inplace, result, not, isXML) {
                    var name = match[1] = match[1].replace(rBackslash, "");

                    if (!isXML && Expr.attrMap[name]) {
                        match[1] = Expr.attrMap[name];
                    }

                    // Handle if an un-quoted value was used
                    match[4] = (match[4] || match[5] || "").replace(rBackslash, "");

                    if (match[2] === "~=") {
                        match[4] = " " + match[4] + " ";
                    }

                    return match;
                },
                PSEUDO: function (match, curLoop, inplace, result, not) {
                    if (match[1] === "not") {
                        // If we're dealing with a complex expression, or a simple one
                        if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                            match[3] = Sizzle(match[3], null, null, curLoop);

                        } else {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                            if (!inplace) {
                                result.push.apply(result, ret);
                            }

                            return false;
                        }

                    } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                        return true;
                    }

                    return match;
                },
                POS: function (match) {
                    match.unshift(true);

                    return match;
                }
            },

            filters: {
                enabled: function (elem) {
                    return elem.disabled === false && elem.type !== "hidden";
                },
                disabled: function (elem) {
                    return elem.disabled === true;
                },
                checked: function (elem) {
                    return elem.checked === true;
                },
                selected: function (elem) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex
                    }

                    return elem.selected === true;
                },
                parent: function (elem) {
                    return !!elem.firstChild;
                },
                empty: function (elem) {
                    return !elem.firstChild;
                },
                has: function (elem, i, match) {
                    return !!Sizzle(match[3], elem).length;
                },
                header: function (elem) {
                    return (/h\d/i).test(elem.nodeName);
                },
                text: function (elem) {
                    var attr = elem.getAttribute("type"), type = elem.type;
                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                    // use getAttribute instead to test this case
                    return elem.nodeName.toLowerCase() === "input" && "text" === type && (attr === type || attr === null);
                },
                radio: function (elem) {
                    return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
                },
                checkbox: function (elem) {
                    return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
                },
                file: function (elem) {
                    return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
                },
                password: function (elem) {
                    return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
                },
                submit: function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && "submit" === elem.type;
                },
                image: function (elem) {
                    return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
                },
                reset: function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && "reset" === elem.type;
                },
                button: function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && "button" === elem.type || name === "button";
                },
                input: function (elem) {
                    return (/input|select|textarea|button/i).test(elem.nodeName);
                },
                focus: function (elem) {
                    return elem === elem.ownerDocument.activeElement;
                }
            },
            setFilters: {
                first: function (elem, i) {
                    return i === 0;
                },
                last: function (elem, i, match, array) {
                    return i === array.length - 1;
                },
                even: function (elem, i) {
                    return i % 2 === 0;
                },
                odd: function (elem, i) {
                    return i % 2 === 1;
                },
                lt: function (elem, i, match) {
                    return i < match[3] - 0;
                },
                gt: function (elem, i, match) {
                    return i > match[3] - 0;
                },
                nth: function (elem, i, match) {
                    return match[3] - 0 === i;
                },
                eq: function (elem, i, match) {
                    return match[3] - 0 === i;
                }
            },
            filter: {
                PSEUDO: function (elem, match, i, array) {
                    var name = match[1], filter = Expr.filters[name];

                    if (filter) {
                        return filter(elem, i, match, array);

                    } else if (name === "contains") {
                        return (elem.textContent || elem.innerText || getText([elem]) || "").indexOf(match[3]) >= 0;

                    } else if (name === "not") {
                        var not = match[3];

                        for (var j = 0, l = not.length; j < l; j++) {
                            if (not[j] === elem) {
                                return false;
                            }
                        }

                        return true;

                    } else {
                        Sizzle.error(name);
                    }
                },
                CHILD: function (elem, match) {
                    var first, last, doneName, parent, cache, count, diff, type = match[1], node = elem;

                    switch (type) {
                        case "only":
                        case "first":
                            while ((node = node.previousSibling)) {
                                if (node.nodeType === 1) {
                                    return false;
                                }
                            }

                            if (type === "first") {
                                return true;
                            }
                            node = elem;

                            /* falls through */
                        case "last":
                            while ((node = node.nextSibling)) {
                                if (node.nodeType === 1) {
                                    return false;
                                }
                            }

                            return true;

                        case "nth":
                            first = match[2];
                            last = match[3];

                            if (first === 1 && last === 0) {
                                return true;
                            }
                            doneName = match[0];
                            parent = elem.parentNode;

                            if (parent && (parent[expando] !== doneName || !elem.nodeIndex)) {
                                count = 0;

                                for (node = parent.firstChild; node; node = node.nextSibling) {
                                    if (node.nodeType === 1) {
                                        node.nodeIndex = ++count;
                                    }
                                }

                                parent[expando] = doneName;
                            }
                            diff = elem.nodeIndex - last;

                            if (first === 0) {
                                return diff === 0;

                            } else {
                                return (diff % first === 0 && diff / first >= 0);
                            }
                    }
                },
                ID: function (elem, match) {
                    return elem.nodeType === 1 && elem.getAttribute("id") === match;
                },
                TAG: function (elem, match) {
                    return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
                },
                CLASS: function (elem, match) {
                    return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
                },
                ATTR: function (elem, match) {
                    var name = match[1], result = Sizzle.attr ? Sizzle.attr(elem, name) : Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name), value = result + "", type = match[2], check = match[4];

                    return result == null ? type === "!=" : !type && Sizzle.attr ? result != null : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
                },
                POS: function (elem, match, i, array) {
                    var name = match[2], filter = Expr.setFilters[name];

                    if (filter) {
                        return filter(elem, i, match, array);
                    }
                }
            }
        };

        var origPOS = Expr.match.POS, fescape = function (all, num) {
            return "\\" + (num - 0 + 1);
        };
        for (var type in Expr.match) {
            Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
            Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
        }
        // Expose origPOS
        // "global" as in regardless of relation to brackets/parens
        Expr.match.globalPOS = origPOS;

        var makeArray = function (array, results) {
            array = Array.prototype.slice.call(array, 0);

            if (results) {
                results.push.apply(results, array);
                return results;
            }

            return array;
        };
        // Perform a simple check to determine if the browser is capable of
        // converting a NodeList to an array using builtin methods.
        // Also verifies that the returned array holds DOM nodes
        // (which is not the case in the Blackberry browser)
        try {
            Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType
        } catch (e) {
            makeArray = function (array, results) {
                var i = 0, ret = results || [];

                if (toString.call(array) === "[object Array]") {
                    Array.prototype.push.apply(ret, array);

                } else {
                    if (typeof array.length === "number") {
                        for (var l = array.length; i < l; i++) {
                            ret.push(array[i]);
                        }

                    } else {
                        for (; array[i]; i++) {
                            ret.push(array[i]);
                        }
                    }
                }

                return ret;
            };
        }

        var sortOrder, siblingCheck;

        if (document.documentElement.compareDocumentPosition) {
            sortOrder = function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }

                if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                    return a.compareDocumentPosition ? -1 : 1;
                }

                return a.compareDocumentPosition(b) & 4 ? -1 : 1;
            };
        } else {
            sortOrder = function (a, b) {
                // The nodes are identical, we can exit early
                if (a === b) {
                    hasDuplicate = true;
                    return 0;

                    // Fallback to using sourceIndex (in IE) if it's available on both nodes
                } else if (a.sourceIndex && b.sourceIndex) {
                    return a.sourceIndex - b.sourceIndex;
                }

                var al, bl, ap = [], bp = [], aup = a.parentNode, bup = b.parentNode, cur = aup;

                // If the nodes are siblings (or identical) we can do a quick check
                if (aup === bup) {
                    return siblingCheck(a, b);

                    // If no parents were found then the nodes are disconnected
                } else if (!aup) {
                    return -1;

                } else if (!bup) {
                    return 1;
                }

                // Otherwise they're somewhere else in the tree so we need
                // to build up a full list of the parentNodes for comparison
                while (cur) {
                    ap.unshift(cur);
                    cur = cur.parentNode;
                }
                cur = bup;

                while (cur) {
                    bp.unshift(cur);
                    cur = cur.parentNode;
                }
                al = ap.length;
                bl = bp.length;

                // Start walking down the tree looking for a discrepancy
                for (var i = 0; i < al && i < bl; i++) {
                    if (ap[i] !== bp[i]) {
                        return siblingCheck(ap[i], bp[i]);
                    }
                }

                // We ended someplace up the tree so do a sibling check
                return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
            };
            siblingCheck = function (a, b, ret) {
                if (a === b) {
                    return ret;
                }

                var cur = a.nextSibling;

                while (cur) {
                    if (cur === b) {
                        return -1;
                    }
                    cur = cur.nextSibling;
                }

                return 1;
            };
        }

        // Check to see if the browser returns elements by name when
        // querying by getElementById (and provide a workaround)
        (function () {
            // We're going to inject a fake input element with a specified name
            var form = document.createElement("div"), id = "script" + (new Date()).getTime(), root = document.documentElement;

            form.innerHTML = "<a name='" + id + "'/>";

            // Inject it into the root element, check its status, and remove it quickly
            root.insertBefore(form, root.firstChild);

            // The workaround has to do additional checks after a getElementById
            // Which slows things down for other browsers (hence the branching)
            if (document.getElementById(id)) {
                Expr.find.ID = function (match, context, isXML) {
                    if (typeof context.getElementById !== "undefined" && !isXML) {
                        var m = context.getElementById(match[1]);

                        return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
                    }
                };

                Expr.filter.ID = function (elem, match) {
                    var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

                    return elem.nodeType === 1 && node && node.nodeValue === match;
                };
            }

            root.removeChild(form);

            // release memory in IE
            root = form = null;
        })();
        (function () {
            // Check to see if the browser returns only elements
            // when doing getElementsByTagName("*")

            // Create a fake element
            var div = document.createElement("div");
            div.appendChild(document.createComment(""));

            // Make sure no comments are found
            if (div.getElementsByTagName("*").length > 0) {
                Expr.find.TAG = function (match, context) {
                    var results = context.getElementsByTagName(match[1]);

                    // Filter out possible comments
                    if (match[1] === "*") {
                        var tmp = [];

                        for (var i = 0; results[i]; i++) {
                            if (results[i].nodeType === 1) {
                                tmp.push(results[i]);
                            }
                        }
                        results = tmp;
                    }

                    return results;
                };
            }

            // Check to see if an attribute returns normalized href attributes
            div.innerHTML = "<a href='#'></a>";

            if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {

                Expr.attrHandle.href = function (elem) {
                    return elem.getAttribute("href", 2);
                };
            }

            // release memory in IE
            div = null;
        })();

        if (document.querySelectorAll) {
            (function () {
                var oldSizzle = Sizzle, div = document.createElement("div"), id = "__sizzle__";

                div.innerHTML = "<p class='TEST'></p>";

                // Safari can't handle uppercase or unicode characters when
                // in quirks mode.
                if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
                    return;
                }
                Sizzle = function (query, context, extra, seed) {
                    context = context || document;

                    // Only use querySelectorAll on non-XML documents
                    // (ID selectors don't work in non-HTML documents)
                    if (!seed && !Sizzle.isXML(context)) {
                        // See if we find a selector to speed up
                        var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);

                        if (match && (context.nodeType === 1 || context.nodeType === 9)) {
                            // Speed-up: Sizzle("TAG")
                            if (match[1]) {
                                return makeArray(context.getElementsByTagName(query), extra);

                                // Speed-up: Sizzle(".CLASS")
                            } else if (match[2] && Expr.find.CLASS && context.getElementsByClassName) {
                                return makeArray(context.getElementsByClassName(match[2]), extra);
                            }
                        }

                        if (context.nodeType === 9) {
                            // Speed-up: Sizzle("body")
                            // The body element only exists once, optimize finding it
                            if (query === "body" && context.body) {
                                return makeArray([context.body], extra);

                                // Speed-up: Sizzle("#ID")
                            } else if (match && match[3]) {
                                var elem = context.getElementById(match[3]);

                                // Check parentNode to catch when Blackberry 4.6 returns
                                // nodes that are no longer in the document #6963
                                if (elem && elem.parentNode) {
                                    // Handle the case where IE and Opera return items
                                    // by name instead of ID
                                    if (elem.id === match[3]) {
                                        return makeArray([elem], extra);
                                    }

                                } else {
                                    return makeArray([], extra);
                                }
                            }

                            try {
                                return makeArray(context.querySelectorAll(query), extra);
                            } catch (qsaError) {
                            }

                            // qSA works strangely on Element-rooted queries
                            // We can work around this by specifying an extra ID on the root
                            // and working up from there (Thanks to Andrew Dupont for the technique)
                            // IE 8 doesn't work on object elements
                        } else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                            var oldContext = context, old = context.getAttribute("id"), nid = old || id, hasParent = context.parentNode, relativeHierarchySelector = /^\s*[+~]/.test(query);

                            if (!old) {
                                context.setAttribute("id", nid);
                            } else {
                                nid = nid.replace(/'/g, "\\$&");
                            }
                            if (relativeHierarchySelector && hasParent) {
                                context = context.parentNode;
                            }

                            try {
                                if (!relativeHierarchySelector || hasParent) {
                                    return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra);
                                }

                            } catch (pseudoError) {
                            } finally {
                                if (!old) {
                                    oldContext.removeAttribute("id");
                                }
                            }
                        }
                    }

                    return oldSizzle(query, context, extra, seed);
                };
                for (var prop in oldSizzle) {
                    Sizzle[prop] = oldSizzle[prop];
                }

                // release memory in IE
                div = null;
            })();
        } (function () {
            var html = document.documentElement, matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

            if (matches) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9 fails this)
                var disconnectedMatch = !matches.call(document.createElement("div"), "div"), pseudoWorks = false;

                try {
                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call(document.documentElement, "[test!='']:sizzle");

                } catch (pseudoError) {
                    pseudoWorks = true;
                }

                Sizzle.matchesSelector = function (node, expr) {
                    // Make sure that attribute selectors are quoted
                    expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

                    if (!Sizzle.isXML(node)) {
                        try {
                            if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
                                var ret = matches.call(node, expr);

                                // IE 9's matchesSelector returns false on disconnected nodes
                                if (ret || !disconnectedMatch ||
                                // As well, disconnected nodes are said to be in a document
                                // fragment in IE 9, so check for that
							node.document && node.document.nodeType !== 11) {
                                    return ret;
                                }
                            }
                        } catch (e) {
                        }
                    }

                    return Sizzle(expr, null, null, [node]).length > 0;
                };
            }
        })();
        (function () {
            var div = document.createElement("div");

            div.innerHTML = "<div class='test e'></div><div class='test'></div>";

            // Opera can't find a second classname (in 9.6)
            // Also, make sure that getElementsByClassName actually exists
            if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
                return;
            }

            // Safari caches class attributes, doesn't catch changes (in 3.2)
            div.lastChild.className = "e";

            if (div.getElementsByClassName("e").length === 1) {
                return;
            }

            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function (match, context, isXML) {
                if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                    return context.getElementsByClassName(match[1]);
                }
            };
            // release memory in IE
            div = null;
        })();

        function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; i < l; i++) {
                var elem = checkSet[i];

                if (elem) {
                    var match = false;
                    elem = elem[dir];

                    while (elem) {
                        if (elem[expando] === doneName) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if (elem.nodeType === 1 && !isXML) {
                            elem[expando] = doneName;
                            elem.sizset = i;
                        }

                        if (elem.nodeName.toLowerCase() === cur) {
                            match = elem;
                            break;
                        }
                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; i < l; i++) {
                var elem = checkSet[i];

                if (elem) {
                    var match = false;
                    elem = elem[dir];

                    while (elem) {
                        if (elem[expando] === doneName) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if (elem.nodeType === 1) {
                            if (!isXML) {
                                elem[expando] = doneName;
                                elem.sizset = i;
                            }

                            if (typeof cur !== "string") {
                                if (elem === cur) {
                                    match = true;
                                    break;
                                }

                            } else if (Sizzle.filter(cur, [elem]).length > 0) {
                                match = elem;
                                break;
                            }
                        }
                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        if (document.documentElement.contains) {
            Sizzle.contains = function (a, b) {
                return a !== b && (a.contains ? a.contains(b) : true);
            };
        } else if (document.documentElement.compareDocumentPosition) {
            Sizzle.contains = function (a, b) {
                return !!(a.compareDocumentPosition(b) & 16);
            };
        } else {
            Sizzle.contains = function () {
                return false;
            };
        }

        Sizzle.isXML = function (elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };
        var posProcess = function (selector, context, seed) {
            var match, tmpSet = [], later = "", root = context.nodeType ? [context] : context;

            // Position selectors must be done after the filter
            // And so must :not(positional) so we move all PSEUDOs to the end
            while ((match = Expr.match.PSEUDO.exec(selector))) {
                later += match[0];
                selector = selector.replace(Expr.match.PSEUDO, "");
            }
            selector = Expr.relative[selector] ? selector + "*" : selector;

            for (var i = 0, l = root.length; i < l; i++) {
                Sizzle(selector, root[i], tmpSet, seed);
            }

            return Sizzle.filter(later, tmpSet);
        };
        // EXPOSE

        window.Sizzle = Sizzle;
    })();
    Sizzle.selectors.filters.hidden = function (elem) {
        return "hidden" === elem.type ||
		sl.css(elem, "display") === "none" ||
		sl.css(elem, "visibility") === "hidden";
    };

    Sizzle.selectors.filters.visible = function (elem) {
        return "hidden" !== elem.type &&
		sl.css(elem, "display") !== "none" &&
		sl.css(elem, "visibility") !== "hidden";
    };

    function slSelector() {
        this.find = function (selector, context, result) {
            return Sizzle(selector, context, result);
        }
        this.expr = Sizzle.selectors;
        this.matches = Sizzle.matches;
        this.matchesSelector = Sizzle.matchesSelector;
        this.filter = Sizzle.filter;
        this.contains = Sizzle.contains;
        this.getText = Sizzle.getText;
        this.multiFilter = function (expr, elems, not) {
            if (not) {
                expr = ":not(" + expr + ")";
            }
            return Sizzle.matches(expr, elems);
        }
    }

    SL.selector = new slSelector();
    SL.select = SL.selector.find;
});