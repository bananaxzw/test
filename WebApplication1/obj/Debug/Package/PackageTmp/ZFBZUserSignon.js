/********************************************************************************************
* 文件名称:	ZFBZUserSignon.js
* 设计人员:	许志伟 依赖common.js做常规处理 common.js要预先与此加载
* 设计时间:	
* 功能描述:	住房保障单点控件
*		
是用方法如下
     var UserSinon = new ZFBZUserSignon("http://193.100.100.166:807/newsignonwebservice"); //初始化单点控件 提供webservice地址
        function Login() {
            var name = document.getElementById("Text1").value;
            var pwd = document.getElementById("Text2").value;
            var isSuccess = UserSinon.Login(name, pwd);//登录 传入userName和pwd
            if (isSuccess) {
                var Guid = UserSinon.UserGetGUID();  //如果用户已经登录成功 会返回一个guid
                alert(Guid);
            }
        }
        window.onload = function() {
            if (UserSinon.UserIsValidGUID()) {    //判断用户的guid是否有效 有效的话 就自动登录
                var Guid = UserSinon.UserGetGUID();
                alert(Guid);
            }
            else { }

        }

    function loginOut() {
        var tt = UserSinon.LoginOut();  //注销
        alert(tt);
    }

* 注意事项:	
*
* 版权所有:	Copyright (c) 2011, Fujian SIRC
*
* 修改记录: 	修改时间		人员		修改备注
*				----------		------		-------------------------------------------------
*
********************************************************************************************/

;
(function() {

    //全局保存单点控件obj 保证只有一个
    var ZFBZUserSignonObj;
    //工厂类
    var ZFBZUserSignonClassFactory = {
        create: function() {
            return function() {
                this.InitSignonObj.apply(this, arguments);
            }
        }
    }

    //单点控件类
    window.ZFBZUserSignon = ZFBZUserSignonClassFactory.create();
    ZFBZUserSignon.prototype = {
        InitSignonObj: function(webServerAddress) {
            this.comObj = CreateSignonActiveXObject(webServerAddress);

        },
        toString: function() {
            return "单点控件";
        },
        Login: function(userName, usrPWD) {
            ///	<summary>
            ///单点登录
            ///	</summary>
            ///	<param name="userName" type="String">
            ///用户名
            ///	</param>
            ///	<param name="usrPWD" type="String">
            ///密码
            ///	</param>
            ///	<returns type="Boolean" />
            if (checkSignonComIsExist(this.comObj)) {
                this.comObj.WebSvcUserName = userName;
                this.comObj.WebSvcUserPassWord = usrPWD;
                var IsSuccess = this.comObj.UserLogin();
                return IsSuccess;

            }
            else {
                return false;
            }

        },
        UserGetGUID: function() {
            ///	<summary>
            ///获取用户Guid
            ///	</summary>
            ///	<returns type="String" >返回用户guid</returns>
            if (checkSignonComIsExist(this.comObj)) {
                return this.comObj.UserGetGUID();
            }
            else {
                return null;
            }
        },
        UserIsValidGUID: function() {
            ///	<summary>
            ///验证用户Guid是否有效
            ///	</summary>
            ///	<returns type="Boolean" >是否有效</returns>
            if (checkSignonComIsExist(this.comObj)) {
                return this.comObj.UserIsValidGUID();
            }
            else {
                return false;
            }
        },
        LoginOut: function() {
            ///	<summary>
            ///注销
            ///	</summary>
            ///	<returns  type="Boolean" >是否有效</returns>
            if (checkSignonComIsExist(this.comObj)) {
                return this.comObj.UserLogoff();
            }
            else {
                return false;
            }

        },
        CheckSignonObj: function() {
            ///	<summary>
            ///验证单点控件是够存在
            ///	</summary>
            ///	<returns  type="Boolean" >/returns>
            return checkSignonComIsExist(this.comObj);

        },
        GetMsg: function() {
            ///	<summary>
            ///监视控件消息
            ///	</summary>
            ///	<returns  type="Boolean" >如果返回的是LOGOFF表示单点在其他地方登录</returns>
            if (checkSignonComIsExist(this.comObj)) {
                return this.comObj.GetMsgInfo();
            }
            else {
                return null;
            }
        }
    }

    function CreateSignonActiveXObject(webServerAddress) {
        if (!ZFBZCommon.UserBroswerHelper.IsIE()) {
            alert("单点控件只能在IE浏览器下使用，请使用IE浏览器！");
            return null;
        }
        try {
            if (ZFBZUserSignonObj != null && ZFBZUserSignonObj != undefined) {
                return ZFBZUserSignonObj;
            }
            else {
                var Ccom = new ActiveXObject("UserInformation.clsUserInformation");
                Ccom.WebSvcAddress = webServerAddress;
                ZFBZUserSignonObj = Ccom;
                return Ccom;
            }
        }
        catch (e) {
            alert("单点登录控件初始化失败，请确保单点控件已经安装！");
            return null; // alert("单点登录控件初始化失败，请确保单点控件已经安装！");
        }
    }

    function checkSignonComIsExist(com) {
        if (com == null) {
            alert("单点登录控件初始化失败，请确保单点控件已经安装！");
            return false;
        }
        return true;
    }

    function isFunction(obj) {
        return (typeof obj == 'function');
    }
})();

