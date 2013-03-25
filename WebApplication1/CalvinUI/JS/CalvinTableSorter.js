/// <reference path="jquery-1.4.1-vsdoc.js" />
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
    $.extend({
        CalvinTableSorter: new function () {
            var parsers = [];
            var HeaderHelper = {
                formHeaderIcons: function (table) {
                    $("th", $("thead", table)).addClass("table-sortable");
                }
            }

            var EventHelper = {
                bindSortEvent: function (table) {

                    $("th", $("thead", table)).bind("click", { table: table }, EventHelper.sort);
                },
                sort: function (event) {
                    var table = event.data.table;
                    var cell = event.target;
                    var $cell = $(cell).removeClass("table-sortable");
                    if ($(cell).data("direction") == undefined || $(cell).data("direction") == "DESC") {
                        $(cell).data("direction", "ASC");
                        $(cell).removeClass("table-sorted-desc");
                        $(cell).addClass("table-sorted-asc");
                    }
                    else {
                        $(cell).data("direction", "DESC");
                        $(cell).removeClass("table-sorted-asc");
                        $(cell).addClass("table-sorted-desc");
                    }
                    var cellIndex = getActualCellIndex(cell);
                    var rows = $("tbody tr", table).get();
                    rows.sort(function (a, b) {
                        var keyA = $(a).children("td").eq(cellIndex).text();
                        var keyB = $(b).children("td").eq(cellIndex).text();
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                        return 0;

                    });

                    if ($(cell).data("direction") === "DESC") {
                        rows.reverse();
                    }
                    var fragment = document.createDocumentFragment();
                    for (var i = 0; i < rows.length; i++) {
                        fragment.appendChild(rows[i]);

                    }
                    table.getElementsByTagName("tbody")[0].appendChild(fragment);

                }


            }
            /**
            * Determine if a reference is defined
            */
            function def(o) { return (typeof o != "undefined"); };
            var tableHeaderIndexes = {};
            function getActualCellIndex(tableCellObj) {
                if (!def(tableCellObj.cellIndex)) { return null; }
                var tableObj = getParent(tableCellObj, "TABLE");
                var cellCoordinates = tableCellObj.parentNode.rowIndex + "-" + getCellIndex(tableCellObj);
                if (def(tableHeaderIndexes[tableObj.id])) {
                    return tableHeaderIndexes[tableObj.id][cellCoordinates];
                }

                var matrix = [];
                tableHeaderIndexes[tableObj.id] = {};
                var thead = getParent(tableCellObj, "THEAD");
                var trs = thead.getElementsByTagName('TR');


                for (var i = 0; i < trs.length; i++) {
                    var cells = trs[i].cells;
                    for (var j = 0; j < cells.length; j++) {
                        var c = cells[j];
                        var rowIndex = c.parentNode.rowIndex;
                        var cellId = rowIndex + "-" + this.getCellIndex(c);
                        var rowSpan = c.rowSpan || 1;
                        var colSpan = c.colSpan || 1;
                        var firstAvailCol;
                        if (!def(matrix[rowIndex])) {
                            matrix[rowIndex] = [];
                        }
                        var m = matrix[rowIndex];

                        for (var k = 0; k < m.length + 1; k++) {
                            if (!def(m[k])) {
                                firstAvailCol = k;
                                break;
                            }
                        }
                        tableHeaderIndexes[tableObj.id][cellId] = firstAvailCol;
                        for (var k = rowIndex; k < rowIndex + rowSpan; k++) {
                            if (!def(matrix[k])) {
                                matrix[k] = [];
                            }
                            var matrixrow = matrix[k];
                            for (var l = firstAvailCol; l < firstAvailCol + colSpan; l++) {
                                matrixrow[l] = "x";
                            }
                        }
                    }
                }

                return tableHeaderIndexes[tableObj.id][cellCoordinates];
            }

            function getCellIndex(td) {
                var tr = td.parentNode;
                var cells = tr.cells;
                if (cells && cells.length) {
                    if (cells.length > 1 && cells[cells.length - 1].cellIndex > 0) {
                        // Define the new function, overwrite the one we're running now, and then run the new one
                        (this.getCellIndex = function (td) {
                            return td.cellIndex;
                        })(td);
                    }
                    // Safari will always go through this slower block every time. Oh well.
                    for (var i = 0, L = cells.length; i < L; i++) {
                        if (tr.cells[i] == td) {
                            return i;
                        }
                    }
                }
                return 0;
            };

            function getParent(o, a, b) {
                if (o != null && o.nodeName) {
                    if (o.nodeName == a || (b && o.nodeName == b)) {
                        return o;
                    }
                    while (o = o.parentNode) {
                        if (o.nodeName && (o.nodeName == a || (b && o.nodeName == b))) {
                            return o;
                        }
                    }
                }
                return null;
            }


            this.construct = function (params) {
                return this.each(function () {
                    var $this = $(this);
                    var state = $.data(this, 'tabs');
                    HeaderHelper.formHeaderIcons(this);
                    EventHelper.bindSortEvent(this);
                })
            };
            //添加解析器
            this.addParser = function (parser) {
                var l = parsers.length,
                    a = true;
                for (var i = 0; i < l; i++) {
                    if (parsers[i].id.toLowerCase() == parser.id.toLowerCase()) {
                        a = false;
                    }
                }
                if (a) {
                    parsers.push(parser);
                };
            };

        }
    });

    $.fn.extend({
        CalvinTableSorter: $.CalvinTableSorter.construct
    });

    // make shortcut
    var ts = $.tablesorter;

    // add default parsers
    ts.addParser({
        id: "text",
        is: function (s) {
            return true;
        }, format: function (s) {
            return $.trim(s.toLocaleLowerCase());
        }, type: "text"
    });

    ts.addParser({
        id: "digit",
        is: function (s, table) {
            var c = table.config;
            return $.tablesorter.isDigit(s, c);
        }, format: function (s) {
            return $.tablesorter.formatFloat(s);
        }, type: "numeric"
    });

    ts.addParser({
        id: "currency",
        is: function (s) {
            return /^[£$€?.]/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat(s.replace(new RegExp(/[£$€]/g), ""));
        }, type: "numeric"
    });

    ts.addParser({
        id: "ipAddress",
        is: function (s) {
            return /^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);
        }, format: function (s) {
            var a = s.split("."),
                r = "",
                l = a.length;
            for (var i = 0; i < l; i++) {
                var item = a[i];
                if (item.length == 2) {
                    r += "0" + item;
                } else {
                    r += item;
                }
            }
            return $.tablesorter.formatFloat(r);
        }, type: "numeric"
    });

    ts.addParser({
        id: "url",
        is: function (s) {
            return /^(https?|ftp|file):\/\/$/.test(s);
        }, format: function (s) {
            return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//), ''));
        }, type: "text"
    });

    ts.addParser({
        id: "isoDate",
        is: function (s) {
            return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat((s != "") ? new Date(s.replace(
            new RegExp(/-/g), "/")).getTime() : "0");
        }, type: "numeric"
    });

    ts.addParser({
        id: "percent",
        is: function (s) {
            return /\%$/.test($.trim(s));
        }, format: function (s) {
            return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g), ""));
        }, type: "numeric"
    });

    ts.addParser({
        id: "usLongDate",
        is: function (s) {
            return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));
        }, format: function (s) {
            return $.tablesorter.formatFloat(new Date(s).getTime());
        }, type: "numeric"
    });

    ts.addParser({
        id: "shortDate",
        is: function (s) {
            return /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);
        }, format: function (s, table) {
            var c = table.config;
            s = s.replace(/\-/g, "/");
            if (c.dateFormat == "us") {
                // reformat the string in ISO format
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$1/$2");
            } else if (c.dateFormat == "uk") {
                // reformat the string in ISO format
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$2/$1");
            } else if (c.dateFormat == "dd/mm/yy" || c.dateFormat == "dd-mm-yy") {
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, "$1/$2/$3");
            }
            return $.tablesorter.formatFloat(new Date(s).getTime());
        }, type: "numeric"
    });
    ts.addParser({
        id: "time",
        is: function (s) {
            return /^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat(new Date("2000/01/01 " + s).getTime());
        }, type: "numeric"
    });
    ts.addParser({
        id: "metadata",
        is: function (s) {
            return false;
        }, format: function (s, table, cell) {
            var c = table.config,
                p = (!c.parserMetadataName) ? 'sortValue' : c.parserMetadataName;
            return $(cell).metadata()[p];
        }, type: "numeric"
    });


})()