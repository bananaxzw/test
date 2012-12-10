using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
namespace JavascriptComponent.AutoCompete
{
    public partial class AutoComplete : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        [WebMethod]
        public static List<valuetext> GetProduct(string key)
        {
            List<valuetext> list = new List<valuetext>();
            SqlConnection con = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["AdventureWorks"].ToString());
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandText = "SELECT TOP 10 [ProductID],[Name]  FROM [AdventureWorks].[Production].[Product] where Name like '%" + key + "%'";
            SqlDataReader reader = null;
            try
            {
                con.Open();

                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    valuetext tt = new valuetext();
                    tt.text = reader["Name"].ToString();
                    tt.value = Int32.Parse(reader["ProductID"].ToString());
                    list.Add(tt);
                }

            }
            finally
            {
                reader.Close();
                reader = null;
                con.Close();
            }
            return list;

        }


        [WebMethod]
        public static List<valuetext> GetProductExtendData(string key, string Color)
        {
            List<valuetext> list = new List<valuetext>();
            SqlConnection con = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["AdventureWorks"].ToString());
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandText = "SELECT TOP 10 [ProductID],[Name]  FROM [AdventureWorks].[Production].[Product] where Color='"+Color+"' AND  Name like '%" + key + "%'";
            SqlDataReader reader = null;
            try
            {
                con.Open();

                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    valuetext tt = new valuetext();
                    tt.text = reader["Name"].ToString();
                    tt.value = Int32.Parse(reader["ProductID"].ToString());
                    list.Add(tt);
                }

            }
            finally
            {
                reader.Close();
                reader = null;
                con.Close();
            }
            return list;

        }


        [WebMethod]
        public static List<valuetext> GetPerson()
        {
            List<valuetext> l = new List<valuetext>();
            valuetext s = new valuetext() { text = "许志伟1", value = 1 };
            l.Add(s);
            valuetext s1 = new valuetext() { text = "许志伟2", value = 2 };
            l.Add(s1);
            valuetext s2 = new valuetext() { text = "许志伟3", value = 3 };
            l.Add(s2);
            return l;
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