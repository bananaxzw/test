<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="boundingClientRec.aspx.cs" Inherits="WebApplication1.boundingClientRec" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
  
    <script src="JsLib/jq1.72.js" type="text/javascript"></script>
</head>

<body  style="border:5px solid red;position:relative; padding:0px; margin:0px; font-size:62.5%">
    <div style="  font-size:2em; position:absolute; top:0px; margin-top:20px; background-color:White; border:5px solid red; width:200px;" id="sss">
    safasfas
    <div id="ffff" style=" margin-top:20%">safsafasf</div>
    </div>
    <script type="text/javascript">
        var sss = document.getElementById("sss");
        var ffff = document.getElementById("ffff");
        var tt = document.getElementById("sss").getBoundingClientRect().top;
        var mm = document.getElementById("sss").offsetTop;
       console.log(document.defaultView.getComputedStyle(sss, null).getPropertyValue("fontSize"));
        console.log(tt);
        console.log(mm);
        console.log(ffff.currentStyle["marginTop"]);
    
    </script>
   
</body>
</html>
