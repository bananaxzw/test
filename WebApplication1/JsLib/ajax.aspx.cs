using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Services;
using Newtonsoft.Json;

namespace WebApplication1.JsLib
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    //若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消对下行的注释。 
    [System.Web.Script.Services.ScriptService]
    [GenerateScriptType(typeof(Person))]
    public partial class ajax : System.Web.UI.Page
    {
      
        [WebMethod]
        public  string HelloWorld()
        {
            return "Hello World";
        }

        [WebMethod]
        public  string GetPerson(string name, string age)
        {
            var s = HttpContext.Current.Request;
            return name + age;

            //return new Person()
            //{
            //    Name = name,
            //    Age = age
            //};
        }



        [WebMethod]
        public static List<Person> GetPerson11()
        {
            Person p1 = new Person("ssss", 1);
            Person p2 = new Person("sss1s", 2);
            List<Person> list = new List<Person>();
            list.Add(p1);
            list.Add(p2);
            return list;

        }


        [WebMethod]
        public static string GetPerson112()
        {
            Person p1 = new Person("ssss", 1);
            Person p2 = new Person("sss1s", 2);
            List<Person> list = new List<Person>();
            list.Add(p1);
            list.Add(p2);

            string ss = JsonConvert.SerializeObject(list);
            return ss;

        }
        [WebMethod]
        public static string GerPersonName(Person person)
        {
            return person.Name;

        }

        [WebMethod]
        public static string getPersonName()
        {
            var s = HttpContext.Current.Request;

            //return p.Name;
            return "'1";
        }
    }
}