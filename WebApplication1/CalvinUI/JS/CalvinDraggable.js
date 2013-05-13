/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="CalvinBase.js" />

/********************************************************************************************
* 文件名称:	
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	
* 注意事项：如果变量前面有带$表示的是JQ对象
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*
********************************************************************************************/
(function () {
    var defaults = {
        //值为"clone"或者是返回jq元素的function
        proxy: null,
        revert: false,
        cursor: 'move',
        deltaX: null,
        deltaY: null,
        //handle代表对象拖拉的 手柄的区域 比如有个panel可以设置它的handle为header部位
        handle: null,
        disabled: false,
        //可拖动的偏移量
        edge: 0,
        //移动限制 只能在某个范围内移动 值为Dom元素
        containment: null,
        axis: null, // v or h
        onStartDrag: function (e) { },
        onDrag: function (e) { },
        onStopDrag: function (e) { }
    };
    var eventHelper = {
        beginDrag: function (e) {
            var opts = $.data(e.data.target, 'draggable').options;

            //获取可以停靠的对象
            var droppables = $('.droppable').filter(function () {
                return e.data.target != this;
            }).filter(function () {
                var accept = $.data(this, 'droppable').options.accept;
                if (accept) {
                    return $(accept).filter(function () {
                        return this == e.data.target;
                    }).length > 0;
                }
                else {
                    return true;
                }
            });
            $.data(e.data.target, 'draggable').droppables = droppables;

            //拖动元素时候的代理元素  值为"clone"或者是返回jq元素的function 如果没有的话 就使用本身
            var proxy = $.data(e.data.target, 'draggable').proxy;
            if (!proxy) {
                if (opts.proxy) {
                    if (opts.proxy == 'clone') {
                        proxy = $(e.data.target).clone().insertAfter(e.data.target);
                    }
                    else {
                        proxy = opts.proxy.call(e.data.target, e.data.target);
                    }
                    $.data(e.data.target, 'draggable').proxy = proxy;
                }
                else {
                    proxy = $(e.data.target);
                }
            }

            proxy.css('position', 'absolute');

            eventHelper.drag(e);
            eventHelper.applyDrag(e);

            opts.onStartDrag.call(e.data.target, e);
            return false;
        },
        onDrag: function (e) {
            var opts = $.data(e.data.target, 'draggable').options;
            if (opts.containment) {
                eventHelper.moveInContainment(e);
            }
            else {
                eventHelper.drag(e);
            }
            if ($.data(e.data.target, 'draggable').options.onDrag.call(e.data.target, e) != false) {
                eventHelper.applyDrag(e);
            }

            var source = e.data.target;
            //触发droppable事件
            $.data(e.data.target, 'draggable').droppables.each(function () {
                var dropObj = $(this);
                var p2 = $(this).offset();
                if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
            && e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()) {
                    if (!this.entered) {
                        //触发_dragenter事件
                        $(this).trigger('_dragenter', [source]);
                        this.entered = true;
                    }
                    $(this).trigger('_dragover', [source]);
                }
                else {
                    if (this.entered) {
                        //离开
                        $(this).trigger('_dragleave', [source]);
                        this.entered = false;
                    }
                }
            });

            return false;


        },
        endDrag: function (e) {
            var opts = $.data(e.data.target, 'draggable').options;
            if (opts.containment) {
                eventHelper.moveInContainment(e);
            }
            else {
                eventHelper.drag(e);
            }

            var proxy = $.data(e.data.target, 'draggable').proxy;
            //如果设置revert 为true则会还原到原先位置
            if (opts.revert) {
                //如果是拖动到可drop对象内 应该立即消失 模拟已经放到容器中 （可定制事件）
                if (checkDrop() == true) {
                    removeProxy();
                    $(e.data.target).css({
                        position: e.data.startPosition,
                        left: e.data.startLeft,
                        top: e.data.startTop
                    });
                }
                else {
                    //如果没有拖动对象内 则用动画返回
                    if (proxy) {
                        proxy.animate({
                            left: e.data.startLeft,
                            top: e.data.startTop
                        }, function () {
                            removeProxy();
                        });
                    }
                    else {
                        $(e.data.target).animate({
                            left: e.data.startLeft,
                            top: e.data.startTop
                        }, function () {
                            $(e.data.target).css('position', e.data.startPosition);
                        });
                    }
                }
            }
            else {
                $(e.data.target).css({
                    position: 'absolute',
                    left: e.data.left,
                    top: e.data.top
                });
                removeProxy();
                checkDrop();
            }

            opts.onStopDrag.call(e.data.target, e);

            function removeProxy() {
                if (proxy) {
                    proxy.remove();
                }
                $.data(e.data.target, 'draggable').proxy = null;
            };

            function checkDrop() {
                var data = $.data(e.data.target, 'draggable');
                if (!data.droppables) return;
                var dropped = false;
                data.droppables.each(function () {
                    var dropObj = $(this);
                    var p2 = $(this).offset();
                    if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
						&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()) {
                        if (opts.revert) {
                            $(e.data.target).css({
                                position: e.data.startPosition,
                                left: e.data.startLeft,
                                top: e.data.startTop
                            });
                        }
                        $(this).trigger('_drop', [e.data.target]);
                        dropped = true;
                        this.entered = false;
                    }
                });
                return dropped;
            };

            $(document).unbind('.draggable');
            return false;

        },
        applyDrag: function (e) {
            var opts = $.data(e.data.target, 'draggable').options;
            var proxy = $.data(e.data.target, 'draggable').proxy;
            if (proxy) {
                proxy.css('cursor', opts.cursor);
            } else {
                proxy = $(e.data.target);
                $.data(e.data.target, 'draggable').handle.css('cursor', opts.cursor);
            }
            proxy.css({
                left: e.data.left,
                top: e.data.top
            });
        },
        drag: function (e) {
            /// <summary>
            /// 无容器的移动 这里只是获取e的位置信息 然后applyDrag应用这个位置信息
            /// </summary>
            /// <param name="e"></param>
            var opts = $.data(e.data.target, 'draggable').options;

            var dragData = e.data;
            var left = dragData.startLeft + e.pageX - dragData.startX;
            var top = dragData.startTop + e.pageY - dragData.startY;

            if (opts.deltaX != null && opts.deltaX != undefined) {
                left = e.pageX + opts.deltaX;
            }
            if (opts.deltaY != null && opts.deltaY != undefined) {
                top = e.pageY + opts.deltaY;
            }
            //如果父元素不是body就加上滚动条
            if (e.data.parent != document.body) {
                if ($.boxModel == true) {
                    left += $(e.data.parent).scrollLeft();
                    top += $(e.data.parent).scrollTop();
                }
            }
            //如果只允许水平或者垂直 只单单设置top或者left
            if (opts.axis == 'h') {
                dragData.left = left;
            } else if (opts.axis == 'v') {
                dragData.top = top;
            } else {
                dragData.left = left;
                dragData.top = top;
            }
        },

        moveInContainment: function (e) {
            /// <summary>
            /// 有容器的移动 这里只是获取e的位置信息 然后applyDrag应用这个位置信息
            /// </summary>
            /// <param name="e"></param>
            var data = $.data(e.data.target, 'draggable');
            var opts = data.options;
            var containment = opts.containment;
            var dragData = e.data;
            var target = dragData.target;
            var targetHeight = $(target).outerHeight();
            var targetWidth = $(target).outerWidth();
            var ConstrainArea = dragData.ConstrainArea;
            var elementArea = dragData.targetArea;

            //移动的X方向距离
            var moveX = e.pageX - dragData.startX;
            //移动的Y方向距离
            var moveY = e.pageY - dragData.startY;

            //向左移动 但是移动距离不能超过2者的右边之差
            if (moveX > 0) {
                moveX = Math.min((ConstrainArea.right - elementArea.right), moveX);
            }
            else {
                moveX = Math.max((ConstrainArea.left - elementArea.left), moveX);
            }
            //向下移动 但是移动距离不能超过2者的下边之差
            if (moveY > 0) {
                moveY = Math.min((ConstrainArea.under - elementArea.under), moveY);
            }
            else {
                moveY = Math.max((ConstrainArea.top - elementArea.top), moveY);
            }

            dragData.left = dragData.startLeft + moveX;
            dragData.top = dragData.startTop + moveY;


        }
    };

    $.fn.CalvinDraggable = function (options, params) {

        return this.each(function () {

            //handle代表对象拖拉的 手柄的区域 比如有个panel可以设置它的handle为header部位
            var opts;
            var state = $.data(this, 'draggable');
            if (state) {
                state.handle.unbind('.draggable');
                opts = $.extend(state.options, options);
            } else {
                opts = $.extend({}, defaults, options || {});
            }

            if (opts.disabled == true) {
                $(this).css('cursor', 'default');
                return;
            }
            if (opts.containment) {
                $(this).css("margin", "0px");
            }

            var handle = null;
            if (typeof opts.handle == 'undefined' || opts.handle == null) {
                handle = $(this);
            } else {
                handle = (typeof opts.handle == 'string' ? $(opts.handle, this) : handle);
            }
            $.data(this, 'draggable', {
                options: opts,
                handle: handle
            });

            // bind mouse event using event namespace draggable
            handle.bind('mousedown.draggable', { target: this }, onMouseDown);
            handle.bind('mousemove.draggable', { target: this }, onMouseMove);

            function onMouseDown(e) {
                if (checkArea(e) == false) return;
                var $target = $(e.data.target);
                var position = $target.position();
                var data = {
                    startPosition: $target.css('position'),
                    startLeft: position.left,
                    startTop: position.top,
                    left: position.left,
                    top: position.top,
                    startX: e.pageX,
                    startY: e.pageY,
                    target: e.data.target,
                    parent: $(e.data.target).parent()[0],
                    targetArea: {},
                    ConstrainArea: {},
                    proxy: opts.proxy
                };
                computeArea(opts.containment, e.data.target);
                $(document).bind('mousedown.draggable', data, eventHelper.beginDrag);
                $(document).bind('mousemove.draggable', data, eventHelper.onDrag);
                $(document).bind('mouseup.draggable', data, eventHelper.endDrag);
                //计算目标区划 和 限制区划
                function computeArea(constrain, target) {
                    var areas = CalvinBase.domHelper.getElementsArea(constrain, target);
                    data.ConstrainArea = areas[0];
                    data.targetArea = areas[1];
                }
            };

            function onMouseMove(e) {
                if (checkArea(e)) {
                    $(this).css('cursor', opts.cursor);
                } else {
                    $(this).css('cursor', 'default');
                }
            };

            // 鼠标是不是在手柄的可拖动区域
            function checkArea(e) {
                var offset = $(handle).offset();
                var width = $(handle).outerWidth();
                var height = $(handle).outerHeight();
                var edge = opts.edge;
                if (e.pageY - offset.top > edge) {
                    if (offset.left + width - e.pageX > edge) {
                        if (offset.top + height - e.pageY > edge) {
                            if (e.pageX - offset.left > edge) {
                                return true;
                            }
                            return false;
                        }
                        return false;
                    }
                    return false;
                }
                return false;
            };



        });
    };
})();