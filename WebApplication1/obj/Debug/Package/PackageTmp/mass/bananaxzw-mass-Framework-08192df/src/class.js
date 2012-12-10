//=========================================
// 类工厂模块
//==========================================
$.define("class", "lang",function(){
    // $.log("已加载class模块")
    var
    unextend = $.oneObject(["_super","prototype", 'extend', 'implement' ]),
    rconst = /constructor|_init|_super/,
    classOne = $.oneObject('Object,Array,Function');
    function expand(klass,props){
        'extend,implement'.replace( $.rword, function(name){
            var modules = props[name];
            if( classOne[ $.type( modules) ] ){
                klass[name].apply( klass,[].concat( modules ) );
                delete props[name];
            }
        });
        return klass;
    }
    var defineProperties = false;
    // 指定了get与set不能指定writable与value
    var hiddenProperty = {
        configurable: false,//防止被删除
        enumerable: false,//防止被遍历
        writable: false//防止被修改
    }
    try{
        Object.defineProperties($,{
            "@bind": hiddenProperty,
            "@path": hiddenProperty
        });
        defineProperties = $.support.defineProperties = true;
    }catch(e){}
    $.mutators = {
        inherit : function( parent,init ) {
            if( typeof parent == "function"){
                for(var i in parent){//继承类成员
                    this[i] = parent[i];
                }
                this.prototype = Object.create(parent.prototype) ;//继承原型成员
                this._super = parent;//指定父类
            }
            this._init = (this._init || []).concat();
            if( init ){
                this._init.push(init);
            }
            this.toString = function(){
                return (init || $.noop) + "";
            }
            var proto = this.prototype;
            proto.klass = this;
            proto.setOptions = function(){
                var first = arguments[0];
                if( typeof first === "string" ){
                    first =  this[first] || (this[first] = {});
                    [].splice.call( arguments, 0, 1, first );
                }else{
                    [].unshift.call( arguments,this );
                }
                $.Object.merge.apply(null,arguments);
                return this;
            }
            if(defineProperties){
                Object.defineProperties(proto, {
                    _init: hiddenProperty,
                    setOptions: hiddenProperty,
                    klass: hiddenProperty
                })
            }
            return proto.constructor = this;
        },
        implement: function(){
            var target = this.prototype, parent = this._super, reg = rconst, definition = {}, accessor
            for(var i = 0, module; module = arguments[i++]; ){
                module = typeof module === "function" ? new module :module;
                Object.keys(module).forEach(function(name){
                    if( !reg.test(name) ){
                        var prop =  target[name] = module[name];
                        if($.isPlainObject(prop) && (  accessor = ($.isFunction( prop.get ) || $.isFunction( prop.set )) || "value" in prop  ) ){
                            if(defineProperties){
                                definition[name] = prop;
                                if (!('enumerable' in prop))
                                    prop.enumerable = true;
                                if(accessor){
                                    delete prop.value;//指定了访问器就不能指定这两个属性
                                    delete prop.writable
                                }else if (!('writable' in prop)){
                                     prop.writable =  true;
                                }
                            }else if("value" in prop){//如果不支持,直接赋值
                                target[name] = prop.value;
                            }
                        }
                        if(typeof prop == "function"){
                            target[name] = (function(){
                                var _super = function() {
                                    return parent.prototype[ name ].apply( this, arguments );
                                };
                                var _superApply = function( args ) {
                                    return parent.prototype[ name ].apply( this, args );
                                };
                                return function() {
                                    var __super = this._super,
                                    __superApply = this._superApply,
                                    ret;

                                    this._super = _super;
                                    this._superApply = _superApply;

                                    ret = prop.apply( this, arguments );

                                    this._super = __super;
                                    this._superApply = __superApply;

                                    return ret;
                                };
                            })();
                            target[name].toString = function(){
                                return prop +"";
                            }
                        }
                    }
                }, this );
            }
            defineProperties && Object.defineProperties(this.prototype, definition)
            return this;
        },
        extend: function(){//扩展类成员
            var bridge = {}
            for(var i = 0, module; module = arguments[i++]; ){
                $.mix( bridge, module );
            }
            for( var key in bridge ){
                if( !unextend[key] ){
                    this[key] =  bridge[key]
                }
            }
            return this;
        }
    };
    $.factory = function( obj ){
        obj = obj || {};
        var parent = obj.inherit //父类
        var init = obj.init ;    //构造器
        delete obj.inherit;
        delete obj.init;
        var klass = function () {
            for( var i = 0 , init ; init =  klass._init[i++]; ){
                init.apply(this, arguments);
            }
        };
        $.mix( klass, $.mutators ).inherit( parent, init );//添加更多类方法
        return expand( klass, obj ).implement( obj );
    }
});
/**
2011.7.11 将$["class"]改为$["@class"] v4
2011.7.25
继承链与方法链被重新实现。
在方法中调用父类的同名实例方法，由$super改为supermethod，保留父类的原型属性parent改为superclass v5
2011.8.6
在方法中调用父类的同名实例方法，由supermethod改为_super，保留父类的原型属性superclass改为_super v6
重新实现方法链
fix 子类实例不是父类的实例的bug
2011.8.14 更改隐藏namespace,增强setOptions
2011.10.7 include更名为implement 修复implement的BUG（能让人重写toString valueOf方法） v7
2012.1.29 修正setOptions中$.Object.merge方法的调用方式
2012.2.25 改进setOptions，可以指定在this上扩展还是在this.XXX上扩展
2012.2.26 重新实现方法链，抛弃arguments.callee.caller   v8
2012.5.31 添加数据描述符的应用 v9
*/