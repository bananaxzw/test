/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
/// <reference path="SL.Mask.js" />
(function () {


    var defaults = {
        accept: null,
        onDragEnter: function (e, source) { },
        onDragOver: function (e, source) { },
        onDragLeave: function (e, source) { },
        onDrop: function (e, source) { }
    };

    function SLDroppable(elem, options) {
        this.opts = sl.extend(defaults, options);
        this.elem = elem;
        this.init(elem);

    }
    SLDroppable.prototype = {
        init: function (target) {
            var options = this.opts;
            $(target).addClass('droppable');
            $(target).bind('_dragenter', function (e, source) {
                options.onDragEnter.apply(target, [e, source]);
            });
            $(target).bind('_dragleave', function (e, source) {
                options.onDragLeave.apply(target, [e, source]);
            });
            $(target).bind('_dragover', function (e, source) {
                options.onDragOver.apply(target, [e, source]);
            });
            $(target).bind('_drop', function (e, source) {
                options.onDrop.apply(target, [e, source]);
            });
        }
    }
    window.SLDroppable = SLDroppable;

})();