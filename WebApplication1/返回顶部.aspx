<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="返回顶部.aspx.cs" Inherits="JavascriptComponent.返回顶部" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="jquery-1.6.min.js" type="text/javascript"></script>
     <style type="text/css">
        .backToTop
        {
            display: none;
            width: 18px;
            line-height: 1.2;
            padding: 5px 0;
            background-color: #000;
            color: #fff;
            font-size: 12px;
            text-align: center;
            position: fixed;
            _position: absolute;
            right: 10px;
            bottom: 100px;
            _bottom: "auto";
            cursor: pointer;
            opacity: .6;
            filter: Alpha(opacity=60);
        }
    </style>
    <script type="text/javascript">
        $(document).ready(function () {
            var $backToTopTxt = "返回顶部",
        $backToTopEle = $('<div class="backToTop"></div>').appendTo($("body"))
        .text($backToTopTxt).attr("title", $backToTopTxt).click(function () {
            $("html,body").animate({ scrollTop: 0 }, 120);
        }), $backToTopFun = function () {
            var st = $(window).scrollTop(), winh = $(window).height();
        
            (st > 0) ? $backToTopEle.show() : $backToTopEle.hide();
            //IE6下的定位
            if (!window.XMLHttpRequest) {
                $backToTopEle.css("top", st + winh - 166);
            }
        };
            $(window).bind("scroll", $backToTopFun);
            $(function () { $backToTopFun(); });
        });
    
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div style=" height:1000px;" >
   
    </div>
    </form>
</body>
</html>
