<%@ WebHandler Language="c#" Class="File_WebHandler" Debug="true" %>

using System;
using System.Web;
using System.IO;

public class File_WebHandler : IHttpHandler
{    
    private const int UploadFileLimit = 3;//上传文件数量限制
	
    private string _msg = "上传成功！";//返回信息

    public void ProcessRequest(HttpContext context)
    {
        int iTotal = context.Request.Files.Count;

        if (iTotal == 0)
        {
            _msg = "没有数据";
        }
        else
        {
            int iCount = 0;

            for (int i = 0; i < iTotal; i++)
            {
                HttpPostedFile file = context.Request.Files[i];

                if (file.ContentLength > 0 || !string.IsNullOrEmpty(file.FileName))
                {
                    //保存文件
                    file.SaveAs(System.Web.HttpContext.Current.Server.MapPath("./file/" + Path.GetFileName(file.FileName)));

                    //这里可以根据实际设置其他限制
                    if (++iCount > UploadFileLimit)
                    {
                        _msg = "超过上传限制：" + UploadFileLimit;
                        break;
                    }
                }
            }
        }
        context.Response.Write("<script>window.parent.Finish('" + _msg + "');</script>");
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}