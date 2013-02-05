<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ajax.aspx.cs" Inherits="WebApplication1.JsLib.ajax" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="jq1.72.js" type="text/javascript"></script>
    <script src="SL.Core.js" type="text/javascript"></script>
    <script src="SL.AJAX.js" type="text/javascript"></script>
    <script src="SL.Json.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            $("#Button1").click(function () {
                $.ajax({
                    url: "WebService1.asmx/GetPerson121",
                    type: "POST",
                    contentType:"application/json",
                    data:"{'Id':2}",
                    success: function (data) {
                        console.log(data);

                    },
                    error: function (status, xhr) {
                        console.log(status);
                    },
                    timeout: function (status, xhr) {
                        console.log(status);
                    
                    }
                });
            });

            $("#Button2").click(function () {
                SL().Ajax({
                    url: "WebService1.asmx/GetPerson121",
                    type: "POST",
                    data: {'Id':2},
                    onSuccess: function (data) {
                        console.log(data);

                    },
                    onError: function (status, xhr) {
                        console.log(status);
                    },
                    onTimeOut: function (status, xhr) {
                        console.log(status);

                    }
                });
            });

            $("#Button3").click(function () {
                SL().Ajax({
                    url: "WebService1.asmx/GetPerson121",
                    type: "POST",
                    contentType: "application/json",
                    data: "{'Id':2}",
                    dataType:"json",
                    onSuccess: function (data) {
                        console.log(data);

                    },
                    onError: function (status, xhr) {
                        console.log(status);
                    },
                    onTimeOut: function (status, xhr) {
                        console.log(status);

                    }
                });
            });
        })

    </script>
</head>
<body>
    <form id="form1" runat="server">
       <input id="Button1" type="button" value="调用后台方法" />
          <input id="Button2" type="button" value="调用后台方法" />
                    <input id="Button3" type="button" value="调用后台方法" />
    </form>
</body>
</html>
