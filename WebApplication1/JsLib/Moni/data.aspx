<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="data.aspx.cs" Inherits="WebApplication1.JsLib.Moni.data" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="jQuery-core.js.js" type="text/javascript"></script>
    <script src="Jq-data.js" type="text/javascript"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div id="msg">
    
    </div>
    <script>
    

  console.log($("#msg").data("name", "Hello, world."));
 console.log($("#msg").data("name"));
 console.log($("#msg").removeData("name"));
console.log($("#msg").data("name"));
    </script>
    </form>
</body>
</html>
