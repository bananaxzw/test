using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;

namespace WebApplication1.JsLib
{
    /// <summary>
    /// WebService1 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消对下行的注释。
    [System.Web.Script.Services.ScriptService]
    //[GenerateScriptType(typeof(Person))]
    public class WebService1 : System.Web.Services.WebService
    {

        [WebMethod]
        public string HelloWorld()
        {
           
        
            return "Hello World";
        }
        [WebMethod]
        public string HelloWorld1(string id)
        {
           

            return "Hello World";
        }

        [WebMethod]
        public string HelloWorld2()
        {
            System.Threading.Thread.Sleep(3000);
            throw new Exception("sfsf");

            return "<a>1";
        }
        [WebMethod]
        public  string GetPerson11()
        {
            Person p1 = new Person("ssss", 1);
            Person p2 = new Person("sss1s", 2);
            List<Person> list = new List<Person>();
            list.Add(p1);
            list.Add(p2);
            
            return Newtonsoft.Json.JsonConvert.SerializeObject(list);
             

        }

        [WebMethod]
        public List<Person> GetPerson121(string Id)
        {
            Person p1 = new Person("ssss", 1);
            Person p2 = new Person("sss1s", 2);
            List<Person> list = new List<Person>();
            list.Add(p1);
            list.Add(p2);
            return list;
        }
    }
}
