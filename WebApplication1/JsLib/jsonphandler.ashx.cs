using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.JsLib
{
    /// <summary>
    /// jsonphandler 的摘要说明
    /// </summary>
    public class jsonphandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string callback = context.Request["callback"];
            string response = string.Format("'value1':'{0}','value2':'{1}'", context.Request.QueryString["p1"], context.Request.QueryString["p2"]);
            string call = callback + "({" + response + "})";
            context.Response.Write(call);

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}