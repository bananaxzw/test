﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.JsLib.UI
{
    /// <summary>
    /// bottomloaded 的摘要说明
    /// </summary>
    public class bottomloaded : IHttpHandler
    {
        static int  i = 0;


        public void ProcessRequest(HttpContext context)
        {
            System.Threading.Thread.Sleep(2000);
            context.Response.ContentType = "text/plain";
            
            context.Response.Write("<li>"+i+"加载</li><li>"+i+"加载</li>");
            i++;
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