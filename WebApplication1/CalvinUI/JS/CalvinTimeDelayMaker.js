
/********************************************************************************************
* 文件名称:	
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	延迟执行
* 注意事项：
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*
********************************************************************************************/

var CalvinTimeDelayMaker = {
    throttle: function (delay, action, tail, debounce, ctx) {
        var now = function () {
            return new Date();
        }, last_call = 0, last_exec = 0, timer = null, curr, diff,
       args, exec = function () {
           last_exec = now();
           action.apply(ctx, args);
       };

        return function () {
            ctx = ctx || this, args = arguments,
        curr = now(), diff = curr - (debounce ? last_call : last_exec) - delay;

            clearTimeout(timer);

            if (debounce) {
                if (tail) {
                    timer = setTimeout(exec, delay);
                } else if (diff >= 0) {
                    exec();
                }
            } else {
                if (diff >= 0) {
                    exec();
                } else if (tail) {
                    timer = setTimeout(exec, -diff);
                }
            }

            last_call = curr;
        }
    },

    debounce: function (idle, action, tail, ctx) {
        return CalvinTimeDelayMaker.throttle(idle, action, tail, true, ctx);
    }
};