using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace WebApplication1.upload
{
    /// <summary>
    /// Handler1 的摘要说明
    /// </summary>
    public class Handler1 : IHttpHandler
    {
        private const int UploadFileLimit = 3;//上传文件数量限制

        private string _msg = "上传成功！";//返回信息
        public void ProcessRequest(HttpContext context)
        {
            System.Threading.Thread.Sleep(5000);
            context.Response.ContentType = "text/plain";
            context.Response.Charset = "utf-8";
            HttpPostedFile oFile = context.Request.Files["Filedata"];
            string strUploadPath = HttpContext.Current.Server.MapPath("file");
            if (oFile != null)
            {
                if (!Directory.Exists(strUploadPath))
                {
                    Directory.CreateDirectory(strUploadPath);
                }
                oFile.SaveAs(Path.Combine(strUploadPath, oFile.FileName));
                context.Response.Write("1");

            }
            else
            {
                context.Response.Write("0");
            }
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