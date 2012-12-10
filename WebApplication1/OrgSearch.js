//机构名称搜索
var ajaxObj;

function DivMatchStuId(orgName, ajaxType) {
    ajaxObj = ajaxType;
    var tbx = document.getElementById("InstitutionNameTB");
    if (tbx.value != "") {
        ajaxType.BindInstutitionData(orgName, DivCallBack);
    }
    else {
        document.getElementById("ddldiv").style.display = "none";
    }
}

function DivCallBack(response) {
   var tab = document.getElementById("ddl");
    tab.innerText = "";
    setdiv();
    if (response.value != null && response.value.length != 0) {
        for (var i = 0; i < response.value.length; ++i) {
            var tr = tab.insertRow(); //create tr   
            var td1 = tr.insertCell(0);
            td1.style.borderBottom = 0;
            td1.onmouseout = function() { this.className = "mouseOut"; };
            td1.onmouseover = function() { this.className = "mouseOver"; };
            var id = response.value[i];
            var name = response.value[++i];
            td1.style.cursor = "hand";
            td1.innerHTML = "<a href='#' style ='color :Black'>" + name + "</a>";
            td1.attachEvent("onclick", buttionClick(name, id));
        }
    }
    else {
        document.getElementById("ddldiv").style.display = 'none';
    }
}

function setdiv() {
    var tbx = document.getElementById("InstitutionNameTB");
    var ddldiv = document.getElementById("ddldiv");
    ddldiv.style.display = '';
    if (tbx.value == "") {
        ddldiv.style.display = 'none'; //如果输入框被清空了，也不可见
    }
    var etop = tbx.offsetTop;
    var eleft = tbx.offsetLeft;
    ddldiv.style.top = etop + 20;
    ddldiv.style.left = eleft;
    if (document.getElementById("messageSerch").value == "messageSerch") {
        ddldiv.style.top = etop-20;
        ddldiv.style.left = eleft+310;

    }
   if (document.getElementById("messageSerch").value == "appTree") {
       ddldiv.style.top = etop-5;
       ddldiv.style.left = eleft-10;

   }
   if (document.getElementById("messageSerch").value == "OnlineClient") {
       ddldiv.style.top = etop-20;
       ddldiv.style.left = eleft+265;

   }
   if (document.getElementById("messageSerch").value == "UserLoginHistory") {

       ddldiv.style.top = $("#InstitutionNameTB").offset().top-20;
       ddldiv.style.left = $("#InstitutionNameTB").offset().left;

   }

   
}

var buttionClick = function(name, id) {
    return function() {
        if (document.getElementById("InstitutionCodeTB") != null) {
            selectthis(name, id);
        }
        else {
            selectthisTree(name, id);
        }
    }
}

//OraganizationTree页面
function selectthisTree(name, id) {
    document.getElementById('InstitutionNameTB').value = name;
    document.getElementById("orgID").value = id;
    if (document.getElementById("Button1") != null) {
        document.getElementById("Button1").click();
    }
    ddldiv.style.display = 'none'; //如果输入框被清空了，也不可见
}

//OraganizationInfo页面
function selectthis(name, id) {
    document.getElementById('InstitutionNameTB').value = name;
    document.getElementById('InstitutionCodeTB').value = id;
    document.getElementById('orgCode').value = id;
    ddldiv.style.display = 'none'; //如果输入框被清空了，也不可见
    ajaxObj.GetInstutition(id, InsCallBack);
}

var tempShiCode;
var tempXianCode;
function InsCallBack(response) {
    if (response.value != null && response.value.length != 0) {
        document.getElementById("InstitutionTypeList").value = response.value[0];
        document.getElementById("JieDaoList").value = response.value[1];
        document.getElementById("DepartmentPostCodeTB").value = response.value[2];
        if (!response.value[3] == "") {
            var shengCode = response.value[3].substring(0, 2) + "0000";
            var shiCode = response.value[3].substring(0, 4) + "00";
            tempXianCode = response.value[3];
            document.getElementById("ShengList").value = shengCode;
            tempShiCode = shiCode;
            InsShengload(shengCode);
        }
    }
}

function InsShengload(ClassID) {
    document.getElementById("XianCode").value = ClassID;
    ajaxObj.GetShi(ClassID, InsShiCallBack);
}

function InsShiCallBack(response) {
    var ExistDepList = document.getElementById("ShiList");
    document.getElementById("XianList").innerHTML = "";
    ExistDepList.innerHTML = "";
    if (response.value != null && response.value.length != 0) {
        document.getElementById("ShiCode").value = tempShiCode;
        document.getElementById("XianCode").value = tempShiCode;
        for (var i = 0; i < response.value.length; i++) {
            ExistDepList.options[ExistDepList.options.length] = new Option(response.value[i], response.value[++i]); //将string数组里面的元素填充到下拉框中
        }
        ExistDepList.value = tempShiCode;
        ajaxObj.GetBorouth(tempShiCode, InsXianCallBack);
    }
}

function InsXianCallBack(response) {
    var ExistDepList = document.getElementById("XianList");
    ExistDepList.innerHTML = "";
    if (response.value != null && response.value.length != 0) {
        document.getElementById("XianCode").value = tempXianCode;
        for (var i = 0; i < response.value.length; i++)
            ExistDepList.options[ExistDepList.options.length] = new Option(response.value[i], response.value[++i]); //将string数组里面的元素填充到下拉框中
    }
    ExistDepList.value = tempXianCode;
}


