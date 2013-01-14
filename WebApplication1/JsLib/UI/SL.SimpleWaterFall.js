/// <reference path="../sl.js" />
/// <reference path="../SL.Node.js" />
/// <reference path="../SL.throttle.js" />




var Defaults = {
    container: document.body,
    minColCount: 1,
    colWidth: 100
}


function SLWaterFall(options) {
    this.opts = sl.extend({}, Defaults, options);
    

}


