﻿/// <reference path="jquery-1.4.1-vsdoc.js" />
(function ($) {


    var defaults = {
        accept: null,
        onDragEnter: function (e, source) { },
        onDragOver: function (e, source) { },
        onDragLeave: function (e, source) { },
        onDrop: function (e, source) { }
    };
    function init(target) {
        $(target).addClass('droppable');
        $(target).bind('_dragenter', function (e, source) {
            $.data(target, 'droppable').options.onDragEnter.apply(target, [e, source]);
        });
        $(target).bind('_dragleave', function (e, source) {
            $.data(target, 'droppable').options.onDragLeave.apply(target, [e, source]);
        });
        $(target).bind('_dragover', function (e, source) {
            $.data(target, 'droppable').options.onDragOver.apply(target, [e, source]);
        });
        $(target).bind('_drop', function (e, source) {
            $.data(target, 'droppable').options.onDrop.apply(target, [e, source]);
        });
    }

    $.fn.CalvinDroppable = function (options) {
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'droppable');
            if (state) {
                $.extend(state.options, options);
            } else {
                init(this);
                $.data(this, 'droppable', {
                    options: $.extend({}, defaults, options)
                });
            }
        });
    };


})(jQuery);