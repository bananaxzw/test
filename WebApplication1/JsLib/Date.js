$SL.Date = function () {
    this.LeftPaddingZero = function (x) {
        /// <summary>
        /// 不足9时候左边补0
        /// </summary>
        /// <param name="x"></param>
        /// <returns type=""></returns>
        return (x < 0 || x > 9 ? "" : "0") + x
    }

    this.monthNames = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    this.monthAbbreviations = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    this.dayNames = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    this.dayAbbreviations = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
}
$sl.merge($SL.Date.prototype, {
    constructor: $SL.Date,
    /**
    *格式化时间
    *@param {Date} date时间
    *@param {String} format格式 日期格式 yyyy：4位数的年 yy:年的后2位  M：正常表示月份 MM：不足10左边补0 MMM:英文表示 NNN英文缩写 d:天数 dd:不足10补充0  EE：英文星期 E英文星期缩写  h:12小时制 H 小时制 m:分钟 mm不足2位补0 s:秒钟 ss不足2位补0
    */
    format: function (date, format) {
        /// <summary>
        /// 格式化时间
        /// </summary>
        /// <param name="date">要格式的日期
        /// </param>
        /// <param name="format">日期格式 yyyy：4位数的年 yy:年的后2位
        /// M：正常表示月份 MM：不足10左边补0 MMM:英文表示 NNN英文缩写
        /// d:天数 dd:不足10补充0
        /// EE：英文星期 E英文星期缩写
        /// h:12小时制 H 小时制
        /// m:分钟 mm不足2位补0
        /// s:秒钟 ss不足2位补0</param>
        /// <returns type=""></returns>
        format = format + "";
        var result = "";
        var i_format = 0;
        var c = "";
        var token = "";
        var y = date.getYear() + "";
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var E = date.getDay();
        var H = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
        // Convert real date parts into formatted versions
        var value = new Object();
        if (y.length < 4) {
            y = "" + (+y + 1900);
        }
        value["y"] = "" + y;
        value["yyyy"] = y;
        value["yy"] = y.substring(2, 4);
        value["M"] = M;
        value["MM"] = this.LeftPaddingZero(M);
        value["MMM"] = this.monthNames[M - 1];
        value["NNN"] = this.monthAbbreviations[M - 1];
        value["d"] = d;
        value["dd"] = this.LeftPaddingZero(d);
        value["E"] = this.dayAbbreviations[E];
        value["EE"] = this.dayNames[E];
        value["H"] = H;
        value["HH"] = this.LeftPaddingZero(H);
        if (H == 0) {
            value["h"] = 12;
        }
        else if (H > 12) {
            value["h"] = H - 12;
        }
        else {
            value["h"] = H;
        }
        value["hh"] = this.LeftPaddingZero(value["h"]);
        value["K"] = value["h"] - 1;
        value["k"] = value["H"] + 1;
        value["KK"] = this.LeftPaddingZero(value["K"]);
        value["kk"] = this.LeftPaddingZero(value["k"]);
        if (H > 11) {
            value["a"] = "PM";
        }
        else {
            value["a"] = "AM";
        }
        value["m"] = m;
        value["mm"] = this.LeftPaddingZero(m);
        value["s"] = s;
        value["ss"] = this.LeftPaddingZero(s);
        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (typeof (value[token]) != "undefined") {
                result = result + value[token];
            }
            else {
                result = result + token;
            }
        }
        return result;
    },
    parseString: function (val, format) {
        if (typeof (format) == "undefined" || format == null || format == "") {
            var generalFormats = new Array('y-M-d', 'MMM d, y', 'MMM d,y', 'y-MMM-d', 'd-MMM-y', 'MMM d', 'MMM-d', 'd-MMM');
            var monthFirst = new Array('M/d/y', 'M-d-y', 'M.d.y', 'M/d', 'M-d');
            var dateFirst = new Array('d/M/y', 'd-M-y', 'd.M.y', 'd/M', 'd-M');
            var checkList = new Array(generalFormats, Date.preferAmericanFormat ? monthFirst : dateFirst, Date.preferAmericanFormat ? dateFirst : monthFirst);
            for (var i = 0; i < checkList.length; i++) {
                var l = checkList[i];
                for (var j = 0; j < l.length; j++) {
                    var d = Date.parseString(val, l[j]);
                    if (d != null) {
                        return d;
                    }
                }
            }
            return null;
        };

        this.isInteger = function (val) {
            for (var i = 0; i < val.length; i++) {
                if ("1234567890".indexOf(val.charAt(i)) == -1) {
                    return false;
                }
            }
            return true;
        };
        this.getInt = function (str, i, minlength, maxlength) dd{
            for (var x = maxlength; x >= minlength; x--) {
                var token = str.substring(i, i + x);
                if (token.length < minlength) {
                    return null;
                }
                if (this.isInteger(token)) {
                    return token;
                }
            }
            return null;
        };
        val = val + "";
        format = format + "";
        var i_val = 0;
        var i_format = 0;
        var c = "";
        var token = "";
        var token2 = "";
        var x, y;
        var year = new Date().getFullYear();
        var month = 1;
        var date = 1;
        var hh = 0;
        var mm = 0;
        var ss = 0;
        var ampm = "";
        while (i_format < format.length) {
            // Get next token from format string
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            // Extract contents of value based on format token
            if (token == "yyyy" || token == "yy" || token == "y") {
                if (token == "yyyy") {
                    x = 4; y = 4;
                }
                if (token == "yy") {
                    x = 2; y = 2;
                }
                if (token == "y") {
                    x = 2; y = 4;
                }
                year = this.getInt(val, i_val, x, y);
                if (year == null) {
                    return null;
                }
                i_val += year.length;
                if (year.length == 2) {
                    if (year > 70) {
                        year = 1900 + (year - 0);
                    }
                    else {
                        year = 2000 + (year - 0);
                    }
                }
            }
            else if (token == "MMM" || token == "NNN") {
                month = 0;
                var names = (token == "MMM" ? (this.monthNames.concat(this.monthAbbreviations)) : this.monthAbbreviations);
                for (var i = 0; i < names.length; i++) {
                    var month_name = names[i];
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                        month = (i % 12) + 1;
                        i_val += month_name.length;
                        break;
                    }
                }
                if ((month < 1) || (month > 12)) {
                    return null;
                }
            }
            else if (token == "EE" || token == "E") {
                var names = (token == "EE" ? this.dayNames : this.dayAbbreviations);
                for (var i = 0; i < names.length; i++) {
                    var day_name = names[i];
                    if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            }
            else if (token == "MM" || token == "M") {
                month = this.getInt(val, i_val, token.length, 2);
                if (month == null || (month < 1) || (month > 12)) {
                    return null;
                }
                i_val += month.length;
            }
            else if (token == "dd" || token == "d") {
                date = this.getInt(val, i_val, token.length, 2);
                if (date == null || (date < 1) || (date > 31)) {
                    return null;
                }
                i_val += date.length;
            }
            else if (token == "hh" || token == "h") {
                hh = this.getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 12)) {
                    return null;
                }
                i_val += hh.length;
            }
            else if (token == "HH" || token == "H") {
                hh = this.getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 23)) {
                    return null;
                }
                i_val += hh.length;
            }
            else if (token == "KK" || token == "K") {
                hh = this.getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 11)) {
                    return null;
                }
                i_val += hh.length;
                hh++;
            }
            else if (token == "kk" || token == "k") {
                hh = this.getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 24)) {
                    return null;
                }
                i_val += hh.length;
                hh--;
            }
            else if (token == "mm" || token == "m") {
                mm = this.getInt(val, i_val, token.length, 2);
                if (mm == null || (mm < 0) || (mm > 59)) {
                    return null;
                }
                i_val += mm.length;
            }
            else if (token == "ss" || token == "s") {
                ss = this.getInt(val, i_val, token.length, 2);
                if (ss == null || (ss < 0) || (ss > 59)) {
                    return null;
                }
                i_val += ss.length;
            }
            else if (token == "a") {
                if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                    ampm = "AM";
                }
                else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                    ampm = "PM";
                }
                else {
                    return null;
                }
                i_val += 2;
            }
            else {
                if (val.substring(i_val, i_val + token.length) != token) {
                    return null;
                }
                else {
                    i_val += token.length;
                }
            }
        }
        // If there are any trailing characters left in the value, it doesn't match
        if (i_val != val.length) {
            return null;
        }
        // Is date valid for month?
        if (month == 2) {
            // Check for leap year
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
                if (date > 29) {
                    return null;
                }
            }
            else {
                if (date > 28) {
                    return null;
                }
            }
        }
        if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
            if (date > 30) {
                return null;
            }
        }
        // Correct hours value
        if (hh < 12 && ampm == "PM") {
            hh = hh - 0 + 12;
        }
        else if (hh > 11 && ampm == "AM") {
            hh -= 12;
        }
        return new Date(year, month - 1, date, hh, mm, ss);

    },
    isBefore: function (date1, date2) {
        /// <summary>
        /// 判断
        /// </summary>
        /// <param name="date1"></param>
        /// <param name="date2"></param>
        /// <returns type=""></returns>
        if (date1 === null || date2 === null) return false;
        return (date1.getTime() < date2.getTime());
    },
    add: function (date, part, num) {
    	/// <summary>
    	/// 将指定的数目（月数，天数，年数等等）加到当前时间上
    	/// </summary>
    	/// <param name="date">日期</param>
    	/// <param name="part">数目的类型（y:年 M月 d天 h小时 m分 s秒）</param>
    	/// <param name="num"></param>
    	/// <returns type=""></returns>
        if (typeof (interval) == "undefined" || interval == null || typeof (number) == "undefined" || number == null) {
            return this;
        }
        number = +number;
        if (interval == 'y') { // year
            this.setFullYear(this.getFullYear() + number);
        }
        else if (interval == 'M') { // Month
            this.setMonth(this.getMonth() + number);
        }
        else if (interval == 'd') { // Day
            this.setDate(this.getDate() + number);
        }
        else if (interval == 'w') { // Weekday工作日 //没测试
            var step = (number > 0) ? 1 : -1;
            while (number != 0) {
                this.add('d', step);
                while (this.getDay() == 0 || this.getDay() == 6) {
                    this.add('d', step);
                }
                number -= step;
            }
        }
        else if (interval == 'h') { // Hour
            this.setHours(this.getHours() + number);
        }
        else if (interval == 'm') { // Minute
            this.setMinutes(this.getMinutes() + number);
        }
        else if (interval == 's') { // Second
            this.setSeconds(this.getSeconds() + number);
        }
        return this;
    
    }
});
$sl.Date = new $SL.Date();
