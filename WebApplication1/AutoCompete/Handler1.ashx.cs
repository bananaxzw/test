using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.AutoCompete
{
    /// <summary>
    /// Handler1 的摘要说明
    /// </summary>
    public class Handler1 : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            List<valuetext> l = new List<valuetext>();
            valuetext s = new valuetext() { text = "许志伟1", value = 1 };
            l.Add(s);
            valuetext s1 = new valuetext() { text = "许志伟2", value = 2 };
            l.Add(s1);
            valuetext s2 = new valuetext() { text = "许志伟3", value = 3 };
            l.Add(s2);
            var sss = Newtonsoft.Json.JsonConvert.SerializeObject(l);
            context.Response.Write(sss);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        public class valuetext
        {
            public int value
            {
                get;
                set;
            }
            public string text
            {
                get;
                set;
            }
        }
    }
}