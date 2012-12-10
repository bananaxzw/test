<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="dimensions.aspx.cs" Inherits="WebApplication1.JsLib.dimensions" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="CoreJq.js" type="text/javascript"></script>
    <script src="eventJQ.js" type="text/javascript"></script>
    <script src="jquery.dimensions.js" type="text/javascript"></script>
    <script src="SL.Core.js" type="text/javascript"></script>
    <script src="SL.Dom.js" type="text/javascript"></script>
>
</head>
<body  style=" margin:10px; padding:40px;">


 <div style="padding:0px; margin:0px; overflow:auto; border:1px solid red; height:1000px;" id="safsf">
 <div id="sfsa" style=" height:2000px; width:100px;border:2px solid red;">safsaffsa</div>
 </div>
 <script>
 jQuery("#sfsa").bind("click",{"fssa":"sfsaf"},function(){
 alert(this.tagName);
 });
 
 </script>
<script>
   // alert(document.getElementById("sfsa").offsetTop);
   // alert($("#sfsa").offset().top);
    // $(document).scrollTop(10);
    var tt = new SL();
    tt.Dom.scrollTop(document.getElementById("safsf"), 100);
    alert(tt.Dom.scrollTop(document.getElementById("safsf")));
    tt.Dom.scrollTop(document, 100);
    alert(tt.Dom.scrollTop(document));
    //document.documentElement.scrollTop = 200;
  //  $("#safsf").scrollTop(100);
   // alert(document.getElementById("safsf").offsetTop);
   // alert($("#safsf").offset().top);
</script>

</body>
</html>
