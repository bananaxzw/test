<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AutoComplete.aspx.cs" Inherits="JavascriptComponent.AutoCompete.AutoComplete" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <script src="jquery-1.4.1-vsdoc.js" type="text/javascript"></script>
    <script language="JScript">
        function document.onkeydown() {
            var rowsArray = document.all('oTable').rows;
            for (var i = 0; i < rowsArray.length; i++) {
                if (rowsArray[i].children[0].style.backgroundColor == '#dcdcdc') {
                    switch (window.event.keyCode) {
                        case 38:
                            if (i - 1 >= 0) {
                                rowsArray[i - 1].children[0].style.backgroundColor = '#dcdcdc';
                                rowsArray[i].children[0].style.backgroundColor = '';
                            }
                            break;
                        case 40:
                            if (i + 1 <= rowsArray.length - 1) {
                                rowsArray[i + 1].children[0].style.backgroundColor = '#dcdcdc';
                                rowsArray[i].children[0].style.backgroundColor = '';
                            }
                            break;
                    }
                    break;
                }
            }
        }
        function document.onclick() {
            if (window.event.srcElement.tagName != 'TD') { return; }
            var rowsArray = document.all('oTable').rows;
            for (var i = 0; i < rowsArray.length; i++) {
                if (rowsArray[i].cells[0] == window.event.srcElement) {
                    rowsArray[i].cells[0].style.backgroundColor = '#dcdcdc';
                } else {
                    rowsArray[i].cells[0].style.backgroundColor = '';
                }
            }
        }  
    </script>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    </div>
    </form>
</body>
</html>
