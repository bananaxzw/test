<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UIBlockElement.aspx.cs" Inherits="JavascriptComponent.CalvinUI.UIBlockElement" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
      <script src="JS/jquery.min.js" type="text/javascript"></script>
    <script src="JS/CalvinBase.js" type="text/javascript"></script>
        <script src="JS/CalvinPanel.js" type="text/javascript"></script>
    <script src="JS/CalvinUIBlock.js" type="text/javascript"></script>
      <link href="CSS/default/panel.css" rel="stylesheet" type="text/css" />
      <script type="text/javascript">
          $(document).ready(function () {
            //  $("#safsaf").CalvinUIBlock("close");
              //$("#safsaf").CalvinUIBlock({ blockElement: window });
              $("#safsaf").CalvinUIBlock({ blockElement: document.getElementById("sfs") });
          })

          function Button1_onclick() {
              $("#safsaf").CalvinUIBlock("close");
          }

          function Button2_onclick() {
              $("#safsaf").CalvinUIBlock("open");
          }

      </script>
    <style type="text/css">
        #Button2
        {
            height: 21px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <input id="Button1" type="button" value="button" onclick="return Button1_onclick()" />
    <input id="Button2" type="button" value="button" onclick="return Button2_onclick()" />
    <div id="sfs" style=" height:800px; width:800px; margin:auto auto;">
    sfsas
    <div id="safsaf" title="sfssf" style=" height:20px; width:300px; margin:auto auto;">
    <img src="CSS/default/images/ajax-loader.gif" />
    </div>
    </div>
    </form>
</body>
</html>
