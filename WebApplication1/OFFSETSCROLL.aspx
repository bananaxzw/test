<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="OFFSETSCROLL.aspx.cs" Inherits="JavascriptComponent.OFFSETSCROLL" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        html, body
        {
            margin: 0px;
        }
    </style>
    <script type="text/javascript">

        // offsetWidth and offsetHeight
        //The dimensions of the element taken outside its border. (The width inside the padding in IE's quirks mode.)


        //clientWidth and clientHeight 在border里面 如果有滚动条要减去滚动条
        //The dimensions of the element taken inside its border, and minus any scrollbar size.
        // clientHeight: 可见区域的宽度, 不包括boder的宽度, 如果区域内带有滚动条, 还应该减去横向滚动条不可用的高度,
        //正常的是17px, 其实就是滚动条的可滚动的部分了,
        // 其实clientHeight与height的高度差不多, 如果不带滚动条的话他们的值都是一样的, 
        // 如果带有滚动条的话就会比height值少17px; 火狐与IE下均为一致. 如果有PADDING的话 还要加上PADDING的值。

        //scrollWidth and scrollHeight
        //scrollHeight:这个属性就比较麻烦了,因为它们在火狐跟IE下简直差太多了..
        //当实际内容小于ClientHeight时候
        //      IE6 IE7 Opera 表示读取内容的实际高度（height+border+margin+padding）-横向滚动条
        //      IE8 firefox   读取本身高度-横向滚动条+本身padding
        //当实际内容大于ClientHeight时候
        //      内容的实际高度（height+border+margin+padding）+本身的padding


        //最后我们来看offsetHeight
        //本身高度+padding+border
        //ScrollHeihgt与Height的区别是火狐下与offsetHeight一致,IE下如上所述.
        //The dimensions the element would be using if it did not have a scrollbar and was not constrained in size (in other words, the dimensions of its contents, plus its padding).
        //Only usable and reliable if the element actually has a scrollbar.


        //scrollLeft and scrollTop
        //The distance the element has been scrolled.



        window.onload = function () {
            justAtest2();
            justAtest3();
            justAtest4();
        }

        function justAtest1() {
           // var test4 = document.getElementById("test4");
          //  alert(test4.style.height);
              alert(document.documentElement.style.height || document.body.style.height);
        }

        function justAtest2() {
          //  alert($("#test4").width());
            var test4 = document.getElementById("text5");
            //alert(test4.clientHeight);
           alert(document.documentElement.clientHeight || document.body.clientHeight);
        }

        function justAtest3() {
           // var test4 = document.getElementById("test4");
           // alert(test4.scrollWidth);
            alert(document.documentElement.scrollHeight || document.body.scrollHeight)
        }

        function justAtest4() {

          //  var test4 = document.getElementById("text5");
            //alert(text5.offsetHeight);
           alert(document.documentElement.offsetHeight || document.body.offsetHeight)
        }

        //        function justAtest() {
        //            alert(document.documentElement.scrollHeight)
        //            alert(document.documentElement.clientHeight)
        //            alert(document.documentElement.offsetHeight)
        //        }


        function fff() {
            var t = document.getElementById("sfs");
            alert(t.offsetTop);
        }

        //没滚动条
        function findPosition(oElement) {
            if (typeof (oElement.offsetParent) != 'undefined') {
                for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
                    posX += oElement.offsetLeft;
                    posY += oElement.offsetTop;
                }
                alert(posY);
                return [posX, posY];
            } else {
                return [oElement.x, oElement.y];
            }
        }
        //有滚动条
        function findPositionWithScrolling(oElement) {
            if (typeof (oElement.offsetParent) != 'undefined') {
                var originalElement = oElement;
                for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
                    posX += oElement.offsetLeft;
                    posY += oElement.offsetTop;
                    if (oElement != originalElement && oElement != document.body && oElement != document.documentElement) {
                        posX -= oElement.scrollLeft;
                        posY -= oElement.scrollTop;
                    }
                }
                return [posX, posY];
            } else {
                return [oElement.x, oElement.y];
            }
        }
        //通用

        function findPositionWithScrolling(oElement) {
            function getNextAncestor(oElement) {
                var actualStyle;
                if (window.getComputedStyle) {
                    actualStyle = getComputedStyle(oElement, null).position;
                } else if (oElement.currentStyle) {
                    actualStyle = oElement.currentStyle.position;
                } else {

                    actualStyle = oElement.style.position;
                }
                if (actualStyle == 'absolute' || actualStyle == 'fixed') {

                    return oElement.offsetParent;
                }
                return oElement.parentNode;
            }
            if (typeof (oElement.offsetParent) != 'undefined') {
                var originalElement = oElement;
                for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
                    posX += oElement.offsetLeft;
                    posY += oElement.offsetTop;
                }
                if (!originalElement.parentNode || !originalElement.style || typeof (originalElement.scrollTop) == 'undefined') {

                    return [posX, posY];
                }
                oElement = getNextAncestor(originalElement);
                while (oElement && oElement != document.body && oElement != document.documentElement) {
                    posX -= oElement.scrollLeft;
                    posY -= oElement.scrollTop;
                    oElement = getNextAncestor(oElement);
                }
                alert(posY);
                return [posX, posY];
            } else {
                return [oElement.x, oElement.y];
            }
        }

        //文档的高度
        function alertSize() {
            var myWidth = 0, myHeight = 0;
            if (typeof (window.innerWidth) == 'number') {
                //Non-IE
                myWidth = window.innerWidth;
                myHeight = window.innerHeight;
            } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                //IE 6+ in 'standards compliant mode'
                myWidth = document.documentElement.clientWidth;
                myHeight = document.documentElement.clientHeight;
            } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                //IE 4 compatible
                myWidth = document.body.clientWidth;
                myHeight = document.body.clientHeight;
            }
            window.alert('Width = ' + myWidth);
            window.alert('Height = ' + myHeight);
        }

        function getScrollXY() {
            var scrOfX = 0, scrOfY = 0;
            if (typeof (window.pageYOffset) == 'number') {
                //Netscape compliant
                scrOfY = window.pageYOffset;
                scrOfX = window.pageXOffset;
            } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                //DOM compliant
                scrOfY = document.body.scrollTop;
                scrOfX = document.body.scrollLeft;
            } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                //IE6 standards compliant mode
                scrOfY = document.documentElement.scrollTop;
                scrOfX = document.documentElement.scrollLeft;
            }
            return [scrOfX, scrOfY];
        }
    </script>
</head>
<script src="jquery-1.4.1-vsdoc.js" type="text/javascript"></script>
<script>
    function tttt() {
        alert($("#sfsf").offset().top);
        $("#fasf")[0].style.top = 30 + (document.documentElement.scrollTop || document.body.scrollTop) + "px";
    }
</script>
<body>
    <form id="form1" runat="server">
 <div style="padding: 2px; height: 500px; width: 500px; margin-top: 50px; overflow: scroll;"
        id="test">
        <div style="height: 600px; float: left; width: 220px; overflow: scroll;
            border: 10px solid red" id="test2">
    <div style="height: 1000px; width: 200px; overflow:scroll; padding: 15px; border: 10px solid red; " id="test4">
        <div style="height: 1200px; width: 300px; border: 10px solid blue;" id
        ="text5">
            safs</div>
      </div>

 
     </div>
        <div style="height: 550px; float: left; width: 250px; border: 1px solid red" id="test3">
        </div>
    </div>
    <div style="width: 200px; height: 200px; overflow: auto">
        <div id="sfs" style="width: 300px; height: 300px;">
            sdgsdgsd</div>
    </div>
    <input id="Button1" type="button" value="button" onclick="fff();" />
    <div id="fasf" style="background: red; position: absolute; left: 100px; height: 40px;
        width: 40px;">
        afasfas
    </div>
    <div style="height: 100px; position: absolute; overflow: scroll;">
        <div style="height: 400px;">
            <input type="button" value="位置测试" id="sfsf" />
        </div>
    </div>
    <div style="height: 1000px;">
    </div>
    <input type="button" value="获取位置" onclick="findPositionWithScrolling(document.getElementById('sfsf'));tttt();"
        style="position: fixed; top: 600px;" />
    </form>
</body>
</html>
