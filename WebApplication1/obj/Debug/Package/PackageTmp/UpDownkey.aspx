<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UpDownkey.aspx.cs" Inherits="JavascriptComponent.UpDownkey" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript">
        function ClassA(sColor) {
            this.color = sColor;
            this.sayColor = function () {
                alert(this.color);
            };
            this.tt = "asas";
        }
       

        function ClassB(sColor, sName) {
            //this.newMethod = ClassA;
            //this.newMethod(color);
            //delete this.newMethod;
            ClassA.call(this, sColor);

            this.name = sName;
            this.sayName = function () {
                alert(this.name);
            };
        }



        var objB = new ClassB("red", "John");

        objB.sayColor();
        objB.sayName();
        alert(objB.tt);

    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    </div>
    </form>
</body>
</html>
