/********************************************************************************************
* 文件名称:	ZFBZAreaSelectAll.js
* 设计人员:	魏敏
* 设计时间:	
* 功能描述:	住房保障系统的区划下拉框联动  依赖于 Common.js提供常用处理(加了所有节点)
*		
*		
* 注意事项:	
XML格式如下
<Address>
<Province Text="" Value="">
<City  Text="" Value="">
<Country Text="" Value=""/>
</City>
 
<Province>
</Address>
*
* 版权所有:	Copyright (c) 2011, Fujian SIRC
*
* 修改记录: 	修改时间		人员		修改备注
*				----------		------		-------------------------------------------------
*
********************************************************************************************/
//首先需要初始化 Init();
(function() {
    window.ZFBZAreaSelect = function(ProviceSelectId, CitySelectId, CountrySelectId, xmlStr) {
        ///<summary>
        /// 住房保障下拉框联动
        ///</summary>
        ///<param name="ProviceSelectId" type="String">省级select的ID</param>
        ///<param name="CitySelectId" type="String">市级select的ID</param>
        ///<param name="CountrySelectId" type="String">区级select的ID</param>
        ///<param name="xmlStr" type="String">xml字符串</param>
        var ProvinceSelect = document.getElementById(ProviceSelectId);
        var CitySelect = document.getElementById(CitySelectId);
        var CountrySelect = document.getElementById(CountrySelectId);
        var XmlDoc = ZFBZCommon.XmlDocHelper.loadXML(xmlStr);
        function ClearSelect(obj) {
            if (obj) {
                var len = obj.options.length;
                if (len > 0) {
                    for (var i = len; i >= 0; i--) {
                        obj.remove(i);
                    }
                }
            }
        }
        function InitProvinceSelect() {
            ClearSelect(ProvinceSelect);
            var ProviceNodes = XmlDoc.getElementsByTagName("Province");
            if (ProviceNodes.length != 0) {
                for (var i = 0; i < ProviceNodes.length; i++) {
                    var ProvinceNode = ProviceNodes[i]
                    var varItem = new Option(ProvinceNode.getAttribute("Text"), ProvinceNode.getAttribute("Value"));
                    ProvinceSelect.options.add(varItem);
                }
            }
            else {
                //没有的话就默认福建省
                var varItem = new Option('福建省', "350000");
                ProvinceSelect.options.add(varItem);
            }
            ProvinceSelect.disabled = true; //暂时不需要省选择

        }
        function InitCitySelect() {
            ClearSelect(CitySelect);
            //省的人进来要有省直属选项  目前就只有福建省 暂时写死
            if (XmlDoc.getElementsByTagName("Province").length > 0) {
                var varItem = new Option('所有', "350000")
                CitySelect.options.add(varItem);

            }
            var CityNodes = XmlDoc.getElementsByTagName("City");
            for (var i = 0; i < CityNodes.length; i++) {
                var CityNode = CityNodes[i]
                var varItem = new Option(CityNode.getAttribute("Text"), CityNode.getAttribute("Value"));
                CitySelect.options.add(varItem);

            }
            if (arguments[0] != null && arguments[0].type != "change" && arguments[0] != "") {
                CitySelect.value = arguments[0].toString();
            }
        }

        function InitCountrySelect() {
            var CityValue = CitySelect.value;
            var CityNode;
            var CountryNodes;
            //市下拉框是省直属选项 不获取区县数据 这里暂时只有福建省 写死
            if (CityValue != "350000") {
                CityNode = XmlDoc.selectSingleNode("//City[@Value='" + CityValue + "']");
                if (CityNode != null) {
                    CountryNodes = CityNode.childNodes;
                }
            }

            ClearSelect(CountrySelect);
            //市下拉框是省直属选项 不获取区县数据 这里暂时只有福建省 写死
            if (CountryNodes != undefined) {
                var SXQNode = new Option("所有", CityNode.getAttribute("Value")); //初始化市辖区节点
                CountrySelect.options.add(SXQNode);
                for (var i = 0; i < CountryNodes.length; i++) {
                    var CountryNode = CountryNodes[i]
                    var varItem = new Option(CountryNode.getAttribute("Text"), CountryNode.getAttribute("Value"));
                    CountrySelect.options.add(varItem);

                }
            } else { 
                    var SXQNode = new Option("所有", "350000"); 
                CountrySelect.options.add(SXQNode);
            }
            if (arguments[0] != null && arguments[0].type != "change" && arguments[0] != "") {
                CountrySelect.value = arguments[0].toString();

            }
        }

        ZFBZCommon.eventHepler.addEventHandler(CitySelect, "change", InitCountrySelect);

        this.Init = function() {
            if (XmlDoc.xml != "" && (arguments[0] == null || arguments[0] == "")) {
                InitProvinceSelect();
                InitCitySelect();
                InitCountrySelect();
                return;
            }
            if (XmlDoc.xml != "" && arguments[0] != null) {
                InitProvinceSelect();

                var initCode = arguments[0].toString();
                //省直属项目
                if (initCode.substr(2, 4) == "0000") {
                    InitCitySelect();
                    InitCountrySelect();
                    return;
                }
                //市本级项目
                if (initCode.substr(4, 2) == "00") {
                    InitCitySelect(initCode);
                    InitCountrySelect();
                    return;
                }
                else {
                    //平潭特殊处理
                    if (initCode == "350128") {
                        InitCitySelect(initCode);
                    }
                    else {
                        InitCitySelect(initCode.substr(0, 4) + "00");
                    }
                    InitCountrySelect(initCode);
                }

            }
        }


    }
})();