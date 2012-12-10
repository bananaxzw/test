if (!window) this.window = this;
window.Type = $type = Function;
$prototype = $type.prototype;
$prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};
Function.method('inherits', function (parent) {
    var proto = this.prototype;
    this.prototype = new parent();

    for (var o in proto) !o.isPrototypeOf(proto) && (this.prototype[o] = proto[o]);
    this.prototype.constructor = this;
    return this;
});

Function.method('swiss', function (parent) {
    for (var i = 1; i < arguments.length; i += 1) {
        var name = arguments[i];
        this.prototype[name] = parent.prototype[name];
    }

    return this;
});

