/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="CalvinPanel.js" />
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


    var layoutHelper = {
        initLayout: function (container) {
            var cc = $(container);
            styleHelper.setContainerStyle(container);
            //水平拖拉帮助
            $('<div class="layout-split-proxy-h"></div>').appendTo(cc);
            //垂直拖拉辅助
            $('<div class="layout-split-proxy-v"></div>').appendTo(cc);

            var panels = {
                center: panelHelper.createPanel(container, 'center'),
                north: panelHelper.createPanel(container, 'north'),
                south: panelHelper.createPanel(container, 'south'),
                east: panelHelper.createPanel(container, 'east'),
                west: panelHelper.createPanel(container, 'west')
            };

            $(container).bind('_resize', function () {
                var opts = $.data(container, 'layout').options;
                if (opts.fit == true) {
                    setSize(container);
                }
                return false;
            });
            $(window).resize(function () {
                styleHelper.setSize(container);
            });
            return panels;
        }
    };
    var panelHelper = {
        createPanel: function (container, dir) {
            var pp = $('>div[ region=' + dir + ']', container);
            if (!pp.length)
                return pp;
            pp.addClass('layout-body');

            var toolCls = null;
            if (dir == 'north') {
                toolCls = 'layout-button-up';
            } else if (dir == 'south') {
                toolCls = 'layout-button-down';
            } else if (dir == 'east') {
                toolCls = 'layout-button-right';
            } else if (dir == 'west') {
                toolCls = 'layout-button-left';
            }

            var cls = 'layout-panel layout-panel-' + dir;
            //如果有2个panel有splite则要加layout-spit-direction样式
            if (pp.attr('split') == 'true') {
                cls += ' layout-split-' + dir;
            }
            pp.CalvinPanel({
                cls: cls,
                doSize: false,
                border: (pp.attr('border') == 'false' ? false : true),
                tools: [{
                    iconCls: toolCls,
                    handler: function () {
                        eventHelper.collapsePanel(container, dir);
                    }
                }]
            });

            /*
            if (pp.attr('split') == 'true') {
            var panel = pp.CalvinPanel('panel');

            var handles = '';
            if (dir == 'north') handles = 's';
            if (dir == 'south') handles = 'n';
            if (dir == 'east') handles = 'w';
            if (dir == 'west') handles = 'e';
               
            //水平或者竖直移动时候 灰色的临时调整杆
            panel.resizable({
            handles: handles,
            onStartResize: function (e) {
            resizing = true;

            if (dir == 'north' || dir == 'south') {
            var proxy = $('>div.layout-split-proxy-v', container);
            } else {
            var proxy = $('>div.layout-split-proxy-h', container);
            }
            var top = 0, left = 0, width = 0, height = 0;
            var pos = { display: 'block' };
            if (dir == 'north') {
            pos.top = parseInt(panel.css('top')) + panel.outerHeight() - proxy.height();
            pos.left = parseInt(panel.css('left'));
            pos.width = panel.outerWidth();
            pos.height = proxy.height();
            } else if (dir == 'south') {
            pos.top = parseInt(panel.css('top'));
            pos.left = parseInt(panel.css('left'));
            pos.width = panel.outerWidth();
            pos.height = proxy.height();
            } else if (dir == 'east') {
            pos.top = parseInt(panel.css('top')) || 0;
            pos.left = parseInt(panel.css('left')) || 0;
            pos.width = proxy.width();
            pos.height = panel.outerHeight();
            } else if (dir == 'west') {
            pos.top = parseInt(panel.css('top')) || 0;
            pos.left = panel.outerWidth() - proxy.width();
            pos.width = proxy.width();
            pos.height = panel.outerHeight();
            }
            proxy.css(pos);

            $('<div class="layout-mask"></div>').css({
            left: 0,
            top: 0,
            width: cc.width(),
            height: cc.height()
            }).appendTo(cc);
            },
            onResize: function (e) {
            if (dir == 'north' || dir == 'south') {
            var proxy = $('>div.layout-split-proxy-v', container);
            proxy.css('top', e.pageY - $(container).offset().top - proxy.height() / 2);
            } else {
            var proxy = $('>div.layout-split-proxy-h', container);
            proxy.css('left', e.pageX - $(container).offset().left - proxy.width() / 2);
            }
            return false;
            },
            onStopResize: function () {
            $('>div.layout-split-proxy-v', container).css('display', 'none');
            $('>div.layout-split-proxy-h', container).css('display', 'none');
            var opts = pp.panel('options');
            opts.width = panel.outerWidth();
            opts.height = panel.outerHeight();
            opts.left = panel.css('left');
            opts.top = panel.css('top');
            pp.panel('resize');
            setSize(container);
            resizing = false;

            cc.find('>div.layout-mask').remove();
            }
            });
               
            } */
            return pp;
        }

    };
    var styleHelper = {
        setContainerStyle: function (container) {
            var cc = $(container);

            if (cc[0].tagName == 'BODY') {
                $('html').css({
                    height: '100%',
                    overflow: 'hidden'
                });
                $('body').css({
                    height: '100%',
                    overflow: 'hidden',
                    border: 'none'
                });
            }
            cc.addClass('layout');
            cc.css({
               // margin: 0,
                padding: 0
            });

        },
        /*
        * 设置布局 依次顺序为 上 ，下 左，右，中
        * 设置了上下 就可以知道 左右的top坐标
        * 
        */
        setSize: function (container) {
            var opts = $.data(container, 'layout').options;
            var panels = $.data(container, 'layout').panels;

            var cc = $(container);

            if (opts.fit == true) {
                var p = cc.parent();
                cc.width(p.width()).height(p.height());
            }
            //计算中间的距离
            var cpos = {
                top: 0,
                left: 0,
                width: cc.width(),
                height: cc.height()
            };

            // set north panel size
            function setNorthSize(pp) {
                if (pp.length == 0) return;
                pp.CalvinPanel('resize', {
                    width: cc.width(),
                    height: pp.CalvinPanel('options').height,
                    left: 0,
                    top: 0
                });
                cpos.top += pp.CalvinPanel('options').height;
                cpos.height -= pp.CalvinPanel('options').height;
            }
            if (otherHelper.isVisible(panels.expandNorth)) {
                setNorthSize(panels.expandNorth);
            } else {
                setNorthSize(panels.north);
            }

            // set south panel size
            function setSouthSize(pp) {
                if (pp.length == 0) return;
                pp.CalvinPanel('resize', {
                    width: cc.width(),
                    height: pp.CalvinPanel('options').height,
                    left: 0,
                    top: cc.height() - pp.CalvinPanel('options').height
                });
                cpos.height -= pp.CalvinPanel('options').height;
            }
            if (otherHelper.isVisible(panels.expandSouth)) {
                setSouthSize(panels.expandSouth);
            } else {
                setSouthSize(panels.south);
            }

            // set east panel size
            function setEastSize(pp) {
                if (pp.length == 0) return;
                pp.CalvinPanel('resize', {
                    width: pp.CalvinPanel('options').width,
                    height: cpos.height,
                    left: cc.width() - pp.CalvinPanel('options').width,
                    top: cpos.top
                });
                cpos.width -= pp.CalvinPanel('options').width;
            }
            if (otherHelper.isVisible(panels.expandEast)) {
                setEastSize(panels.expandEast);
            } else {
                setEastSize(panels.east);
            }

            // set west panel size
            function setWestSize(pp) {
                if (pp.length == 0) return;
                pp.CalvinPanel('resize', {
                    width: pp.CalvinPanel('options').width,
                    height: cpos.height,
                    left: 0,
                    top: cpos.top
                });
                cpos.left += pp.CalvinPanel('options').width;
                cpos.width -= pp.CalvinPanel('options').width;
            }
            if (otherHelper.isVisible(panels.expandWest)) {
                setWestSize(panels.expandWest);
            } else {
                setWestSize(panels.west);
            }

            panels.center.CalvinPanel('resize', cpos);
        }

    };

    var eventHelper = {
        collapsePanel: function (container, region) {
            var panels = $.data(container, 'layout').panels;
            var cc = $(container);

            function createExpandPanel(dir) {
                var icon;
                if (dir == 'east') icon = 'layout-button-left'
                else if (dir == 'west') icon = 'layout-button-right'
                else if (dir == 'north') icon = 'layout-button-down'
                else if (dir == 'south') icon = 'layout-button-up';

                var p = $('<div></div>').appendTo(cc).CalvinPanel({
                    cls: 'layout-expand',
                    title: '&nbsp;',
                    closed: true,
                    doSize: false,
                    tools: [{
                        iconCls: icon,
                        handler: function () {
                            eventHelper.expandPanel(container, region);
                        }
                    }]
                });
                p.CalvinPanel('panel').hover(
				function () { $(this).addClass('layout-expand-over'); },
				function () { $(this).removeClass('layout-expand-over'); }
			);
                return p;
            }



            if (region == 'east') {
                if (panels.east.CalvinPanel('options').onBeforeCollapse.call(panels.east) == false) return;

                panels.center.CalvinPanel('resize', {
                    width: panels.center.CalvinPanel('options').width + panels.east.CalvinPanel('options').width - 28
                });
                panels.east.CalvinPanel('panel').animate({ left: cc.width() }, function () {
                    panels.east.CalvinPanel('close');
                    panels.expandEast.CalvinPanel('open').CalvinPanel('resize', {
                        top: panels.east.CalvinPanel('options').top,
                        left: cc.width() - 28,
                        width: 28,
                        height: panels.east.CalvinPanel('options').height
                    });
                    panels.east.CalvinPanel('options').onCollapse.call(panels.east);
                });
                if (!panels.expandEast) {
                    panels.expandEast = createExpandPanel('east');
                    panels.expandEast.CalvinPanel('panel').click(function () {
                        panels.east.CalvinPanel('open').CalvinPanel('resize', { left: cc.width() });
                        panels.east.CalvinPanel('panel').animate({
                            left: cc.width() - panels.east.CalvinPanel('options').width
                        });
                        return false;
                    });
                }
            }
            else if (region == 'west') {
                if (panels.west.CalvinPanel('options').onBeforeCollapse.call(panels.west) == false) return;
                //扩大中间panel
                panels.center.CalvinPanel('resize', {
                    width: panels.center.CalvinPanel('options').width + panels.west.CalvinPanel('options').width - 28,
                    left: 28
                });
                //panel向左移动原先的width也就是隐藏起来
                panels.west.CalvinPanel('panel').animate({ left: -panels.west.CalvinPanel('options').width }, function () {
                    panels.west.CalvinPanel('close');

                    panels.expandWest.CalvinPanel('open').CalvinPanel('resize', {
                        top: panels.west.CalvinPanel('options').top,
                        left: 0,
                        width: 28,
                        height: panels.west.CalvinPanel('options').height
                    });
                    panels.west.CalvinPanel('options').onCollapse.call(panels.west);
                });


                if (!panels.expandWest) {
                    panels.expandWest = createExpandPanel('west');
                    panels.expandWest.CalvinPanel('panel').click(function () {
                        panels.west.CalvinPanel("open").CalvinPanel('resize', { left: -panels.west.CalvinPanel('options').width });
                        panels.west.CalvinPanel('panel').animate({
                            left: 0
                        }, function () {
                            styleHelper.setSize(container);
                        });
                        return false;
                    });
                }
            }
            else if (region == 'north') {
                if (panels.north.CalvinPanel('options').onBeforeCollapse.call(panels.north) == false) return;

                var hh = cc.height() - 28;
                if (otherHelper.otherHelperisVisible(panels.expandSouth)) {
                    hh -= panels.expandSouth.CalvinPanel('options').height;
                } else if (otherHelper.isVisible(panels.south)) {
                    hh -= panels.south.CalvinPanel('options').height;
                }
                panels.center.CalvinPanel('resize', { top: 28, height: hh });
                panels.east.CalvinPanel('resize', { top: 28, height: hh });
                panels.west.CalvinPanel('resize', { top: 28, height: hh });
                if (otherHelper.isVisible(panels.expandEast)) panels.expandEast.CalvinPanel('resize', { top: 28, height: hh });
                if (otherHelper.isVisible(panels.expandWest)) panels.expandWest.CalvinPanel('resize', { top: 28, height: hh });

                panels.north.CalvinPanel('panel').animate({ top: -panels.north.CalvinPanel('options').height }, function () {
                    panels.north.CalvinPanel('close');
                    panels.expandNorth.CalvinPanel('open').CalvinPanel('resize', {
                        top: 0,
                        left: 0,
                        width: cc.width(),
                        height: 28
                    });
                    panels.north.CalvinPanel('options').onCollapse.call(panels.north);
                });
                if (!panels.expandNorth) {
                    panels.expandNorth = createExpandPanel('north');
                    panels.expandNorth.CalvinPanel('panel').click(function () {
                        panels.north.CalvinPanel('open').panel('resize', { top: -panels.north.CalvinPanel('options').height });
                        panels.north.CalvinPanel('panel').animate({ top: 0 });
                        return false;
                    });
                }
            }
            else if (region == 'south') {
                if (panels.south.CalvinPanel('options').onBeforeCollapse.call(panels.south) == false) return;

                var hh = cc.height() - 28;
                if (otherHelper.isVisible(panels.expandNorth)) {
                    hh -= panels.expandNorth.CalvinPanel('options').height;
                } else if (otherHelper.isVisible(panels.north)) {
                    hh -= panels.north.CalvinPanel('options').height;
                }
                panels.center.CalvinPanel('resize', { height: hh });
                panels.east.CalvinPanel('resize', { height: hh });
                panels.west.CalvinPanel('resize', { height: hh });
                if (otherHelper.isVisible(panels.expandEast)) panels.expandEast.CalvinPanel('resize', { height: hh });
                if (otherHelper.isVisible(panels.expandWest)) panels.expandWest.CalvinPanel('resize', { height: hh });

                panels.south.CalvinPanel('panel').animate({ top: cc.height() }, function () {
                    panels.south.CalvinPanel('close');
                    panels.expandSouth.CalvinPanel('open').CalvinPanel('resize', {
                        top: cc.height() - 28,
                        left: 0,
                        width: cc.width(),
                        height: 28
                    });
                    panels.south.CalvinPanel('options').onCollapse.call(panels.south);
                });
                if (!panels.expandSouth) {
                    panels.expandSouth = createExpandPanel('south');
                    panels.expandSouth.CalvinPanel('panel').click(function () {
                        panels.south.CalvinPanel('open').CalvinPanel('resize', { top: cc.height() });
                        panels.south.CalvinPanel('panel').animate({ top: cc.height() - panels.south.CalvinPanel('options').height });
                        return false;
                    });
                }
            }
        },
        expandPanel: function (container, region) {
            var panels = $.data(container, 'layout').panels;
            var cc = $(container);
            if (region == 'east' && panels.expandEast) {
                if (panels.east.CalvinPanel('options').onBeforeExpand.call(panels.east) == false) return;

                panels.expandEast.CalvinPanel('close');
                panels.east.CalvinPanel('panel').stop(true, true);
                panels.east.CalvinPanel('open').CalvinPanel('resize', { left: cc.width() });
                panels.east.CalvinPanel('panel').animate({
                    left: cc.width() - panels.east.CalvinPanel('options').width
                }, function () {
                    styleHelper.setSize(container);
                    panels.east.CalvinPanel('options').onExpand.call(panels.east);
                });
            } else if (region == 'west' && panels.expandWest) {
                if (panels.west.CalvinPanel('options').onBeforeExpand.call(panels.west) == false) return;

                panels.expandWest.CalvinPanel('close');
                panels.west.CalvinPanel('panel').stop(true, true);
                panels.west.CalvinPanel('open').CalvinPanel('resize', { left: -panels.west.CalvinPanel('options').width });
                panels.west.CalvinPanel('panel').animate({
                    left: 0
                }, function () {
                    styleHelper.setSize(container);
                    panels.west.CalvinPanel('options').onExpand.call(panels.west);
                });
            } else if (region == 'north' && panels.expandNorth) {
                if (panels.north.CalvinPanel('options').onBeforeExpand.call(panels.north) == false) return;

                panels.expandNorth.CalvinPanel('close');
                panels.north.CalvinPanel('panel').stop(true, true);
                panels.north.CalvinPanel('open').CalvinPanel('resize', { top: -panels.north.CalvinPanel('options').height });
                panels.north.CalvinPanel('panel').animate({ top: 0 }, function () {
                    styleHelper.setSize(container);
                    panels.north.CalvinPanel('options').onExpand.call(panels.north);
                });
            } else if (region == 'south' && panels.expandSouth) {
                if (panels.south.CalvinPanel('options').onBeforeExpand.call(panels.south) == false) return;

                panels.expandSouth.CalvinPanel('close');
                panels.south.CalvinPanel('panel').stop(true, true);
                panels.south.CalvinPanel('open').CalvinPanel('resize', { top: cc.height() });
                panels.south.CalvinPanel('panel').animate({ top: cc.height() - panels.south.CalvinPanel('options').height }, function () {
                    styleHelper.setSize(container);
                    panels.south.CalvinPanel('options').onExpand.call(panels.south);
                });
            }
        }
    };

    var otherHelper = {
        isVisible: function (pp) {
            if (!pp) return false;
            if (pp.length) {
                return pp.CalvinPanel('panel').is(':visible');
            } else {
                return false;
            }
        }
    };

    $.fn.CalvinLayout = function (options, params) {
        return this.each(function () {
            var state = $.data(this, 'layout');
            if (!state) {
                var opts = $.extend({}, {
                    fit: $(this).attr('fit') == 'true'
                });
                //				var t1=new Date().getTime();
                $.data(this, 'layout', {
                    options: opts,
                    panels: layoutHelper.initLayout(this)
                });
                // bindEvents(this);
                //				var t2=new Date().getTime();
                //				alert(t2-t1)
            }
            styleHelper.setSize(this);

        });
    }
})();

