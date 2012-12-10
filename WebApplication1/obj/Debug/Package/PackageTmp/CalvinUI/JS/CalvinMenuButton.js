
/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="CalvinButton.js" />

(function () {
    $.fn.CalvinMenubutton = function (options,params) {
        var defaults = {
            disabled: false,
            plain: true,
            menuData: {},
            menuId: null,
            duration: 100
        };

        function isEmptyObject(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        };
        function init(target) {
            var opts = $.data(target, 'menubutton').options;
            var btn = $(target);
            btn.removeClass('m-btn-active m-btn-plain-active');
            btn.CalvinButton(opts);
            if (opts.menuId && opts.menuData && !isEmptyObject(opts.menuData)) {
                $(opts.menuId).menu({
                    onShow: function () {
                        btn.addClass((opts.plain == true) ? 'm-btn-plain-active' : 'm-btn-active');
                    },
                    onHide: function () {
                        btn.removeClass((opts.plain == true) ? 'm-btn-plain-active' : 'm-btn-active');
                    },
                    menuData: opts.menuData
                });
            }
            btn.unbind('.menubutton');
            if (opts.disabled == false && opts.menuId) {
                btn.bind('click.menubutton', function () {
                    showMenu();
                    return false;
                });
                var timeout = null;
                btn.bind('mouseenter.menubutton', function () {
                    timeout = setTimeout(function () {
                        showMenu();
                    }, opts.duration);
                    return false;
                }).bind('mouseleave.menubutton', function () {
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                });
            }

            function showMenu() {
                var left = btn.offset().left;
                if (left + $(opts.menuId).outerWidth() + 5 > $(window).width()) {
                    left = $(window).width() - $(opts.menuId).outerWidth() - 5;
                }

                $('.menu-top').menu('hide');
                $(opts.menuId).menu('show', {
                    left: left,
                    top: btn.offset().top + btn.outerHeight()
                });
                btn.blur();
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'menubutton');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'menubutton', {
                    options: $.extend({}, defaults, {
                        disabled: $(this).attr('disabled') == 'true',
                        menuId: $(this).attr("menuId"),
                        plain: ($(this).attr('plain') == 'false' ? false : true),
                        duration: (parseInt($(this).attr('duration')) || 100)
                    }, options)
                });
                $(this).removeAttr('disabled');
                $(this).append('<span class="m-btn-downarrow">&nbsp;</span>');
            }

            init(this);
        });
    };


})();