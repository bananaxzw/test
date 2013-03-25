/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="CalvinBase.js" />
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
    /**
    * @description 
    * @param 
    */
    var opts;
    var defaults = {
        width: 'auto',
        height: 'auto',
        fit: false,
        border: true,
        animate: true
    };

    $.fn.CalvinAccordion = function (options, params) {
        var accrodionHelper = {
            wrapAccordion: function (container) {
                var cc = $(container);
                cc.addClass('accordion');
                if (cc.attr('border') == 'false') {
                    cc.addClass('accordion-noborder');
                } else {
                    cc.removeClass('accordion-noborder');
                }
                var panels = [];
                if (cc.find('>div[selected=true]').length == 0) {
                    cc.find('>div:first').attr('selected', 'true');
                }

                cc.find('>div').each(function () {
                    var pp = $(this);
                    panels.push(pp);
                    var options = {
                        collapsible: true,
                        minimizable: false,
                        maximizable: false,
                        closable: false,
                        doSize: false,
                        collapsed: false,
                        animate: opts.animate,
                        onBeforeExpand: function () {
                            if (!$.data(this, "panel").options.collapsed) {
                                return;
                            }
                            accrodionHelper.setAllPanelCollapse(container);
                        },
                        onExpand: function () {

                        },
                        onBeforeCollapse: function () {

                        }
                    }

                    accrodionHelper.createOneAccordionPanel(container, pp, options);
                });

                return { accordion: cc, panels: panels };
            },
            /*
            * @description 生成一个panel
            * @param 要生成panel的div JQ对象 
            *@param options 生成pannel初始化的参数
            */
            createOneAccordionPanel: function (container, $DivObj, options) {
                $DivObj.CalvinPanel(options);
                //                $DivObj.CalvinPanel('getbody').addClass('accordion-body');
                $DivObj.CalvinPanel('getheader').addClass('accordion-header').click(function (event) {
                    if (!$.data($DivObj[0], "panel").options.collapsed) {
                        accrodionHelper.setAllPanelCollapse(container);
                        return;
                    }
                    accrodionHelper.setAllPanelCollapse(container);
                    $(this).find('.panel-tool-collapse').triggerHandler('click');
                    event.stopPropagation();
                });
            },

            defaultExpendPanel: function (container) {
                var panels = $.data(container, "accordion").panels;
                var isOnAlreadyExpend = false;
                $.each(panels, function (i) {
                    if (this.attr("selected") == undefined) {
                        this.attr("selected", "false");
                    }
                    if (isOnAlreadyExpend) {
                        this.CalvinPanel("Collapse");
                    }
                    else {
                        if (!(this.attr("selected") == "true")) {
                            this.CalvinPanel("Collapse");
                        }
                        else {
                            isOnAlreadyExpend = true;
                        }
                    }

                })
            },
            /*
            * @description 缩起所有面板
            */
            setAllPanelCollapse: function (container) {
                var panels = $.data(container, "accordion").panels;
                $.each(panels, function (i) {
                    this.CalvinPanel("Collapse");
                });

            }

        };

        var styleHelper = {
            /*
            *@description  主要是设置accordion
            */
            setSize: function (container) {
                var opts = $.data(container, 'accordion').options;
                var panels = $.data(container, 'accordion').panels;

                var cc = $(container);
                //如果是停靠在父元素 则宽高取父元素
                if (opts.fit == true) {
                    var p = cc.parent();
                    opts.width = p.width();
                    opts.height = p.height();
                }

                if (opts.width > 0) {
                    //给container赋值 如果是盒子模型的话 就必须减去padding和boder的宽度
                    cc.width($.boxModel == true ? (opts.width - (cc.outerWidth() - cc.width())) : opts.width);
                }
                var panelHeight = 'auto';
                /*
                *设置accordion中单个pannel的高度
                *思路是 父元素（如果fit=true的画就是container的panrent,否则就是container）减去panel的数量*panelheaderde的高度
                */
                if (opts.height > 0) {
                    cc.height($.boxModel == true ? (opts.height - (cc.outerHeight() - cc.height())) : opts.height);
                    // get the first panel's header height as all the header height
                    var headerHeight = panels[0].CalvinPanel('getHeader').css('height', null).outerHeight();
                    panelHeight = opts.height - (panels.length - 1) * headerHeight;
                }
                for (var i = 0; i < panels.length; i++) {
                    var panel = panels[i];
                    var header = panel.CalvinPanel('getHeader');
                    header.height($.boxModel == true ? (headerHeight - (header.outerHeight() - header.height())) : headerHeight);
                    panel.CalvinPanel('resize', {
                        width: opts.width,
                        height: panelHeight
                    });
                }

            }
        };


        var eventHelper = {
            onCollapse: function (event) {
                event.stopPropagation();
            },
            collapse: function (panel) {

            }


        };

        return this.each(function () {
            var $this = $(this);
            var state = $.data(this, "accordion");
            if (state) {
                opts = $.extend(state.options, options);
                state.options = opts;
            }
            else {

                opts = $.extend({}, defaults, {
                    width: (parseInt($this.css('width')) || undefined),
                    height: (parseInt($this.css('height')) || undefined),
                    fit: ($this.attr('fit') ? $this.attr('fit') == 'true' : undefined),
                    border: ($this.attr('border') ? $this.attr('border') == 'true' : undefined)
                }, options);
                $.data(this, "accordion", { accordion: null, panels: null, options: opts });
            }
            var data = $.data(this, "accordion");
            var temp = accrodionHelper.wrapAccordion(this);
            data.accordion = temp.accordion;
            data.panels = temp.panels;
            styleHelper.setSize(this);
            accrodionHelper.defaultExpendPanel(this);
        });
    }
})(); 