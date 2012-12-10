/// <reference path="$SL.js" />
$SL.Cookie = function () { };
$sl.merge($SL.Cookie.prototype, {
    get: function (name) {
    	/// <summary>
    	/// 获取cookie
    	/// </summary>
    	/// <param name="name"></param>
    	/// <returns type=""></returns>
        var m = document.cookie.match((new RegExp(key + '=[a-zA-Z0-9.()=|%/_]+($|;)', 'g')));
        if (!m || !m[0]) {
            return null;
        } else {
            return unescape(m[0].substring(key.length + 1, m[0].length).replace(';', '')) || null;
        }
    },
    set: function (name, value, domain, path, hour) {
    	/// <summary>
    	/// 设置cookie
    	/// </summary>
    	/// <param name="name"></param>
    	/// <param name="value"></param>
    	/// <param name="domain"></param>
    	/// <param name="path"></param>
    	/// <param name="hour"></param>
    	/// <returns type=""></returns>
        if (hour) {
            var today = new Date();
            var expire = new Date();
            expire.setTime(today.getTime() + 3600000 * hour);
        }
        window.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
        return true;
    },
    remove: function (name, domain, path) {
    	/// <summary>
    	/// 移除cookie
    	/// </summary>
    	/// <param name="name"></param>
    	/// <param name="domain"></param>
    	/// <param name="path"></param>
        window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
    }
});